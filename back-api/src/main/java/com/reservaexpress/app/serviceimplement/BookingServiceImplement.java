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

import com.reservaexpress.app.model.Booking;
import com.reservaexpress.app.repository.BookingRepository;
import com.reservaexpress.app.service.BookingService;

@Service
public class BookingServiceImplement implements BookingService {

	@Autowired
	private BookingRepository daoBooking;

	@Override
	public ResponseEntity<Map<String, Object>> listBookings() {
		Map<String,Object> response = new HashMap<>();	
		List<Booking> bookings = daoBooking.findAll();
		
		if(!bookings.isEmpty()) {
			response.put("message", "Listado de Reservas");
			response.put("bookings", bookings);
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
	public ResponseEntity<Map<String, Object>> listBookingsByUser(int userid) {
		Map<String,Object> response = new HashMap<>();	
		List<Booking> bookingsByUser = daoBooking.findByUserid(userid);
		
		if(!bookingsByUser.isEmpty()) {
			response.put("message", "Listado de Reservas por Usuario");
			response.put("bookings", bookingsByUser);
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
	public ResponseEntity<Map<String, Object>> getBookingById(int id) {
		Map<String,Object> response = new HashMap<>();		
		Optional<Booking> existingBooking = daoBooking.findById(id);
		
		if(existingBooking.isPresent()) {
			response.put("bookings", existingBooking);
			response.put("message", "La reserva ha sido encontrada exitosamente");
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
	public ResponseEntity<Map<String, Object>> createBooking(Booking booking) {
		Map<String,Object> response = new HashMap<>();	
		
		daoBooking.save(booking);
		response.put("bookings", booking);
		response.put("message", "La reserva ha sido programada exitosamente");
		response.put("status", HttpStatus.CREATED);
		response.put("date", new Date());	
		return ResponseEntity.status(HttpStatus.CREATED).body(response);	
	}

	@Override
	public ResponseEntity<Map<String, Object>> updateBooking(Booking booking, int id) {
		Map<String,Object> response = new HashMap<>();	
	    Optional<Booking> existingBooking = daoBooking.findById(id);	
	    
		if (existingBooking.isPresent()) {
			
			Booking obtainedBooking = existingBooking.get();
			
			obtainedBooking.setBooking_date(booking.getBooking_date());
			obtainedBooking.setBooking_time(booking.getBooking_time());
			obtainedBooking.setPax(booking.getPax());
			obtainedBooking.setRestaurant_id(booking.getRestaurant_id());
			obtainedBooking.setUserid(booking.getUserid());
	        obtainedBooking.setBookingstatusid(booking.getBookingstatusid());
	        
	        daoBooking.save(obtainedBooking);
	        
			response.put("bookings", obtainedBooking);
			response.put("message", "La reserva ha sido reprogramada exitosamente para: " + id);
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
	public ResponseEntity<Map<String, Object>> cancelBooking(int id) {
		Map<String,Object> response = new HashMap<>();	
		Optional<Booking> existingBooking = daoBooking.findById(id);	
		
		if (existingBooking.isPresent()) {
			Booking obtainedBooking = existingBooking.get();
			obtainedBooking.setBookingstatusid(3);
			daoBooking.save(obtainedBooking);
			response.put("bookings", obtainedBooking);
			response.put("message", "La reserva ha sido cancelada exitosamente");
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
	public ResponseEntity<Map<String, Object>> declineBooking(int id) {
		Map<String,Object> response = new HashMap<>();	
		Optional<Booking> existingBooking = daoBooking.findById(id);	
		
		if (existingBooking.isPresent()) {
			Booking obtainedBooking = existingBooking.get();
			obtainedBooking.setBookingstatusid(4);
			daoBooking.save(obtainedBooking);
			response.put("bookings", obtainedBooking);
			response.put("message", "La reserva ha sido rechazada exitosamente");
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
	public ResponseEntity<Map<String, Object>> acceptBooking(int id) {
		Map<String,Object> response = new HashMap<>();	
		Optional<Booking> existingBooking = daoBooking.findById(id);	
		
		if (existingBooking.isPresent()) {
			Booking obtainedBooking = existingBooking.get();
			obtainedBooking.setBookingstatusid(5);
			daoBooking.save(obtainedBooking);
			response.put("bookings", obtainedBooking);
			response.put("message", "La reserva ha sido aceptada exitosamente");
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
	public ResponseEntity<Map<String, Object>> listBookingsByOwner(int userid) {
	    Map<String, Object> response = new HashMap<>();
	    List<Booking> bookings = daoBooking.findByRestaurantOwner(userid);
	    
	    if (!bookings.isEmpty()) {
	        response.put("message", "Reservas asociadas al propietario del restaurante");
	        response.put("bookings", bookings);
	        response.put("status", HttpStatus.OK);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.OK).body(response);
	    } else {
	        response.put("message", "No se han encontrado reservas para el afiliado con ID: " + userid);
	        response.put("status", HttpStatus.OK);
	        response.put("date", new Date());
	        return ResponseEntity.status(HttpStatus.OK).body(response);
	    }
	}

}
