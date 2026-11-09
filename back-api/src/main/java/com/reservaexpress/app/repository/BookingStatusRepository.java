package com.reservaexpress.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.BookingStatus;

@Repository
public interface BookingStatusRepository extends JpaRepository<BookingStatus, Integer>{

}