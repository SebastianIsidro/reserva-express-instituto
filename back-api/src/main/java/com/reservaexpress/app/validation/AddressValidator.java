package com.reservaexpress.app.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class AddressValidator implements ConstraintValidator<Address, String> {

    private static final List<String> VALID_KEYWORDS = Arrays.asList(
        "C.", "Calle", "Av.", "Avenida", "Jr.", "Jirón", "Pje.", "Pasaje", "Urb.", "Urbanización", 
        "Mz.", "Manzana", "Lte.", "Lote",
        "Plz.", "Plaza", "Car.", "Carretera", "Km.", "Kilómetro", "Edif.", "Edificio", "Bl.", "Bloque", 
        "Zn.", "Zona", "Sec.", "Sector", "Int.", "Interior"
    );

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return false;
        }

        return VALID_KEYWORDS.stream().anyMatch(value::contains);
    }
}
