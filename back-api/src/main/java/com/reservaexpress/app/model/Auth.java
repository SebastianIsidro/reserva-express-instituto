package com.reservaexpress.app.model;

import lombok.Data;

@Data
public class Auth {

	private String email;
	private String password;
	private int usertype_id;
}

/*
{
	"email":"usuariocibertec@gmail.com",
	"password":"uc1234"
}
*/