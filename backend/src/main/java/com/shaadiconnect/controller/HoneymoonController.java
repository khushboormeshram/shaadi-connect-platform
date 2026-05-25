package com.shaadiconnect.controller;

import com.shaadiconnect.dto.HoneymoonDtos;
import com.shaadiconnect.service.HoneymoonService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HoneymoonController {

    private final HoneymoonService honeymoonService;

    public HoneymoonController(HoneymoonService honeymoonService) {
        this.honeymoonService = honeymoonService;
    }

    @PostMapping("/plan-honeymoon")
    public HoneymoonDtos.HoneymoonResponse planHoneymoon(@Valid @RequestBody HoneymoonDtos.HoneymoonRequest request) {
        return honeymoonService.planHoneymoon(request);
    }
}
