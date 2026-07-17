package com.pranamitra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("PranaMitra Blood Management System API")
                        .description("REST APIs for PranaMitra Blood Donation & Blood Request Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("PranaMitra Team")
                                .email("support@pranamitra.com"))
                        .license(new License()
                                .name("MIT License")));
    }

}