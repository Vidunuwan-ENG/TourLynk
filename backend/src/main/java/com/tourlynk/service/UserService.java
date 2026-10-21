package com.tourlynk.service;

import com.tourlynk.dto.UserDto;
import com.tourlynk.dto.UserProfileUpdateRequest;
import com.tourlynk.entity.User;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return mapToDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber());

        if (StringUtils.hasText(request.getNewPassword())) {
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword().trim()));
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    public UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getAccountStatus(),
                user.getCreatedAt()
        );
    }
}

