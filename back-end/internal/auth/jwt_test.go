package auth

import (
	"os"
	"testing"
)

func TestGenerateAndParseToken(t *testing.T) {
	_ = os.Setenv("JWT_SECRET", "test-secret")
	token, err := GenerateToken(42, "user@test.com", "member")
	if err != nil {
		t.Fatalf("generate failed: %v", err)
	}
	claims, err := ParseToken(token)
	if err != nil {
		t.Fatalf("parse failed: %v", err)
	}
	if claims.UserID != 42 || claims.Email != "user@test.com" || claims.Role != "member" {
		t.Fatalf("unexpected claims: %+v", claims)
	}
}
