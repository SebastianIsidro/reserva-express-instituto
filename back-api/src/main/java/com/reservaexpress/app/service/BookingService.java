package com.reservaexpress.app.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.reservaexpress.app.model.Booking;

public interface BookingService {
	
	public ResponseEntity<Map<String, Object>> listBookings();
	
	public ResponseEntity<Map<String, Object>> listBookingsByUser(int userid);
	
	public ResponseEntity<Map<String, Object>> getBookingById(int id);
	
	public ResponseEntity<Map<String, Object>> createBooking(Booking booking);
	
	public ResponseEntity<Map<String, Object>> updateBooking(Booking booking, int id);
	
	public ResponseEntity<Map<String, Object>> cancelBooking(int id);
	
	public ResponseEntity<Map<String, Object>> declineBooking(int id);

	public ResponseEntity<Map<String, Object>> acceptBooking(int id);
	
	public ResponseEntity<Map<String, Object>> listBookingsByOwner(int userid);

}
