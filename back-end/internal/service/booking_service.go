package service

import (
	"errors"
	"fmt"
	"time"

	"gymbook.com/mod/internal/model"
	"gymbook.com/mod/internal/repository"
)

var (
	ErrSessionFull       = errors.New("session is full")
	ErrInsufficientCredits = errors.New("insufficient credits")
	ErrAlreadyBooked     = errors.New("already booked for this session")
	ErrCancellationWindow = errors.New("cancellation window expired")
)

const cancellationHours = 24

func ListSessions(orgID uint) ([]model.Session, error) {
	return repository.ListUpcomingSessions(orgID, time.Now())
}

func ListPackages(orgID uint) ([]model.CreditPackage, error) {
	return repository.ListCreditPackages(orgID)
}

func CreateBooking(userID, sessionID uint) (*model.Booking, error) {
	session, err := repository.GetSessionByID(sessionID)
	if err != nil {
		return nil, err
	}
	if session.Status != "scheduled" {
		return nil, fmt.Errorf("session not available")
	}
	if session.SpotsLeft <= 0 {
		return nil, ErrSessionFull
	}
	if _, err := repository.GetUserBookingForSession(userID, sessionID); err == nil {
		return nil, ErrAlreadyBooked
	}
	membership, err := repository.GetMembership(session.OrganizationID, userID)
	if err != nil {
		org, oErr := repository.GetDefaultOrganization()
		if oErr != nil {
			return nil, oErr
		}
		_ = repository.EnsureMembership(org.ID, userID, "member", 10)
		membership, err = repository.GetMembership(session.OrganizationID, userID)
		if err != nil {
			return nil, err
		}
	}
	if membership.CreditsBalance < session.CreditsRequired {
		return nil, ErrInsufficientCredits
	}
	booking := &model.Booking{
		SessionID:      sessionID,
		UserID:         userID,
		OrganizationID: session.OrganizationID,
		Status:         "confirmed",
	}
	if err := repository.CreateBooking(booking); err != nil {
		return nil, err
	}
	membership.CreditsBalance -= session.CreditsRequired
	if err := repository.UpdateMembershipCredits(membership); err != nil {
		return nil, err
	}
	refID := booking.ID
	_ = repository.CreateCreditTransaction(&model.CreditTransaction{
		UserID:         userID,
		OrganizationID: session.OrganizationID,
		Amount:         -session.CreditsRequired,
		Reason:         "booking",
		ReferenceID:    &refID,
	})
	return repository.GetBookingByID(booking.ID)
}

func CancelBooking(userID, bookingID uint) error {
	booking, err := repository.GetBookingByID(bookingID)
	if err != nil {
		return err
	}
	if booking.UserID != userID {
		return errors.New("forbidden")
	}
	if booking.Status != "confirmed" {
		return fmt.Errorf("booking not active")
	}
	if booking.Session != nil {
		hoursUntil := time.Until(booking.Session.StartAt).Hours()
		if hoursUntil < cancellationHours {
			return ErrCancellationWindow
		}
	}
	if err := repository.CancelBooking(booking); err != nil {
		return err
	}
	membership, err := repository.GetMembership(booking.OrganizationID, userID)
	if err != nil {
		return nil
	}
	credits := booking.Session.CreditsRequired
	membership.CreditsBalance += credits
	_ = repository.UpdateMembershipCredits(membership)
	refID := booking.ID
	_ = repository.CreateCreditTransaction(&model.CreditTransaction{
		UserID:         userID,
		OrganizationID: booking.OrganizationID,
		Amount:         credits,
		Reason:         "cancellation_refund",
		ReferenceID:    &refID,
	})
	return nil
}

func ListMyBookings(userID uint) ([]model.Booking, error) {
	return repository.ListUserBookings(userID)
}

func ListOrgBookings(orgID uint, status string) ([]model.Booking, error) {
	return repository.ListOrgBookings(orgID, status)
}

type CreateSessionInput struct {
	ActivityID      uint      `json:"activity_id"`
	StartAt         time.Time `json:"start_at"`
	EndAt           time.Time `json:"end_at"`
	Capacity        int       `json:"capacity"`
	CreditsRequired int       `json:"credits_required"`
	InstructorName  string    `json:"instructor_name"`
}

func CreateSession(orgID uint, input CreateSessionInput) (*model.Session, error) {
	if input.Capacity <= 0 {
		input.Capacity = 10
	}
	if input.CreditsRequired <= 0 {
		input.CreditsRequired = 1
	}
	s := &model.Session{
		OrganizationID:  orgID,
		ActivityID:      input.ActivityID,
		StartAt:         input.StartAt,
		EndAt:           input.EndAt,
		Capacity:        input.Capacity,
		CreditsRequired: input.CreditsRequired,
		InstructorName:  input.InstructorName,
		Status:          "scheduled",
	}
	if err := repository.CreateSession(s); err != nil {
		return nil, err
	}
	return repository.GetSessionByID(s.ID)
}

func ListActivities(orgID uint) ([]model.Activity, error) {
	return repository.ListActivities(orgID)
}

func ListMembers(orgID uint) ([]model.User, error) {
	return repository.ListMembers(orgID)
}

func GetMeProfile(userID uint) (map[string]interface{}, error) {
	user, err := repository.FindUserByID(userID)
	if err != nil {
		return nil, err
	}
	org, _ := repository.GetDefaultOrganization()
	result := map[string]interface{}{"user": user}
	if org != nil {
		membership, err := repository.GetMembership(org.ID, userID)
		if err == nil {
			result["membership"] = membership
			result["organization"] = org
		}
	}
	return result, nil
}

func PurchasePackage(userID, packageID uint) error {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		return err
	}
	packages, err := repository.ListCreditPackages(org.ID)
	if err != nil {
		return err
	}
	var pkg *model.CreditPackage
	for i := range packages {
		if packages[i].ID == packageID {
			pkg = &packages[i]
			break
		}
	}
	if pkg == nil {
		return fmt.Errorf("package not found")
	}
	membership, err := repository.GetMembership(org.ID, userID)
	if err != nil {
		_ = repository.EnsureMembership(org.ID, userID, "member", 0)
		membership, err = repository.GetMembership(org.ID, userID)
		if err != nil {
			return err
		}
	}
	membership.CreditsBalance += pkg.Credits
	if err := repository.UpdateMembershipCredits(membership); err != nil {
		return err
	}
	refID := pkg.ID
	return repository.CreateCreditTransaction(&model.CreditTransaction{
		UserID:         userID,
		OrganizationID: org.ID,
		Amount:         pkg.Credits,
		Reason:         "package_purchase",
		ReferenceID:    &refID,
	})
}
