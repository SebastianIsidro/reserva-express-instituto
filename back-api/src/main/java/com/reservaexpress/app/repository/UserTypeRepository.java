package com.reservaexpress.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reservaexpress.app.model.UserType;

@Repository
public interface UserTypeRepository extends JpaRepository<UserType, Integer>{

}
