package handler

import (
    "net/http"

    "gestory-backend/internal/response"
    "gestory-backend/internal/service"

    "github.com/gin-gonic/gin"
)

type ProfileHandler struct {
    profileService service.ProfileService
}

func NewProfileHandler(profileService service.ProfileService) *ProfileHandler {
    return &ProfileHandler{profileService: profileService}
}

func (h *ProfileHandler) Me(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "User not authenticated")
        return
    }

    uidStr, ok := userID.(string)
    if !ok {
        response.Internal(c)
        return
    }

    profile, err := h.profileService.GetOrCreateProfileByUserID(uidStr)
    if err != nil {
        response.Internal(c)
        return
    }

    response.Success(c, http.StatusOK, profile, "Profile retrieved")
}
