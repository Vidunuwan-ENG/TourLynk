package com.tourlynk.controller;

import com.tourlynk.dto.ApiResponse;
import com.tourlynk.dto.ContactMessageRequest;
import com.tourlynk.dto.ContactMessageResponse;
import com.tourlynk.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessageResponse>> submitMessage(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse response = contactService.submitMessage(request);
        return new ResponseEntity<>(ApiResponse.ok("Thank you! Your message has been received.", response), HttpStatus.CREATED);
    }
}

