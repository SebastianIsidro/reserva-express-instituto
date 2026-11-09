package com.reservaexpress.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.AffiliationRequest;

@Repository
public interface AffiliationRequestRepository extends JpaRepository<AffiliationRequest, Integer> {
	List<AffiliationRequest> findByRequeststatusId(int requeststatusId);
}