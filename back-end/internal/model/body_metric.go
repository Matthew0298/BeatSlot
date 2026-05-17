package model

import "time"

type BodyMetric struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	UserID            uint      `gorm:"not null;index" json:"user_id"`
	HeightCm          *float64  `json:"height_cm"`
	WeightKg          *float64  `json:"weight_kg"`
	BodyFatPercentage *float64  `json:"body_fat_percentage"`
	MeasuredAt        time.Time `gorm:"not null;default:now()" json:"measured_at"`
	CreatedAt         time.Time `json:"created_at"`
}
