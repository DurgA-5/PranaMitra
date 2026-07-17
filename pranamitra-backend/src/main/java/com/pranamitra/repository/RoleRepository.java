package com.pranamitra.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pranamitra.entity.Role;
import com.pranamitra.enums.RoleType;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleName(RoleType roleName);

    boolean existsByRoleName(RoleType roleName);

}