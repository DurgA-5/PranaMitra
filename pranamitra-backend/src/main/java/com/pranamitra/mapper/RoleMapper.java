package com.pranamitra.mapper;

import org.springframework.stereotype.Component;

import com.pranamitra.dto.request.RoleRequest;
import com.pranamitra.dto.response.RoleResponse;
import com.pranamitra.entity.Role;

@Component
public class RoleMapper {

    public Role toEntity(RoleRequest request) {

        Role role = new Role();

        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());

        return role;
    }

    public RoleResponse toResponse(Role role) {

        RoleResponse response = new RoleResponse();

        response.setId(role.getId());
        response.setRoleName(role.getRoleName());
        response.setDescription(role.getDescription());
        response.setActive(role.getActive());
        response.setCreatedAt(role.getCreatedAt());
        response.setUpdatedAt(role.getUpdatedAt());

        return response;
    }

}