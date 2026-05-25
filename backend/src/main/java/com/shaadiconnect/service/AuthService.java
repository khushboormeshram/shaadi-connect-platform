package com.shaadiconnect.service;

import com.shaadiconnect.dto.AuthDtos;
import com.shaadiconnect.entity.User;
import com.shaadiconnect.entity.UserRole;
import com.shaadiconnect.exception.BadRequestException;
import com.shaadiconnect.exception.ResourceNotFoundException;
import com.shaadiconnect.repository.UserRepository;
import com.shaadiconnect.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthDtos.AuthResponse register(AuthDtos.SignupRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setDateOfBirth(request.dateOfBirth());
        user.setGender(request.gender());
        user.setCity(request.city());
        user.setOccupation(request.occupation());
        user.setEducation(request.education());
        user.setReligion(request.religion());
        user.setMotherTongue(request.motherTongue());
        user.setSecurityAnswer(passwordEncoder.encode(request.securityAnswer().toLowerCase().trim()));
        user.setRole("admin".equalsIgnoreCase(request.role()) ? UserRole.ROLE_ADMIN : UserRole.ROLE_USER);

        User saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        return toAuthResponse(user);
    }

    public void verifySecurityAnswer(AuthDtos.VerifySecurityAnswerRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean matches = passwordEncoder.matches(request.securityAnswer().toLowerCase().trim(),
                user.getSecurityAnswer());
        if (!matches) {
            throw new BadRequestException("Incorrect security answer");
        }
    }

    public void resetPassword(AuthDtos.ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    public AuthDtos.UserResponse currentUser(User user) {
        return new AuthDtos.UserResponse(
                buildName(user),
                user.getEmail(),
                user.getRole() == UserRole.ROLE_ADMIN ? "admin" : "user");
    }

    private AuthDtos.AuthResponse toAuthResponse(User user) {
        return new AuthDtos.AuthResponse(jwtService.generateToken(user), currentUser(user));
    }

    private String buildName(User user) {
        String first = user.getFirstName() == null ? "" : user.getFirstName();
        String last = user.getLastName() == null ? "" : user.getLastName();
        return (first + " " + last).trim();
    }
}
