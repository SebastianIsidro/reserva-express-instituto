package com.reservaexpress.app.serviceimplement;

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
import com.reservaexpress.app.service.RestaurantRequestService;

@Service
public class RestaurantRequestServiceImplement implements RestaurantRequestService {
	
	@Autowired
	private RestaurantRequestRepository daoRestaurantRequest;
	
	@Autowired
	private RestaurantRepository daoRestaurant;

	@Override
	public ResponseEntity<Map<String, Object>> listRestaurantsRequests() {
		Map<String,Object> response = new HashMap<>();	
		List<RestaurantRequest> restaurantrequests = daoRestaurantRequest.findByRequeststatusId(2);
		
		if(!restaurantrequests.isEmpty()) {
			response.put("message", "Listado de actualizaciones pendientes");
			response.put("restaurantrequests", restaurantrequests);
			response.put("status", HttpStatus.OK);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.OK).body(response);
		} else {
			response.put("message", "No se han encontrado actualizaciones solicitantes");
			response.put("status", HttpStatus.NOT_FOUND);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}

	@Override
	public ResponseEntity<Map<String, Object>> declineRestaurantRequest(int id) {
		Map<String,Object> response = new HashMap<>();	
		Optional<RestaurantRequest> requestExists = daoRestaurantRequest.findById(id);	
		if (requestExists.isPresent()) {
			RestaurantRequest request = requestExists.get();
			request.setRequeststatusId(3);;
			daoRestaurantRequest.save(request);
			response.put("message", "Actualización rechazada correctamente");
			response.put("status", HttpStatus.OK);
			response.put("date", new Date());
			return ResponseEntity.status(HttpStatus.OK).body(response);
		}else {
			response.put("message", "Sin solicitudes con ID: " + id);
			response.put("status", HttpStatus.NOT_FOUND);
			response.put("date", new Date());	
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}

	@Override
	public ResponseEntity<Map<String, Object>> approveRestaurantRequest(int requestId) {
	    Map<String, Object> response = new HashMap<>();

	    try {
	        // Verificar si la solicitud de actualización existe
	        Optional<RestaurantRequest> optionalRequest = daoRestaurantRequest.findById(requestId);
	        if (!optionalRequest.isPresent()) {
	            response.put("message", "La solicitud de actualización no existe.");
	            response.put("status", HttpStatus.NOT_FOUND);
	            response.put("date", new Date());
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	        }

	        RestaurantRequest restaurantRequest = optionalRequest.get();

	        // Verificar si el restaurante a actualizar existe
	        Optional<Restaurant> optionalRestaurant = daoRestaurant.findById(restaurantRequest.getRestaurant_id());
	        if (!optionalRestaurant.isPresent()) {
	            response.put("message", "El restaurante no existe.");
	            response.put("status", HttpStatus.NOT_FOUND);
	            response.put("date", new Date());
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	        }

	        Restaurant restaurant = optionalRestaurant.get();

	        // Validar que el user_id coincida entre la solicitud y el restaurante
	        if (restaurantRequest.getUserid() != restaurant.getUserid()) {
	            response.put("message", "El usuario asociado a la solicitud no tiene permisos para actualizar este restaurante.");
	            response.put("status", HttpStatus.FORBIDDEN);
	            response.put("date", new Date());
	            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	        }

	        // Actualizar los datos del restaurante con los datos de la solicitud
	        restaurant.setName(restaurantRequest.getName());
	        restaurant.setDescription(restaurantRequest.getDescription());
	        restaurant.setAddress(restaurantRequest.getAddress());
	        restaurant.setOpening_hours(restaurantRequest.getOpening_hours());
	        restaurant.setClosing_hours(restaurantRequest.getClosing_hours());
	        restaurant.setPax_limit(restaurantRequest.getPax_limit());
	        restaurant.setImage_url(restaurantRequest.getImage_url());
	        restaurant.setRestauranttype_id(restaurantRequest.getRestauranttype_id());
	        
	        // Guardar los cambios
	        daoRestaurant.save(restaurant);

	        // Cambiar el estado de la solicitud de actualización a "Aprobado"
	        restaurantRequest.setRequeststatusId(1); // 1 = Aprobado
	        restaurant.setRuc(restaurantRequest.getRuc());
	        daoRestaurantRequest.save(restaurantRequest);

	        response.put("message", "Restaurante actualizado exitosamente.");
	        response.put("restaurant", restaurant);
	        response.put("status", HttpStatus.OK);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.OK).body(response);

	    } catch (Exception e) {
	        response.put("message", "Error al procesar la solicitud de actualización.");
	        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }
	}


}
