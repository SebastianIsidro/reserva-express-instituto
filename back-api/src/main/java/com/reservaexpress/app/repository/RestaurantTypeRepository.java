package com.reservaexpress.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.RestaurantType;

@Repository
public interface RestaurantTypeRepository extends JpaRepository<RestaurantType, Integer>{

}
