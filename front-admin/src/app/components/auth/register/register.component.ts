import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister: FormGroup

  constructor(
    private _registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.formRegister = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$')]),
      lastname: new FormControl(null, [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$')]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^9\\d{8}$')]),
      gender: new FormControl("", [Validators.required]),
      birthdate: new FormControl(null, [Validators.required, this.validateAge()]),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,3}$')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^.{4,16}$')]),
    })
  }

  validateAge(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = new Date(control.value);
      const today = new Date();

      if (!control.value) {
        return null;
      }

      birthdate.setHours(0,0,0,0)
      today.setHours(0,0,0,0)

      let year = today.getUTCFullYear() - birthdate.getUTCFullYear();
      const month = today.getUTCMonth() - birthdate.getUTCMonth();
      const day = today.getUTCDate() - birthdate.getUTCDate();

      if (year == 18){
        if (month == 0){
          if (day > 0){
            year;
          }
          else {
            year--;
          }
        }
        else if (month > 0){
          year;
        }
        else{
          year--;
        }
      }

      return year >= 18 ? null : { ageRestriction: true };
    };
  }

  register(): void {
    if (this.formRegister.valid) {
      this._registerService.create(this.formRegister.value)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta', response);
            this.successfulAlert('Su registro se ha completado correctamente');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error', error);
            this.errorAlert('Ocurrió un error en el registro. Por favor, inténtelo de nuevo');
          }
        });
    } else {
      this.errorAlert('Por favor, complete todos los campos correctamente');
    }
  }

  successfulAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Usuario Registrado!",
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
    this.router.navigate(['/login'])
  }

  errorAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: '¡Error!',
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

}