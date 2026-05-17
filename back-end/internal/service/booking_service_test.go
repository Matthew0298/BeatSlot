package service

import (
	"errors"
	"testing"
)

func TestBookingErrors(t *testing.T) {
	if ErrSessionFull.Error() == "" {
		t.Fatal("ErrSessionFull should have message")
	}
	if !errors.Is(ErrInsufficientCredits, ErrInsufficientCredits) {
		t.Fatal("error identity")
	}
}
