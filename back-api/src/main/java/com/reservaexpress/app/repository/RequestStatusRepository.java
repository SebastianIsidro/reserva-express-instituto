package com.reservaexpress.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.RequestStatus;

@Repository
public interface RequestStatusRepository extends JpaRepository<RequestStatus, Integer>{

}
