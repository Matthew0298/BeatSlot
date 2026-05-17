package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gymbook.com/mod/internal/service"
)

func GetMe(c *gin.Context) {
	userID := c.GetUint("userID")
	profile, err := service.GetMeProfile(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, profile)
}

func GetMyBookings(c *gin.Context) {
	userID := c.GetUint("userID")
	bookings, err := service.ListMyBookings(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}
