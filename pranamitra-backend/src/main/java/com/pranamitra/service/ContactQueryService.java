package com.pranamitra.service;

import java.util.List;
import com.pranamitra.entity.ContactQuery;
import com.pranamitra.dto.request.ContactQueryRequest;
import com.pranamitra.enums.ContactStatus;

public interface ContactQueryService {
    ContactQuery createQuery(ContactQueryRequest request);
    List<ContactQuery> getAllQueries();
    ContactQuery getQueryById(Long id);
    ContactQuery updateStatus(Long id, ContactStatus status);
    void deleteQuery(Long id);
    long getNewQueriesCount();
}
