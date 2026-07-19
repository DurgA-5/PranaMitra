package com.pranamitra.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pranamitra.entity.ContactQuery;
import com.pranamitra.dto.request.ContactQueryRequest;
import com.pranamitra.enums.ContactStatus;
import com.pranamitra.enums.RoleType;
import com.pranamitra.repository.ContactQueryRepository;
import com.pranamitra.service.ContactQueryService;
import com.pranamitra.service.NotificationService;

@Service
@Transactional
public class ContactQueryServiceImpl implements ContactQueryService {

    private final ContactQueryRepository contactQueryRepository;
    private final NotificationService notificationService;

    public ContactQueryServiceImpl(
            ContactQueryRepository contactQueryRepository,
            NotificationService notificationService) {
        this.contactQueryRepository = contactQueryRepository;
        this.notificationService = notificationService;
    }

    @Override
    public ContactQuery createQuery(ContactQueryRequest request) {
        ContactQuery query = new ContactQuery();
        query.setFullName(request.getFullName());
        query.setEmail(request.getEmail());
        query.setSubject(request.getSubject());
        query.setMessage(request.getMessage());
        query.setStatus(ContactStatus.NEW);

        ContactQuery saved = contactQueryRepository.save(query);

        // Generate Admin notification
        notificationService.createNotificationForRole(
                RoleType.ADMIN,
                "New Contact Query",
                "New Contact Query received from " + saved.getFullName() + ".",
                "INFO"
        );

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactQuery> getAllQueries() {
        return contactQueryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ContactQuery getQueryById(Long id) {
        return contactQueryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact Query not found with ID: " + id));
    }

    @Override
    public ContactQuery updateStatus(Long id, ContactStatus status) {
        ContactQuery query = getQueryById(id);
        query.setStatus(status);
        return contactQueryRepository.save(query);
    }

    @Override
    public void deleteQuery(Long id) {
        if (!contactQueryRepository.existsById(id)) {
            throw new RuntimeException("Contact Query not found with ID: " + id);
        }
        contactQueryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long getNewQueriesCount() {
        return contactQueryRepository.countByStatus(ContactStatus.NEW);
    }
}
