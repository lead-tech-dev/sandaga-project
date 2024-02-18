package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.auth.PingPong;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingPongController {

    @GetMapping("/ping")
    public PingPong getPingPong() {
        return new PingPong("Pong");
    }
}
