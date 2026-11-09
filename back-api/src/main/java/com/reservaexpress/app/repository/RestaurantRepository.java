package com.reservaexpress.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.Restaurant;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer>{

	List<Restaurant> findByName(String name);
	List<Restaurant> findByUserid(int userid);
}
