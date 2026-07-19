package com.pranamitra.dto.response;

public class ProfileStatusResponse {

    private boolean profileExists;
    private String role;

    public ProfileStatusResponse() {
    }

    public ProfileStatusResponse(boolean profileExists, String role) {
        this.profileExists = profileExists;
        this.role = role;
    }

    public boolean isProfileExists() {
        return profileExists;
    }

    public void setProfileExists(boolean profileExists) {
        this.profileExists = profileExists;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
