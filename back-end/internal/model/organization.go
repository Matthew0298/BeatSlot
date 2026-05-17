package model

import "time"

type Organization struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:255;not null" json:"name"`
	Slug      string    `gorm:"size:100;not null;uniqueIndex" json:"slug"`
	LogoURL   string    `gorm:"type:text" json:"logo_url,omitempty"`
	Settings  string    `gorm:"type:jsonb;default:'{}'" json:"settings"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type OrganizationMembership struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	OrganizationID uint      `gorm:"not null" json:"organization_id"`
	UserID         uint      `gorm:"not null" json:"user_id"`
	Role           string    `gorm:"size:20;not null;default:member" json:"role"`
	CreditsBalance int       `gorm:"not null;default:0" json:"credits_balance"`
	CreatedAt      time.Time `json:"created_at"`
}
