package com.reservaexpress.app.model;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;

@Data
@Entity
@Table(name = "tb_restauranttypes")
@EntityListeners(AuditingEntityListener.class)
public class RestaurantType {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int restauranttype_id;
	private String description;
}