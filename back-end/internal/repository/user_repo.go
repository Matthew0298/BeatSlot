package repository

import (
	"gymbook.com/mod/internal/db"
	"gymbook.com/mod/internal/model"
)

func CreateUser(user *model.User) error {
	return db.DB.Create(user).Error
}

func FindUserByEmail(email string, user *model.User) error {
	return db.DB.Where("LOWER(email) = LOWER(?)", email).First(user).Error
}

func FindUserByID(id uint) (*model.User, error) {
	var user model.User
	if err := db.DB.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func ListMembers(orgID uint) ([]model.User, error) {
	var users []model.User
	err := db.DB.
		Joins("JOIN organization_memberships om ON om.user_id = users.id").
		Where("om.organization_id = ?", orgID).
		Find(&users).Error
	return users, err
}
