package com.pranamitra.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.pranamitra.entity.Role;
import com.pranamitra.enums.RoleType;
import com.pranamitra.repository.RoleRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {

        return args -> {

            createRole(roleRepository, RoleType.ADMIN, "System Administrator");
            createRole(roleRepository, RoleType.DONOR, "Blood Donor");
            createRole(roleRepository, RoleType.PATIENT, "Blood Request User");

        };
    }

    private void createRole(RoleRepository repository,
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