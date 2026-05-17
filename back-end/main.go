package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"

	"gymbook.com/mod/internal/config"
	"gymbook.com/mod/internal/controller"
	"gymbook.com/mod/internal/db"
	"gymbook.com/mod/middleware"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "gymbook.com/mod/docs"
)

func runMigrations(dsn string) {
	m, err := migrate.New("file://migrations", dsn)
	if err != nil {
		log.Fatal("Errore init migrate:", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal("Errore migrazioni:", err)
	}
	log.Println("Migrazioni applicate con successo")
}

func main() {
	if err := godotenv.Load("properties.env"); err != nil {
		log.Println("Nessun file properties.env trovato, uso variabili d'ambiente")
	}

	cfg := config.Load()

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		dsn = cfg.DatabaseDSN
	}
	if dsn == "" {
		log.Fatal("DATABASE_DSN non settato")
	}

	db.Connect(dsn)
	log.Println("Connessione al DB avvenuta con successo")

	if cfg.AppEnv != "production" {
		runMigrations(dsn)
	}

	r := gin.Default()
	r.Use(corsMiddleware())

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		auth.POST("/register", controller.Register)
		auth.POST("/login", controller.Login)

		protected := api.Group("")
		protected.Use(middleware.JWTAuth())
		{
			protected.GET("/me", controller.GetMe)
			protected.GET("/me/bookings", controller.GetMyBookings)
			protected.GET("/sessions", controller.ListSessions)
			protected.GET("/packages", controller.ListPackages)
			protected.POST("/bookings", controller.CreateBooking)
			protected.DELETE("/bookings/:id", controller.DeleteBooking)
			protected.POST("/packages/:id/purchase", controller.PurchasePackage)
		}

		staff := api.Group("/staff")
		staff.Use(middleware.JWTAuth(), middleware.RequireRole("staff", "admin"))
		{
			staff.GET("/organization", controller.StaffGetOrganization)
			staff.GET("/bookings", controller.StaffListBookings)
			staff.GET("/members", controller.StaffListMembers)
			staff.GET("/activities", controller.StaffListActivities)
			staff.POST("/sessions", controller.StaffCreateSession)
		}
	}

	log.Printf("Avvio server su %s (env: %s)", cfg.AppPort, cfg.AppEnv)
	r.Run(cfg.AppPort)
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
