package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.RoleRequest;
import com.pranamitra.dto.response.RoleResponse;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    RoleResponse getRoleById(Long id);

    List<RoleResponse> getAllRoles();

    RoleResponse updateRole(Long id, RoleRequest request);

    void deleteRole(Long id);

}