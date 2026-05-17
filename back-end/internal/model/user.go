package model

import (
	"time"
)

type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Username      string    `gorm:"size:50;not null;uniqueIndex" json:"username"`
	Email         string    `gorm:"size:255;not null;uniqueIndex" json:"email"`
	PasswordHash  string    `gorm:"size:255;not null" json:"-"`
	Nome          string    `gorm:"size:100" json:"nome"`
	Cognome       string    `gorm:"size:100" json:"cognome"`
	CodiceFiscale string    `gorm:"size:16" json:"codice_fiscale"`
	Indirizzo     string    `gorm:"type:text" json:"indirizzo"`
	Phone         string    `gorm:"size:30" json:"phone"`
	BirthDate     string    `json:"birth_date"`
	Gender        string    `gorm:"size:10" json:"gender"`
	Role          string    `gorm:"size:20;not null;default:member" json:"role"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
