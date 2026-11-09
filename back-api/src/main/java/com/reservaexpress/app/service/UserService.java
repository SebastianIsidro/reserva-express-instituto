package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.reservaexpress.app.model.User;

public interface UserService {
	
	public ResponseEntity<Map<String, Object>> listUsers();
	
	public ResponseEntity<Map<String, Object>> getUserById(int id);
	
	public ResponseEntity<Map<String, Object>> updateUser(User user, int id);
	
	public ResponseEntity<Map<String, Object>> deleteUser(int id);
}
