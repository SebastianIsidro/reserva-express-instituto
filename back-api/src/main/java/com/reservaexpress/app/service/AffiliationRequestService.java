package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.reservaexpress.app.model.AffiliationRequest;

public interface AffiliationRequestService {
	
	public ResponseEntity<Map<String, Object>> listAffiliateRequests();
	
	public ResponseEntity<Map<String, Object>> createAffiliateRequest(AffiliationRequest affiliationRequest);
	
	public ResponseEntity<Map<String, Object>> declineAffiliateRequest(int id);

	public ResponseEntity<Map<String, Object>> approveAffiliationRequest(int requestId);
	
	public ResponseEntity<Map<String, Object>> listapproveAR();
	
	public ResponseEntity<Map<String, Object>> listdeclineAR();
}
