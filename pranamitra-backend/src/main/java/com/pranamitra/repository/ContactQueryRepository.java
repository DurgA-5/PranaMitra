package com.pranamitra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pranamitra.entity.ContactQuery;
import com.pranamitra.enums.ContactStatus;

@Repository
public interface ContactQueryRepository extends JpaRepository<ContactQuery, Long> {
    long countByStatus(ContactStatus status);
}
