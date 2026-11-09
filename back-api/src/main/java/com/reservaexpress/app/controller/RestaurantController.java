package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.model.RestaurantRequest;
import com.reservaexpress.app.service.RestaurantService;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class RestaurantController {
	
	@Autowired
	private RestaurantService service;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> listRestaurants() {
		return service.listRestaurants();
	}
	
	@GetMapping("/find/{name}")
	public ResponseEntity<Map<String, Object>> listRestaurantsByName(@PathVariable String name) {
		return service.listRestaurantsByName(name);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> getRestaurantById(@PathVariable int id) {
		return service.getRestaurantById(id);
	}
	
	@GetMapping("/userestaurant/{id}")
	public ResponseEntity<Map<String, Object>> listRestaurantsByUserId(@PathVariable int id) {
		return service.listRestaurantsByUserId(id);
	}
	
	@PostMapping("/{id}")
	public ResponseEntity<Map<String, Object>> sendUpdateRestaurant(@Validated @RequestBody RestaurantRequest restaurantRequest, @PathVariable int id) {
		return service.sendUpdateRestaurant(restaurantRequest);
	}
}