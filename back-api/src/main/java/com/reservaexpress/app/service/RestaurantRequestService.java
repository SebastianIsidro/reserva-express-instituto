package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface RestaurantRequestService {
	public ResponseEntity<Map<String, Object>> listRestaurantsRequests();
	
	public ResponseEntity<Map<String, Object>> declineRestaurantRequest(int id);

	public ResponseEntity<Map<String, Object>> approveRestaurantRequest(int requestId);

}
