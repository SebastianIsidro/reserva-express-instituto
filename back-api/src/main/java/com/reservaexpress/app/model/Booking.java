package com.reservaexpress.app.model;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;

@Data
@Entity
@Table(name = "tb_bookings")
@EntityListeners(AuditingEntityListener.class)
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int booking_id;
	private String booking_date;
	private String booking_time;
	private int pax;
	private int restaurant_id;
	private int userid;
	private int bookingstatusid;
	
	@ManyToOne
	@JoinColumn(name = "restaurant_id", insertable = false, updatable = false)
	private Restaurant objRestaurant;
	
	@ManyToOne
	@JoinColumn(name = "userid", insertable = false, updatable = false)
	private User objUser;
	
	@ManyToOne
	@JoinColumn(name = "bookingstatusid", insertable = false, updatable = false)
	private BookingStatus objBookingStatus;
	
}

/*
{
//@Column(name = "bookingstatus_id")
	"booking_date":"2024-11-10",
	"booking_time":"10:30:00",
	"pax":4,
	"restaurant_id":1,
	"userid":4,
	"bookingstatus_id":2
}
*/