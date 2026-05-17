package repository

import (
	"gymbook.com/mod/internal/db"
	"gymbook.com/mod/internal/model"
)

func GetDefaultOrganization() (*model.Organization, error) {
	var org model.Organization
	err := db.DB.Order("id ASC").First(&org).Error
	if err != nil {
		return nil, err
	}
	return &org, nil
}

func GetOrganizationByID(id uint) (*model.Organization, error) {
	var org model.Organization
	if err := db.DB.First(&org, id).Error; err != nil {
		return nil, err
	}
	return &org, nil
}

func EnsureMembership(orgID, userID uint, role string, initialCredits int) error {
	var existing model.OrganizationMembership
	err := db.DB.Where("organization_id = ? AND user_id = ?", orgID, userID).First(&existing).Error
	if err == nil {
		return nil
	}
	m := model.OrganizationMembership{
		OrganizationID: orgID,
		UserID:         userID,
		Role:           role,
		CreditsBalance: initialCredits,
	}
	return db.DB.Create(&m).Error
}

func GetMembership(orgID, userID uint) (*model.OrganizationMembership, error) {
	var m model.OrganizationMembership
	if err := db.DB.Where("organization_id = ? AND user_id = ?", orgID, userID).First(&m).Error; err != nil {
		return nil, err
	}
	return &m, nil
}

func UpdateMembershipCredits(m *model.OrganizationMembership) error {
	return db.DB.Save(m).Error
}
