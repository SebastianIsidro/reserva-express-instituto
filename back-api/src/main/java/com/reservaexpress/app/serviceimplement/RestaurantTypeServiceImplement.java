package com.reservaexpress.app.serviceimplement;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.reservaexpress.app.model.RestaurantType;
import com.reservaexpress.app.repository.RestaurantTypeRepository;
import com.reservaexpress.app.service.RestaurantTypeService;

@Service
public class RestaurantTypeServiceImplement implements RestaurantTypeService {

	@Autowired
	private RestaurantTypeRepository daoRestaurantType;

	@Override
	public ResponseEntity<Map<String, Object>> listRestaurantTypes() {
		Map<String,Object> response = new HashMap<>();	
		List<RestaurantType> restauranttypes = daoRestaurantType.findAll();
		
		if(!restauranttypes.isEmpty()) {
			response.put("message", "Listado de Estados de Reserva");
			response.put("restauranttypes", restauranttypes);
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
