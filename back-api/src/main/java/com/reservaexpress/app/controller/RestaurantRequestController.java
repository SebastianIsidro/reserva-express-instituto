package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.service.RestaurantRequestService;

@RestController
@RequestMapping("/api/restaurantsrequest")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class RestaurantRequestController {
	
	@Autowired
	private RestaurantRequestService service;

	@GetMapping
	public ResponseEntity<Map<String, Object>> listRestaurantsRequests() {
		return service.listRestaurantsRequests();
	}
	
	@PutMapping("/decline/{id}")
	public ResponseEntity<Map<String, Object>> declineRestaurantRequest(@PathVariable int id) {
		return service.declineRestaurantRequest(id);
	}
	
	@PutMapping("/approveRestaurantRequest/{id}")
	public ResponseEntity<Map<String, Object>> approveRestaurantRequest(@PathVariable int id) {
	    return service.approveRestaurantRequest(id);
	}
}
