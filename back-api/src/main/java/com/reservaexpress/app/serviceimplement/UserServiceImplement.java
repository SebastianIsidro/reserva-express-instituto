package com.reservaexpress.app.serviceimplement;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.reservaexpress.app.model.User;
import com.reservaexpress.app.repository.UserRepository;
import com.reservaexpress.app.service.UserService;

@Service
public class UserServiceImplement implements UserService {

	@Autowired
	private UserRepository daoUser;

	@Override
	public ResponseEntity<Map<String, Object>> listUsers() {
		Map<String,Object> response = new HashMap<>();
		List<User> users = daoUser.findAll();
		
		if(!users.isEmpty()) {
			response.put("message", "Listado de Usuarios");
			response.put("users", users);
			response.put("status", HttpStatus.OK);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.OK).body(response);
		} else {
			response.put("message", "No se han encontrado registros");
			response.put("status", HttpStatus.NOT_FOUND);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}
	
	@Override
	public ResponseEntity<Map<String, Object>> getUserById(int id) {
		Map<String,Object> response = new HashMap<>();		
		Optional<User> existingUser= daoUser.findById(id);
		
		if(existingUser.isPresent()) {
			response.put("users", existingUser);
			response.put("message", "El usuario ha sido encontrado exitosamente");
			response.put("status", HttpStatus.OK);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.OK).body(response);
		} else {
			response.put("message", "No se han encontrado registros con ID: " + id);
			response.put("status", HttpStatus.NOT_FOUND);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}
	
	@Override
	public ResponseEntity<Map<String, Object>> updateUser(User user, int id) {
		Map<String,Object> response = new HashMap<>();
		Optional<User> existingUser = daoUser.findById(id);
		
		if (existingUser.isPresent()) {
			User obtainedUser = existingUser.get();
			obtainedUser.setName(user.getName());
			obtainedUser.setLastname(user.getLastname());
			obtainedUser.setPhone(user.getPhone());
			obtainedUser.setGender(user.getGender());
			obtainedUser.setBirthdate(user.getBirthdate());
			obtainedUser.setEmail(user.getEmail());
			obtainedUser.setCreation_date(user.getCreation_date());
			obtainedUser.setUsertype_id(user.getUsertype_id());
			
	        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
	            obtainedUser.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
	            obtainedUser.setPassword_plain(user.getPassword()); 
	        }
			
			daoUser.save(obtainedUser);
			response.put("users", obtainedUser);
			response.put("message", "Los cambios han sido guardados exitosamente");
			response.put("status", HttpStatus.CREATED);
			response.put("date", new Date());
    		return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
        	response.put("message", "No se han encontrado registros con ID: " + id);
        	response.put("status", HttpStatus.NOT_FOUND);
        	response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
	}

	@Override
	public ResponseEntity<Map<String, Object>> deleteUser(int id) {
		Map<String,Object> response = new HashMap<>();
		Optional<User> existingUser = daoUser.findById(id);
		
		if (existingUser.isPresent()) {
			daoUser.deleteById(id);
			response.put("users", existingUser);
			response.put("message", "El usuario ha sido eliminado exitosamente");
			response.put("status", HttpStatus.CREATED);
			response.put("date", new Date());
    		return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
        	response.put("message", "No se han encontrado registros con ID: " + id);
        	response.put("status", HttpStatus.NOT_FOUND);
        	response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
	}
}
