package com.reservaexpress.app.serviceimplement;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.reservaexpress.app.model.User;
import com.reservaexpress.app.repository.UserRepository;

@Service
public class UserDetailsServiceImplement implements UserDetailsService {

	@Autowired
	private UserRepository daoUser;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User existingUser = daoUser.findOneByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("El usuario con dicho email: " + email + " no existe."));
		
		return new UserDetailsImplement(existingUser);
	}
	
    public ResponseEntity<Map<String, Object>> registerUser(User user) {
    	Map<String,Object> response = new HashMap<>();
		Optional<User> existingUser = daoUser.findOneByEmail(user.getEmail());
		
		if(!existingUser.isPresent()) {
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			String formattedDate = formatter.format(new Date());
			
			//user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
			
	        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
	            user.setPassword_plain(user.getPassword());
	            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
	        } else {
	            response.put("message", "La contraseña no puede estar vacía.");
	            response.put("status", HttpStatus.BAD_REQUEST);
	            response.put("fecha", new Date());
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	        }
	        
			user.setCreation_date(formattedDate);
			user.setUsertype_id(3);
			
			daoUser.save(user);
			response.put("users", user);
			response.put("mensaje", "El usuario ha sido registrado exitosamente");
			response.put("status", HttpStatus.CREATED);
			response.put("fecha", new Date());
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		}
		else {
			response.put("message", "El usuario con correo: " + user.getEmail() + " ya existe");
			response.put("status", HttpStatus.CONFLICT);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
		}
    }
    
}
