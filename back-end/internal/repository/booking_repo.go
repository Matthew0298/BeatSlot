package repository

import (
	"time"

	"gymbook.com/mod/internal/db"
	"gymbook.com/mod/internal/model"
)

func CountConfirmedBookings(sessionID uint) (int64, error) {
	var count int64
	err := db.DB.Model(&model.Booking{}).
		Where("session_id = ? AND status = ?", sessionID, "confirmed").
		Count(&count).Error
	return count, err
}

func GetBookingByID(id uint) (*model.Booking, error) {
	var b model.Booking
	if err := db.DB.Preload("Session").Preload("Session.Activity").First(&b, id).Error; err != nil {
		return nil, err
	}
	return &b, nil
}

func GetUserBookingForSession(userID, sessionID uint) (*model.Booking, error) {
	var b model.Booking
	err := db.DB.Where("user_id = ? AND session_id = ?", userID, sessionID).First(&b).Error
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func CreateBooking(b *model.Booking) error {
	return db.DB.Create(b).Error
}

func SaveBooking(b *model.Booking) error {
	return db.DB.Save(b).Error
}

func ListUserBookings(userID uint) ([]model.Booking, error) {
	var bookings []model.Booking
	err := db.DB.Preload("Session").Preload("Session.Activity").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&bookings).Error
	return bookings, err
}

func ListOrgBookings(orgID uint, status string) ([]model.Booking, error) {
	var bookings []model.Booking
	q := db.DB.Preload("Session").Preload("Session.Activity").Preload("User").
		Where("organization_id = ?", orgID)
	if status != "" {
		q = q.Where("status = ?", status)
	}
	err := q.Order("created_at DESC").Find(&bookings).Error
	return bookings, err
}

func CreateCreditTransaction(tx *model.CreditTransaction) error {
	return db.DB.Create(tx).Error
}

func CancelBooking(b *model.Booking) error {
	now := time.Now()
	b.Status = "cancelled"
	b.CancelledAt = &now
	return db.DB.Save(b).Error
}
