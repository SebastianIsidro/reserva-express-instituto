package com.reservaexpress.app.serviceimplement;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.reservaexpress.app.model.BookingStatus;
import com.reservaexpress.app.repository.BookingStatusRepository;
import com.reservaexpress.app.service.BookingStatusService;

@Service
public class BookingStatusServiceImplement implements BookingStatusService {

	@Autowired
	private BookingStatusRepository daoBookingStatus;

	@Override
	public ResponseEntity<Map<String, Object>> listBookingStatus() {
		Map<String,Object> response = new HashMap<>();	
		List<BookingStatus> bookingstatus = daoBookingStatus.findAll();
		
		if(!bookingstatus.isEmpty()) {
			response.put("message", "Listado de Estados de Reserva");
			response.put("bookingstatus", bookingstatus); 
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
