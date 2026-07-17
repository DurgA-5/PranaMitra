package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.RoleRequest;
import com.pranamitra.dto.response.RoleResponse;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(
            @Valid @RequestBody RoleRequest request) {

        RoleResponse response = roleService.createRole(request);

        ApiResponse<RoleResponse> apiResponse =
                new ApiResponse<>(true, "Role created successfully", response);

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable Long id) {

        RoleResponse response = roleService.getRoleById(id);

        ApiResponse<RoleResponse> apiResponse =
                new ApiResponse<>(true, "Role fetched successfully", response);

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {

        List<RoleResponse> response = roleService.getAllRoles();

        ApiResponse<List<RoleResponse>> apiResponse =
                new ApiResponse<>(true, "Roles fetched successfully", response);

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequest request) {

        RoleResponse response = roleService.updateRole(id, request);

        ApiResponse<RoleResponse> apiResponse =
                new ApiResponse<>(true, "Role updated successfully", response);

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRole(@PathVariable Long id) {

        roleService.deleteRole(id);

        ApiResponse<String> apiResponse =
                new ApiResponse<>(true, "Role deleted successfully", null);

        return ResponseEntity.ok(apiResponse);
    }
}