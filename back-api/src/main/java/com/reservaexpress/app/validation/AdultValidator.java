package com.reservaexpress.app.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

public class AdultValidator implements ConstraintValidator<Adult, String> {

    @Override
    public void initialize(Adult constraintAnnotation) {
    }

    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return false;
        }

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate birthdate = LocalDate.parse(value, formatter);
            
            LocalDate today = LocalDate.now();
            long yearsBetween = ChronoUnit.YEARS.between(birthdate, today);

            return yearsBetween >= 18;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
}