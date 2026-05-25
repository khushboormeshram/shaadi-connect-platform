package com.shaadiconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record SignupRequest(
            @NotBlank @Email String email,
            @NotBlank String password,
            @NotBlank String confirmPassword,
            String firstName,
            String lastName,
            String phone,
            String dateOfBirth,
            String gender,
            String city,
            String occupation,
            String education,
            String religion,
            String motherTongue,
            @NotBlank String securityAnswer,
            String role) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {
    }

    public record VerifySecurityAnswerRequest(@NotBlank @Email String email, @NotBlank String securityAnswer) {
    }

    public record ResetPasswordRequest(@NotBlank @Email String email, @NotBlank String newPassword,
            @NotBlank String confirmNewPassword) {
    }

    public record UserResponse(String name, String email, String role) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }
}
