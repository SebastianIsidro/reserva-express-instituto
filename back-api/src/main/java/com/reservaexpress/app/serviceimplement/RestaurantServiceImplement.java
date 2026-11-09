package com.reservaexpress.app.serviceimplement;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.reservaexpress.app.model.Restaurant;
import com.reservaexpress.app.model.RestaurantRequest;
import com.reservaexpress.app.repository.RestaurantRepository;
import com.reservaexpress.app.repository.RestaurantRequestRepository;
import com.reservaexpress.app.service.RestaurantService;

@Service
public class RestaurantServiceImplement implements RestaurantService {

	@Autowired
	private RestaurantRepository daoRestaurant;
	
	@Autowired
	private RestaurantRequestRepository daoRestaurantRequest;

	@Override
	public ResponseEntity<Map<String, Object>> listRestaurants() {
		Map<String,Object> response = new HashMap<>();
		List<Restaurant> restaurants = daoRestaurant.findAll();
		
		if(!restaurants.isEmpty()) {
			response.put("message", "Listado de Restaurantes");
			response.put("restaurants", restaurants);
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
	public ResponseEntity<Map<String, Object>> listRestaurantsByName(String name) {
		Map<String,Object> response = new HashMap<>();	
		List<Restaurant> restaurantsByName = daoRestaurant.findByName(name);
		
		if(!restaurantsByName.isEmpty()) {
			response.put("message", "Listado de Reservas por Nombre");
			response.put("restaurants", restaurantsByName);
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
	public ResponseEntity<Map<String, Object>> getRestaurantById(int id) {
		Map<String,Object> response = new HashMap<>();		
		Optional<Restaurant> existingRestaurant = daoRestaurant.findById(id);
		
		if(existingRestaurant.isPresent()) {
			response.put("restaurants", existingRestaurant);
			response.put("message", "El restaurante ha sido encontrado exitosamente");
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
	public ResponseEntity<Map<String, Object>> listRestaurantsByUserId(int userid) {
	    Map<String, Object> response = new HashMap<>();
	    List<Restaurant> restaurantsByUserId = daoRestaurant.findByUserid(userid);

	    if (!restaurantsByUserId.isEmpty()) {
	        response.put("message", "Listado de Restaurantes por Usuario con ID " + userid);
	        response.put("restaurants", restaurantsByUserId);
	        response.put("restaurants in total", restaurantsByUserId.size());
	        response.put("status", HttpStatus.OK);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.OK).body(response);
	    } else {
	        response.put("message", "No se han encontrado restaurantes para el usuario con ID: " + userid);
	        response.put("restaurants in total", 0);
	        response.put("status", HttpStatus.NOT_FOUND);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	    }
	}
	
	@Override
	public ResponseEntity<Map<String, Object>> sendUpdateRestaurant(RestaurantRequest restaurantRequest){
		Map<String,Object> response = new HashMap<>();	
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String formattedDate = formatter.format(new Date());
		
		restaurantRequest.setRequeststatusId(2);
		restaurantRequest.setRequest_date(formattedDate);
		
		daoRestaurantRequest.save(restaurantRequest);
		response.put("restaurantRequest", restaurantRequest);
		response.put("message", "La actualización ha sido enviada exitosamente");
		response.put("status", HttpStatus.CREATED);
		response.put("date", new Date());	
		return ResponseEntity.status(HttpStatus.CREATED).body(response);	
	}
	


}
