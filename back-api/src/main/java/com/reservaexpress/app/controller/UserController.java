package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.model.User;
import com.reservaexpress.app.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class UserController {
	
	@Autowired
	private UserService service;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> listUsers() {
		return service.listUsers();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> getUserById(@PathVariable int id) {
		return service.getUserById(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> updateUser(@RequestBody User user, @PathVariable int id) {
		return service.updateUser(user, id);
	}
	
	@DeleteMapping
	public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable int id) {
		return service.deleteUser(id);
	}
}
