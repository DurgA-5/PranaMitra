package com.pranamitra.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.pranamitra.entity.Role;
import com.pranamitra.entity.User;
import com.pranamitra.enums.RoleType;
import com.pranamitra.repository.RoleRepository;
import com.pranamitra.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Create Roles
            createRole(roleRepository, RoleType.ADMIN, "System Administrator");
            createRole(roleRepository, RoleType.DONOR, "Blood Donor");
            createRole(roleRepository, RoleType.PATIENT, "Blood Request User");

            // Create or Update Default Admin
            User admin = userRepository.findByEmail("admin@pranamitra.com").orElseGet(() -> {
                User u = new User();
                u.setEmail("admin@pranamitra.com");
                return u;
            });

            Role adminRole = roleRepository
                    .findByRoleName(RoleType.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin Role Not Found"));

            admin.setFirstName("System");
            admin.setLastName("Administrator");
            if (admin.getMobileNumber() == null) {
                admin.setMobileNumber("9999999999");
            }
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(adminRole);
            admin.setActive(true);
            admin.setVerified(true);

            userRepository.save(admin);

            System.out.println("=======================================");
            System.out.println(" DEFAULT ADMIN SYNCHRONIZED");
            System.out.println(" Email    : admin@pranamitra.com");
            System.out.println(" Password : Admin@123");
            System.out.println("=======================================");
        };
    }

    private void createRole(
            RoleRepository repository,
            RoleType roleType,
            String description) {

        if (repository.findByRoleName(roleType).isEmpty()) {

            Role role = new Role();

            role.setRoleName(roleType);
            role.setDescription(description);
            role.setActive(true);

            repository.save(role);
        }
    }
}