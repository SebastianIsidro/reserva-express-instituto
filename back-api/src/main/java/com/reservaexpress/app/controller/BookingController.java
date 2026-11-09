package com.reservaexpress.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservaexpress.app.model.Booking;
import com.reservaexpress.app.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://localhost:4202"})
public class BookingController {

	@Autowired
	private BookingService service;

	@GetMapping
	public ResponseEntity<Map<String, Object>> listBookings() {
		return service.listBookings();
	}
	
	@GetMapping("/find/{id}")
	public ResponseEntity<Map<String, Object>> listBookingsByUser(@PathVariable int id) {
		return service.listBookingsByUser(id);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable int id) {
		return service.getBookingById(id);
	}
	
	@PostMapping
	public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Booking booking) {
		return service.createBooking(booking);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> updateBooking(@RequestBody Booking booking, @PathVariable int id) {
		return service.updateBooking(booking, id);
	}
	
	@PutMapping("/cancel/{id}")
	public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable int id) {
		return service.cancelBooking(id);
	}
	
	@PutMapping("/decline/{id}")
	public ResponseEntity<Map<String, Object>> declineBooking(@PathVariable int id) {
		return service.declineBooking(id);
	}
	@PutMapping("/accept/{id}")
	public ResponseEntity<Map<String, Object>> acceptBooking(@PathVariable int id) {
		return service.acceptBooking(id);
	}
	
	@GetMapping("/owner/{id}")
	public ResponseEntity<Map<String, Object>> listBookingsByOwner(@PathVariable int id) {
	    return service.listBookingsByOwner(id);
	}

}






