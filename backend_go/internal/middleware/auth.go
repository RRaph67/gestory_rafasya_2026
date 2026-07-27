package middleware

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"

	"gestory-backend/internal/response"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const UserIDKey = "userID"

type JWK struct {
	Alg string   `json:"alg"`
	Crv string   `json:"crv"`
	Kid string   `json:"kid"`
	Kty string   `json:"kty"`
	X   string   `json:"x"`
	Y   string   `json:"y"`
}

type JWKS struct {
	Keys []JWK `json:"keys"`
}

var (
	jwksCache *sync.Map = &sync.Map{}
	jwksMutex sync.Mutex
)

// Fetch and decode ECDSA public keys from Supabase JWKS endpoint
func getSupabasePublicKey(jwksURL string, kid string) (*ecdsa.PublicKey, error) {
	if val, ok := jwksCache.Load(kid); ok {
		if pubKey, ok := val.(*ecdsa.PublicKey); ok {
			return pubKey, nil
		}
	}

	jwksMutex.Lock()
	defer jwksMutex.Unlock()

	// Double check after lock
	if val, ok := jwksCache.Load(kid); ok {
		if pubKey, ok := val.(*ecdsa.PublicKey); ok {
			return pubKey, nil
		}
	}

	log.Printf("Fetching Supabase JWKS from: %s", jwksURL)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(jwksURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKS: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("JWKS request returned status: %d", resp.StatusCode)
	}

	var jwks JWKS
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return nil, fmt.Errorf("failed to decode JWKS: %v", err)
	}

	for _, key := range jwks.Keys {
		if key.Kty == "EC" && key.Crv == "P-256" {
			xBytes, err := base64.RawURLEncoding.DecodeString(key.X)
			if err != nil {
				continue
			}
			yBytes, err := base64.RawURLEncoding.DecodeString(key.Y)
			if err != nil {
				continue
			}

			pubKey := &ecdsa.PublicKey{
				Curve: elliptic.P256(),
				X:     new(big.Int).SetBytes(xBytes),
				Y:     new(big.Int).SetBytes(yBytes),
			}
			jwksCache.Store(key.Kid, pubKey)
		}
	}

	if val, ok := jwksCache.Load(kid); ok {
		if pubKey, ok := val.(*ecdsa.PublicKey); ok {
			return pubKey, nil
		}
	}

	return nil, fmt.Errorf("public key not found for kid: %s", kid)
}

func SupabaseAuth(jwtSecret string, jwksURL string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "Authorization bearer token diperlukan")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			// Check if token was signed using ECDSA (ES256)
			if _, ok := token.Method.(*jwt.SigningMethodECDSA); ok {
				kid, _ := token.Header["kid"].(string)
				if kid == "" {
					return nil, errors.New("missing kid in token header")
				}
				pubKey, err := getSupabasePublicKey(jwksURL, kid)
				if err != nil {
					return nil, err
				}
				return pubKey, nil
			}

			// Fallback to symmetric key (HS256) using SUPABASE_JWT_SECRET
			if jwtSecret == "" {
				return nil, errors.New("Supabase JWT secret belum dikonfigurasi")
			}
			if decoded, err := base64.StdEncoding.DecodeString(jwtSecret); err == nil {
				return decoded, nil
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			if err != nil {
				log.Printf("[JWT AUTH ERROR] Parse failed: %v", err)
			} else {
				log.Printf("[JWT AUTH ERROR] Token is invalid but no err returned")
			}
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
