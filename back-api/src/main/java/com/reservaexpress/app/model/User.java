package com.reservaexpress.app.model;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.reservaexpress.app.validation.Adult;

import lombok.Data;

@Data
@Entity
@Table(name = "tb_users")
@EntityListeners(AuditingEntityListener.class)
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userid;
	@Pattern(regexp = "^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$",  message = "El nombre debe ser válido e iniciar con mayuscula")
	private String name;
	@Pattern(regexp = "^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$", message = "El apellido debe ser válido")
	private String lastname;
	@Pattern(regexp = "^9\\d{8}$", message = "El teléfono debe ser válido")
	private String phone;
	@Pattern(regexp = "^[MFO]$", message = "El género debe ser válido")
	private String gender;
    @Adult(message = "Tiene que ser mayor o igual de 18 años")
	private String birthdate;
	@Email(message = "El correo debe ser válido")
	private String email;
	@Pattern(regexp = "^.{4,16}$", message = "La contraseña debe ser válida")
	private String password_plain;
	private String password;
	private String creation_date;
	@Min(value = 0, message = "El tipo de usuario debe ser válido")
	@Max(value = 3, message = "El tipo de usuario debe ser válido")
	private int usertype_id;
	
	@ManyToOne
	@JoinColumn(name = "usertype_id", insertable = false, updatable = false)
	private UserType objUserType;
}

/*
{
	"name":"Usuario",
	"lastname":"Cibertec",
	"phone":"999888777",
	"gender":"M",
	"birthdate":"2000-08-07",
	"email":"usuariocibertec@gmail.com",
	"password":"uc1234",
}


{
	"name":"Luka",
	"lastname":"Cibertec Cober",
	"phone":"999888747",
	"gender":"M",
	"birthdate":"2000-08-07",
	"email":"luka30@gmail.com",
	"password":"Luka+70"
}
*/