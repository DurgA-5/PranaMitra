package com.pranamitra.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobileNumber(String mobileNumber);

    Optional<User> findByResetToken(String resetToken);

    boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);

    @org.springframework.data.jpa.repository.Query("""
            SELECT u FROM User u
            WHERE u.active = true
            AND u.role.roleName = com.pranamitra.enums.RoleType.DONOR
            AND u.id NOT IN (SELECT s.user.id FROM StudentDonor s)
            """)
    java.util.List<User> findAvailableUsersForDonor();

}