package com.reservaexpress.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer>{
	List<Booking> findByUserid(int userid);

	@Query("SELECT b FROM Booking b JOIN b.objRestaurant r WHERE r.objUser.userid = :userid AND b.bookingstatusid = 2")
	List<Booking> findByRestaurantOwner(int userid);
	
	List<Booking> findByBookingstatusid(int bookingstatusid);
	
}
