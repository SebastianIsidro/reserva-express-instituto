package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.service.UserTypeService;

@RestController
@RequestMapping("/api/usertypes")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class UserTypeController {
	@Autowired
	private UserTypeService service;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> listUserTypes() {
		return service.listUserTypes();
	}
}
