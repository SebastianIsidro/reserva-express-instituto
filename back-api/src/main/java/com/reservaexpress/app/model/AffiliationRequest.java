package com.reservaexpress.app.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Pattern;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.reservaexpress.app.validation.Address;

import lombok.Data;

@Data
@Entity
@Table(name = "tb_affiliationrequests")
@EntityListeners(AuditingEntityListener.class)
public class AffiliationRequest {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int request_id;
	@Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.\\-]{2,100}$", 
	         message = "El nombre debe contener al menos 2 letras y puede incluir letras, espacios, y caracteres comunes (, . -).")
	private String name;

	@Pattern(regexp = "^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\\-]{10,300}$", 
	         message = "La descripción debe tener entre 10 y 300 caracteres y solo puede incluir letras, números y caracteres comunes (, . -).")
	private String description;
	@Address
	private String address;
	private String opening_hours;
	private String closing_hours;
	private int pax_limit;
	@Pattern(regexp = "^(http(s?):\\/\\/).*$", 
	message = "La URL debe comenzar con 'http://' o 'https://'.")
	private String image_url;

	private int restauranttype_id;
	@Column(name = "requeststatus_id")
	private int requeststatusId;
	private String request_date;
	private int userid;
	
	@Column(name = "ruc", length = 11, unique = true, nullable = false)
	@Pattern(regexp = "^20\\d{9}$", message = "El RUC debe comenzar con 20 y tener exactamente 11 dígitos.")
	private String ruc;
	
	
	@ManyToOne
	@JoinColumn(name = "restauranttype_id", insertable = false, updatable = false)
	private RestaurantType objRestaurantType;
	
	@ManyToOne
	@JoinColumn(name = "userid", insertable = false, updatable = false)
	private User objUser;
	
	@ManyToOne
	@JoinColumn(name = "requeststatus_id", insertable = false, updatable = false)
	private RequestStatus objRequestStatus;
}

/*
{
    "name":"Madam Brave",
	"description":"Es un restaurante que combina la rica herencia culinaria china-peruana con la creatividad y el enfoque vanguardista de Gastón Acurio, ofreciendo platos llenos de sabor y una experiencia gastronómica única",
	"address":"Av. Sta. Cruz 859, Miraflores 15074",
	"opening_hours":"11:00:00",
	"closing_hours":"22:59:59",
	"pax_limit":20,
	"image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbe1yvDphJs7PUIAP2QRrAgRh1k5Emh7xHjQ&s",
	"restauranttype_id":4,
    "user_id":4,
    "ruc": "30129123454"
}
*/