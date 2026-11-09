package com.reservaexpress.app.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = AddressValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface Address {
    String message() default "La dirección debe contener al menos uno de los siguientes: Calle, Avenida, Jirón, Pasaje, Urbanización, Manzana, Lote, Plaza, Carretera, Kilómetro, Edificio, Bloque, Zona, Sector, Interior.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
