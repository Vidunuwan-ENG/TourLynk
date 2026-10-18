package com.tourlynk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TourLynkApplication {

    public static void main(String[] args) {
        SpringApplication.run(TourLynkApplication.class, args);
    }
}

