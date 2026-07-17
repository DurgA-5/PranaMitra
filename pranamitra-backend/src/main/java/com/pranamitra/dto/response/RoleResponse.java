package com.pranamitra.dto.response;

import java.time.LocalDateTime;

import com.pranamitra.enums.RoleType;

public class RoleResponse {

    private Long id;
    private RoleType roleName;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoleResponse() {
    }

    public RoleResponse(Long id, RoleType roleName, String description,
            Boolean active, LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.roleName = roleName;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public RoleType getRoleName() {
        return roleName;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRoleName(RoleType roleName) {
        this.roleName = roleName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}