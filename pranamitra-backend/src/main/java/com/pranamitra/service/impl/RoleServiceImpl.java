package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.RoleRequest;
import com.pranamitra.dto.response.RoleResponse;
import com.pranamitra.entity.Role;
import com.pranamitra.mapper.RoleMapper;
import com.pranamitra.repository.RoleRepository;
import com.pranamitra.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    @Override
    public RoleResponse createRole(RoleRequest request) {

        Role role = roleMapper.toEntity(request);

        Role savedRole = roleRepository.save(role);

        return roleMapper.toResponse(savedRole);
    }

    @Override
    public RoleResponse getRoleById(Long id) {

        Role role = roleRepository.findById(id).orElse(null);

        if (role == null) {
            return null;
        }

        return roleMapper.toResponse(role);
    }

    @Override
    public List<RoleResponse> getAllRoles() {

        List<Role> roles = roleRepository.findAll();

        List<RoleResponse> responses = new ArrayList<>();

        for (Role role : roles) {
            responses.add(roleMapper.toResponse(role));
        }

        return responses;
    }

    @Override
    public RoleResponse updateRole(Long id, RoleRequest request) {

        Role role = roleRepository.findById(id).orElse(null);

        if (role == null) {
            return null;
        }

        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());

        Role updatedRole = roleRepository.save(role);

        return roleMapper.toResponse(updatedRole);
    }

    @Override
    public void deleteRole(Long id) {

        roleRepository.deleteById(id);

    }

}