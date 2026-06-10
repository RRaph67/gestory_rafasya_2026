package middleware

import (
	"net/http"
	"strings"

	"gestory-backend/internal/response"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const UserIDKey = "userID"

func SupabaseAuth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if jwtSecret == "" {
			response.Error(c, http.StatusInternalServerError, "AUTH_NOT_CONFIGURED", "Supabase JWT secret belum dikonfigurasi")
			c.Abort()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "Authorization bearer token diperlukan")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			response.Error(c, http.StatusUnauthorized, "INVALID_TOKEN", "Token tidak valid")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.Error(c, http.StatusUnauthorized, "INVALID_TOKEN", "Token tidak valid")
			c.Abort()
			return
		}

		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			response.Error(c, http.StatusUnauthorized, "INVALID_TOKEN", "User ID tidak ditemukan di token")
			c.Abort()
			return
		}

		c.Set(UserIDKey, userID)
		c.Next()
	}
}
