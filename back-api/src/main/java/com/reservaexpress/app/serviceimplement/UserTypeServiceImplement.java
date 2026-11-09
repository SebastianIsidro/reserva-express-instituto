package com.reservaexpress.app.serviceimplement;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.reservaexpress.app.model.UserType;
import com.reservaexpress.app.repository.UserTypeRepository;
import com.reservaexpress.app.service.UserTypeService;

@Service
public class UserTypeServiceImplement implements UserTypeService{
	@Autowired
	private UserTypeRepository daoUserType;

	@Override
	public ResponseEntity<Map<String, Object>> listUserTypes() {
		Map<String,Object> response = new HashMap<>();
		List<UserType> usertypes = daoUserType.findAll();
		
		if(!usertypes.isEmpty()) {
			response.put("message", "Listado de Tipos Usuario");
			response.put("usertypes", usertypes);
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
}
