package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.reservaexpress.app.model.RestaurantRequest;

public interface RestaurantService {

	public ResponseEntity<Map<String, Object>> listRestaurants();
	
	public ResponseEntity<Map<String, Object>> listRestaurantsByName(String name);
	
	public ResponseEntity<Map<String, Object>> getRestaurantById(int id);
	
	public ResponseEntity<Map<String, Object>> listRestaurantsByUserId(int userid);
	
	public ResponseEntity<Map<String, Object>> sendUpdateRestaurant(RestaurantRequest restaurantRequest);
	
}
