package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.model.User;
import com.reservaexpress.app.serviceimplement.UserDetailsServiceImplement;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class AuthController {
	
	@Autowired
	private UserDetailsServiceImplement service;
	
	@PostMapping
	public ResponseEntity<Map<String, Object>> registerUser(@Validated @RequestBody User user) {
		return service.registerUser(user);
	}
}
