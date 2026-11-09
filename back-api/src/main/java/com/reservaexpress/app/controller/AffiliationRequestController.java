package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.model.AffiliationRequest;
import com.reservaexpress.app.service.AffiliationRequestService;

@RestController
@RequestMapping("/api/affiliationrequests")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class AffiliationRequestController {

	@Autowired
	private AffiliationRequestService service;

	@GetMapping
	public ResponseEntity<Map<String, Object>> listAffiliateRequests() {
		return service.listAffiliateRequests();
	}
	
	@PostMapping
	public ResponseEntity<Map<String, Object>> createAffiliateRequest(@Validated @RequestBody AffiliationRequest affiliationRequest) {
		return service.createAffiliateRequest(affiliationRequest);
	}
	
	@PutMapping("/decline/{id}")
	public ResponseEntity<Map<String, Object>> declineAffiliateRequest(@PathVariable int id){
		return service.declineAffiliateRequest(id);
	}
	
	@PostMapping("/approveAffiliationRequest/{id}")
	public ResponseEntity<Map<String, Object>> approveAffiliationRequest(@Validated @PathVariable int id) {
	    return service.approveAffiliationRequest(id);
	}

	@GetMapping("/approveAR")
	public ResponseEntity<Map<String, Object>> listapproveAR() {
		return service.listapproveAR();
	}
	
	@GetMapping("/declineAR")
	public ResponseEntity<Map<String, Object>> listdeclineAR() {
		return service.listdeclineAR();
	}
	

}

