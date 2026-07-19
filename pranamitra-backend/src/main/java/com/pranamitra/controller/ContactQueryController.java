package com.pranamitra.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pranamitra.dto.request.ContactQueryRequest;
import com.pranamitra.entity.ContactQuery;
import com.pranamitra.enums.ContactStatus;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.ContactQueryService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
public class ContactQueryController {

    private final ContactQueryService contactQueryService;

    public ContactQueryController(ContactQueryService contactQueryService) {
        this.contactQueryService = contactQueryService;
    }

    // Public API - visitor submits query
    @PostMapping("/api/contact")
    public ResponseEntity<ApiResponse<ContactQuery>> createQuery(@Valid @RequestBody ContactQueryRequest request) {
        ContactQuery query = contactQueryService.createQuery(request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Your enquiry has been submitted successfully.", query),
                HttpStatus.CREATED
        );
    }

    // Admin API - list all queries
    @GetMapping("/api/admin/contact")
    public ResponseEntity<ApiResponse<List<ContactQuery>>> getAllQueries() {
        List<ContactQuery> queries = contactQueryService.getAllQueries();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Contact queries retrieved successfully.", queries)
        );
    }

    // Admin API - view query detail
    @GetMapping("/api/admin/contact/{id}")
    public ResponseEntity<ApiResponse<ContactQuery>> getQueryById(@PathVariable Long id) {
        ContactQuery query = contactQueryService.getQueryById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Contact query retrieved successfully.", query)
        );
    }

    // Admin API - update query status
    @PutMapping("/api/admin/contact/{id}/status")
    public ResponseEntity<ApiResponse<ContactQuery>> updateStatus(
            @PathVariable Long id,
            @RequestParam ContactStatus status) {
        ContactQuery query = contactQueryService.updateStatus(id, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Status updated successfully.", query)
        );
    }

    // Admin API - delete query
    @DeleteMapping("/api/admin/contact/{id}")
    public ResponseEntity<ApiResponse<String>> deleteQuery(@PathVariable Long id) {
        contactQueryService.deleteQuery(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Contact query deleted successfully.", "Deleted query with ID: " + id)
        );
    }
}
