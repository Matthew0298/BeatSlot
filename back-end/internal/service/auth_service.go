package service

import (
	"fmt"
	"regexp"

	"gymbook.com/mod/internal/auth"
	"gymbook.com/mod/internal/model"
	"gymbook.com/mod/internal/repository"
)

type RegisterInput struct {
	Username      string `json:"username"`
	Email         string `json:"email"`
	Password      string `json:"password"`
	Nome          string `json:"nome"`
	Cognome       string `json:"cognome"`
	CodiceFiscale string `json:"codice_fiscale"`
	Indirizzo     string `json:"indirizzo"`
	Phone         string `json:"phone"`
	BirthDate     string `json:"birth_date"`
	Gender        string `json:"gender"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResult struct {
	User        *model.User `json:"user"`
	AccessToken string      `json:"access_token"`
}

func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}

func RegisterUser(input RegisterInput) (*AuthResult, error) {
	if !isValidEmail(input.Email) {
		return nil, fmt.Errorf("invalid email format")
	}
	hashedPassword, err := auth.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}
	user := &model.User{
		Username:      input.Username,
		Email:         input.Email,
		PasswordHash:  hashedPassword,
		Nome:          input.Nome,
		Cognome:       input.Cognome,
		CodiceFiscale: input.CodiceFiscale,
		Indirizzo:     input.Indirizzo,
		Phone:         input.Phone,
		BirthDate:     input.BirthDate,
		Gender:        input.Gender,
		Role:          "member",
	}
	if err := repository.CreateUser(user); err != nil {
		return nil, err
	}
	org, err := repository.GetDefaultOrganization()
	if err == nil && org != nil {
		_ = repository.EnsureMembership(org.ID, user.ID, "member", 10)
	}
	token, err := auth.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}
	return &AuthResult{User: user, AccessToken: token}, nil
}

func LoginUser(input LoginInput) (*AuthResult, error) {
	var user model.User
	if err := repository.FindUserByEmail(input.Email, &user); err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}
	if !auth.CheckPassword(user.PasswordHash, input.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}
	token, err := auth.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}
	return &AuthResult{User: &user, AccessToken: token}, nil
}

func GetUserByID(id uint) (*model.User, error) {
	return repository.FindUserByID(id)
}
