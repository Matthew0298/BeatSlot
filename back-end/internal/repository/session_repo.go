package repository

import (
	"time"

	"gymbook.com/mod/internal/db"
	"gymbook.com/mod/internal/model"
)

func ListUpcomingSessions(orgID uint, from time.Time) ([]model.Session, error) {
	var sessions []model.Session
	err := db.DB.Preload("Activity").
		Where("organization_id = ? AND status = ? AND start_at >= ?", orgID, "scheduled", from).
		Order("start_at ASC").
		Find(&sessions).Error
	if err != nil {
		return nil, err
	}
	for i := range sessions {
		count, _ := CountConfirmedBookings(sessions[i].ID)
		sessions[i].BookedCount = int(count)
		sessions[i].SpotsLeft = sessions[i].Capacity - int(count)
	}
	return sessions, nil
}

func GetSessionByID(id uint) (*model.Session, error) {
	var s model.Session
	if err := db.DB.Preload("Activity").First(&s, id).Error; err != nil {
		return nil, err
	}
	count, _ := CountConfirmedBookings(s.ID)
	s.BookedCount = int(count)
	s.SpotsLeft = s.Capacity - int(count)
	return &s, nil
}

func CreateSession(s *model.Session) error {
	return db.DB.Create(s).Error
}

func ListActivities(orgID uint) ([]model.Activity, error) {
	var activities []model.Activity
	err := db.DB.Where("organization_id = ?", orgID).Order("name ASC").Find(&activities).Error
	return activities, err
}

func CreateActivity(a *model.Activity) error {
	return db.DB.Create(a).Error
}

func ListCreditPackages(orgID uint) ([]model.CreditPackage, error) {
	var packages []model.CreditPackage
	err := db.DB.Where("organization_id = ? AND active = ?", orgID, true).Order("credits ASC").Find(&packages).Error
	return packages, err
}
