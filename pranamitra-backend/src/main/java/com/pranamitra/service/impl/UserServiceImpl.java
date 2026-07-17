package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.UserRequest;
import com.pranamitra.dto.response.UserResponse;
import com.pranamitra.entity.Role;
import com.pranamitra.entity.User;
import com.pranamitra.enums.RoleType;
import com.pranamitra.mapper.UserMapper;
import com.pranamitra.repository.RoleRepository;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse registerUser(UserRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        // Check duplicate mobile number
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already exists.");
        }

        // Prevent public ADMIN registration
        if (request.getRoleName() == RoleType.ADMIN) {
            throw new RuntimeException("Administrator registration is not allowed.");
        }

        // Fetch role
        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        // Convert DTO to Entity
        User user = userMapper.toEntity(request);

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Assign Role
        user.setRole(role);

        // Default Values
        user.setActive(true);
        user.setVerified(false);

        // Save User
        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        return userMapper.toResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserResponse> responseList = new ArrayList<>();

        for (User user : users) {
            responseList.add(userMapper.toResponse(user));
        }

        return responseList;
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());

        // Update password only if provided
        if (request.getPassword() != null
                && !request.getPassword().trim().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(request.getPassword()));
        }

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        user.setRole(role);

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found.");
        }

        userRepository.deleteById(id);
    }
}