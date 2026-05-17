package controller

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gymbook.com/mod/internal/repository"
	"gymbook.com/mod/internal/service"
)

func ListSessions(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	sessions, err := service.ListSessions(org.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"sessions": sessions, "organization": org})
}

func ListPackages(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	packages, err := service.ListPackages(org.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"packages": packages})
}

func CreateBooking(c *gin.Context) {
	userID := c.GetUint("userID")
	var body struct {
		SessionID uint `json:"session_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	booking, err := service.CreateBooking(userID, body.SessionID)
	if err != nil {
		status := http.StatusBadRequest
		switch {
		case errors.Is(err, service.ErrSessionFull),
			errors.Is(err, service.ErrInsufficientCredits),
			errors.Is(err, service.ErrAlreadyBooked):
			status = http.StatusConflict
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"booking": booking})
}

func DeleteBooking(c *gin.Context) {
	userID := c.GetUint("userID")
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := service.CancelBooking(userID, uint(id)); err != nil {
		status := http.StatusBadRequest
		if errors.Is(err, service.ErrCancellationWindow) {
			status = http.StatusConflict
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "booking cancelled"})
}

func PurchasePackage(c *gin.Context) {
	userID := c.GetUint("userID")
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := service.PurchasePackage(userID, uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	profile, _ := service.GetMeProfile(userID)
	c.JSON(http.StatusOK, profile)
}
