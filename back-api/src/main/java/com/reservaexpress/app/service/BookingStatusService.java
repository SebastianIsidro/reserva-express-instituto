package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface BookingStatusService {
	
	public ResponseEntity<Map<String, Object>> listBookingStatus();

}
