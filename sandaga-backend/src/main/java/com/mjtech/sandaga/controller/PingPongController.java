package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.auth.PingPong;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
public class PingPongController {

    @ApiOperation(value = "Check app healty.", nickname = "getPingPong", notes = "Check app healty", response = PingPong.class, tags={ "pingpong" })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful operation.", response = PingPong.class) })
    @GetMapping(
            value = "/ping",
            produces = { "application/json" }
    )
    public PingPong getPingPong() {
        return new PingPong("Pong");
    }
}
