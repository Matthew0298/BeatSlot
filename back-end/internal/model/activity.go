package model

import "time"

type Activity struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	OrganizationID    uint      `gorm:"not null" json:"organization_id"`
	Name              string    `gorm:"size:255;not null" json:"name"`
	Description       string    `gorm:"type:text" json:"description,omitempty"`
	CreditsPerSession int       `gorm:"not null;default:1" json:"credits_per_session"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type Session struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	OrganizationID  uint      `gorm:"not null" json:"organization_id"`
	ActivityID      uint      `gorm:"not null" json:"activity_id"`
	StartAt         time.Time `json:"start_at"`
	EndAt           time.Time `json:"end_at"`
	Capacity        int       `gorm:"not null;default:10" json:"capacity"`
	CreditsRequired int       `gorm:"not null;default:1" json:"credits_required"`
	InstructorName  string    `gorm:"size:255" json:"instructor_name,omitempty"`
	Status          string    `gorm:"size:20;not null;default:scheduled" json:"status"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	Activity     *Activity `gorm:"foreignKey:ActivityID" json:"activity,omitempty"`
	BookedCount  int       `gorm:"-" json:"booked_count,omitempty"`
	SpotsLeft    int       `gorm:"-" json:"spots_left,omitempty"`
}

type Booking struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	SessionID      uint       `gorm:"not null" json:"session_id"`
	UserID         uint       `gorm:"not null" json:"user_id"`
	OrganizationID uint       `gorm:"not null" json:"organization_id"`
	Status         string     `gorm:"size:20;not null;default:confirmed" json:"status"`
	CreatedAt      time.Time  `json:"created_at"`
	CancelledAt    *time.Time `json:"cancelled_at,omitempty"`

	Session *Session `gorm:"foreignKey:SessionID" json:"session,omitempty"`
	User    *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

type CreditPackage struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	OrganizationID uint      `gorm:"not null" json:"organization_id"`
	Name           string    `gorm:"size:255;not null" json:"name"`
	Credits        int       `gorm:"not null" json:"credits"`
	PriceCents     int       `gorm:"not null;default:0" json:"price_cents"`
	Active         bool      `gorm:"not null;default:true" json:"active"`
	CreatedAt      time.Time `json:"created_at"`
}

type CreditTransaction struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	UserID         uint      `gorm:"not null" json:"user_id"`
	OrganizationID uint      `gorm:"not null" json:"organization_id"`
	Amount         int       `gorm:"not null" json:"amount"`
	Reason         string    `gorm:"size:100;not null" json:"reason"`
	ReferenceID    *uint     `json:"reference_id,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
}
