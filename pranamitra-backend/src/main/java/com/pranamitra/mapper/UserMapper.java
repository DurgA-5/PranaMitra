package com.pranamitra.mapper;

import org.springframework.stereotype.Component;

import com.pranamitra.dto.request.UserRequest;
import com.pranamitra.dto.response.UserResponse;
import com.pranamitra.entity.User;

@Component
public class UserMapper {

    public User toEntity(UserRequest request) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setPassword(request.getPassword());

        return user;
    }

    public UserResponse toResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setMobileNumber(user.getMobileNumber());

        if (user.getRole() != null) {
            response.setRoleName(user.getRole().getRoleName().name());
        }

        response.setActive(user.getActive());
        response.setVerified(user.getVerified());

        return response;
    }
}