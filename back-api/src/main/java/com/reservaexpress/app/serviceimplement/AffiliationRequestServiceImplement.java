package com.reservaexpress.app.serviceimplement;

import java.net.HttpURLConnection;
import java.net.URL;
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

import com.reservaexpress.app.model.AffiliationRequest;
import com.reservaexpress.app.model.Restaurant;
import com.reservaexpress.app.model.RestaurantType;
import com.reservaexpress.app.model.User;
import com.reservaexpress.app.repository.AffiliationRequestRepository;
import com.reservaexpress.app.repository.RestaurantRepository;
import com.reservaexpress.app.repository.RestaurantTypeRepository;
import com.reservaexpress.app.repository.UserRepository;
import com.reservaexpress.app.service.AffiliationRequestService;

@Service
public class AffiliationRequestServiceImplement implements AffiliationRequestService {

	@Autowired
	private AffiliationRequestRepository daoAffiliationRequest;
	
	@Autowired
	private RestaurantRepository daoRestaurant;
	
	@Autowired
	private RestaurantTypeRepository daoRestaurantType;
	
	@Autowired
	private UserRepository daoUser;

	@Override
	public ResponseEntity<Map<String, Object>> listAffiliateRequests() {
		Map<String,Object> response = new HashMap<>();	
		List<AffiliationRequest> affiliationRequests = daoAffiliationRequest.findByRequeststatusId(2);
		
		if(!affiliationRequests.isEmpty()) {
			response.put("message", "Listado de Solicitudes de Afiliación");
			response.put("affiliationRequests", affiliationRequests);
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
	public ResponseEntity<Map<String, Object>> createAffiliateRequest(AffiliationRequest affiliationRequest) {
	    Map<String, Object> response = new HashMap<>();
	    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	    String formattedDate = formatter.format(new Date());

	    String ruc = affiliationRequest.getRuc();

	    if (!isRucValid(ruc)) {
	        response.put("message", "El RUC proporcionado no es válido o no existe.");
	        response.put("status", HttpStatus.BAD_REQUEST);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	    }

	    affiliationRequest.setRequeststatusId(2);
	    affiliationRequest.setRequest_date(formattedDate);
	    
	    daoAffiliationRequest.save(affiliationRequest);
	    response.put("affiliationRequest", affiliationRequest);
	    response.put("message", "La solicitud ha sido registrada exitosamente");
	    response.put("status", HttpStatus.CREATED);
	    response.put("date", new Date());
	    return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	private boolean isRucValid(String ruc) {
	    String apiUrl = "https://api.apis.net.pe/v2/sunat/ruc?numero=" + ruc;
	    String token = "apis-token-12570.kSeNR7PRwknhpPz7h0WcXarJjM1dZCZu";

	    try {
	        HttpURLConnection connection = (HttpURLConnection) new URL(apiUrl).openConnection();
	        connection.setRequestMethod("GET");
	        connection.setRequestProperty("Authorization", "Bearer " + token);

	        int responseCode = connection.getResponseCode();

	        return responseCode == 200;
	    } catch (Exception e) {
	        System.out.println("Error al verificar el RUC: " + e.getMessage());
	        return false;
	    }
	}
	
	@Override
	public ResponseEntity<Map<String, Object>> declineAffiliateRequest(int id) {
		Map<String,Object> response = new HashMap<>();	
		Optional<AffiliationRequest> requestExists = daoAffiliationRequest.findById(id);	
		if (requestExists.isPresent()) {
			AffiliationRequest request = requestExists.get();
			request.setRequeststatusId(3);;
			daoAffiliationRequest.save(request);
			response.put("message", "Rechazado correctamente");
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
	public ResponseEntity<Map<String, Object>> approveAffiliationRequest(int id) {
	    Map<String, Object> response = new HashMap<>();

	    try {
	        // Verificar si la solicitud existe
	        Optional<AffiliationRequest> optionalRequest = daoAffiliationRequest.findById(id);
	        if (!optionalRequest.isPresent()) {
	            response.put("message", "La solicitud no existe.");
	            response.put("status", HttpStatus.NOT_FOUND);
	            response.put("date", new Date());	
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	        }

	        AffiliationRequest request = optionalRequest.get();

	        // Verificar si el usuario asociado a la solicitud existe
	        Optional<User> optionalUser = daoUser.findById(request.getUserid());
	        if (!optionalUser.isPresent()) {
	            response.put("message", "El usuario asociado a la solicitud no existe.");
	            response.put("status", HttpStatus.BAD_REQUEST);
	            response.put("date", new Date());	
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	        }
	        
	        Optional<RestaurantType> optionalRestaurantype = 
	        		daoRestaurantType.findById(request.getRestauranttype_id());

	        User user = optionalUser.get();
	        RestaurantType resturantype = optionalRestaurantype.get();

	        Restaurant restaurant = new Restaurant();
	        restaurant.setName(request.getName());
	        restaurant.setDescription(request.getDescription());
	        restaurant.setAddress(request.getAddress());
	        restaurant.setOpening_hours(request.getOpening_hours());
	        restaurant.setClosing_hours(request.getClosing_hours());
	        restaurant.setPax_limit(request.getPax_limit());
	        restaurant.setImage_url(request.getImage_url());
	        restaurant.setEnable("S"); 
	        
	        //aqui si vale la pena recordar para Obtener correctamenta la info de resType y User
	        restaurant.setRestauranttype_id(resturantype.getRestauranttype_id());
	        restaurant.setObjRestaurantType(resturantype);
	        
	        restaurant.setUserid(user.getUserid());
	        restaurant.setObjUser(user);
	        restaurant.setRuc(request.getRuc());

	        daoRestaurant.save(restaurant);

	        user.setUsertype_id(2); //Afiliado
	        daoUser.save(user);

	        request.setRequeststatusId(1); // Aprobado
	        daoAffiliationRequest.save(request);

	        response.put("message", "Restaurante creado exitosamente y solicitud aprobada.");
	        response.put("restaurant", restaurant);
	        response.put("status", HttpStatus.CREATED);
	        response.put("date", new Date());	
	        return ResponseEntity.status(HttpStatus.CREATED).body(response);

	    } catch (Exception e) {
	        response.put("message", "Error al procesar la solicitud.");
	        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR);
	        response.put("date", new Date());	
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }
	}

	@Override
	public ResponseEntity<Map<String, Object>> listapproveAR() {
	    Map<String, Object> response = new HashMap<>();
	    
	    List<AffiliationRequest> approvedRequests = daoAffiliationRequest.findByRequeststatusId(1);

	    if (!approvedRequests.isEmpty()) {
	        response.put("message", "Solicitudes aprobadas encontradas");
	        response.put("approvedRequests", approvedRequests);
	        response.put("status", HttpStatus.OK);
	    } else {
	        response.put("message", "No se encontraron solicitudes aprobadas");
	        response.put("status", HttpStatus.NOT_FOUND);
	    }
	    response.put("date", new Date());
	    return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@Override
	public ResponseEntity<Map<String, Object>> listdeclineAR() {
	    Map<String, Object> response = new HashMap<>();
	    
	    List<AffiliationRequest> declinedRequests = daoAffiliationRequest.findByRequeststatusId(3);

	    if (!declinedRequests.isEmpty()) {
	        response.put("message", "Solicitudes rechazadas encontradas");
	        response.put("declinedRequests", declinedRequests);
	        response.put("status", HttpStatus.OK);
	    } else {
	        response.put("message", "No se encontraron solicitudes rechazadas");
	        response.put("status", HttpStatus.NOT_FOUND);
	    }
	    response.put("date", new Date());
	    return ResponseEntity.status(HttpStatus.OK).body(response);
	}


}
