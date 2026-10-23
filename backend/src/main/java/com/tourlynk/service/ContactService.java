package com.tourlynk.service;

import com.tourlynk.dto.ContactMessageRequest;
import com.tourlynk.dto.ContactMessageResponse;
import com.tourlynk.dto.PagedResponse;
import com.tourlynk.entity.ContactMessage;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.ContactMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Transactional
    public ContactMessageResponse submitMessage(ContactMessageRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.getName().trim());
        msg.setEmail(request.getEmail().toLowerCase().trim());
        msg.setSubject(request.getSubject().trim());
        msg.setMessage(request.getMessage().trim());
        msg.setStatus("NEW");

        ContactMessage saved = contactMessageRepository.save(msg);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageResponse> getMessages(Pageable pageable) {
        Page<ContactMessage> page = contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<ContactMessageResponse> list = page.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return new PagedResponse<>(list, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional
    public void markAsRead(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with ID: " + id));
        msg.setStatus("READ");
        contactMessageRepository.save(msg);
    }

    public ContactMessageResponse toResponse(ContactMessage m) {
        ContactMessageResponse res = new ContactMessageResponse();
        res.setId(m.getId());
        res.setName(m.getName());
        res.setEmail(m.getEmail());
        res.setSubject(m.getSubject());
        res.setMessage(m.getMessage());
        res.setStatus(m.getStatus());
        res.setCreatedAt(m.getCreatedAt());
        return res;
    }
}

