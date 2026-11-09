package com.reservaexpress.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reservaexpress.app.model.RestaurantRequest;

public interface RestaurantRequestRepository extends JpaRepository<RestaurantRequest, Integer> {
	List<RestaurantRequest> findByRequeststatusId(int requeststatusId);
}
