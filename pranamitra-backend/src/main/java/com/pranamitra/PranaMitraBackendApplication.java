package com.pranamitra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PranaMitraBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PranaMitraBackendApplication.class, args);
    }

}