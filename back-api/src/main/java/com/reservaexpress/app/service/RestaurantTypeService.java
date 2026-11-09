package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface RestaurantTypeService {
	
	public ResponseEntity<Map<String, Object>> listRestaurantTypes();

}
