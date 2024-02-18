package com.mjtech.sandaga.journey;

import com.github.javafaker.Faker;
import com.github.javafaker.Name;
import com.mjtech.sandaga.dtos.auth.SignUpReqDto;
import com.mjtech.sandaga.dtos.auth.UserDto;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;


import java.util.Random;
import java.util.UUID;

@SpringBootTest(webEnvironment = RANDOM_PORT)
public class UserIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;
    private static final Random RANDOM = new Random();


    @Test 
    void canRegisterAUser() {
        // Create registration request

        Faker faker = new Faker();

        Name fakername = faker.name();

        String firstname = fakername.firstName();
        String lastname = fakername.lastName();
        String email = fakername.lastName() + "@yahoo.com";
        String phone = faker.numerify("06########");
        String password = faker.internet().password();

        SignUpReqDto request = SignUpReqDto.builder()
                .firstName(firstname)
                .lastName(lastname)
                .email(email)
                .password(password)
                .phone(phone)
                .accountType(1)
                .build();

        // Send a post request t
        webTestClient.post()
                .uri("/api/v1/users")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(request), SignUpReqDto.class)
                .exchange()
                .expectStatus()
                .isCreated();
    }

    @Test
    void cannotRegisterForExistingAUser() {
        // Create registration request

        Faker faker = new Faker();

        Name fakername = faker.name();

        String firstname = fakername.firstName();
        String lastname = fakername.lastName();
        String email = "elodie@yahoo.fr";
        String phone = faker.numerify("06########");
        String password = faker.internet().password();

        SignUpReqDto request = SignUpReqDto.builder()
                .firstName(firstname)
                .lastName(lastname)
                .email(email)
                .password(password)
                .phone(phone)
                .accountType(1)
                .build();

        // Send a post request
        webTestClient.post()
                .uri("/api/v1/users")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(request), SignUpReqDto.class)
                .exchange()
                .expectStatus()
                .is4xxClientError();
    }
}
