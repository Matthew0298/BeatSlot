package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gymbook.com/mod/internal/repository"
	"gymbook.com/mod/internal/service"
)

func StaffListBookings(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	status := c.Query("status")
	bookings, err := service.ListOrgBookings(org.ID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

func StaffListMembers(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	members, err := service.ListMembers(org.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"members": members})
}

func StaffListActivities(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	activities, err := service.ListActivities(org.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"activities": activities})
}

func StaffCreateSession(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	var input service.CreateSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	session, err := service.CreateSession(org.ID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"session": session})
}

func StaffGetOrganization(c *gin.Context) {
	org, err := repository.GetDefaultOrganization()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "organization not configured"})
		return
	}
	c.JSON(http.StatusOK, org)
}
