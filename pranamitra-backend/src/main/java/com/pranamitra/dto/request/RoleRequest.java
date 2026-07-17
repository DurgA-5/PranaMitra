package com.pranamitra.dto.request;

import com.pranamitra.enums.RoleType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RoleRequest {

    @NotNull(message = "Role Name is required")
    private RoleType roleName;

    @Size(max = 255)
    private String description;

    public RoleRequest() {
    }

    public RoleRequest(RoleType roleName, String description) {
        this.roleName = roleName;
        this.description = description;
    }

    public RoleType getRoleName() {
        return roleName;
    }

    public void setRoleName(RoleType roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}