import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup

  constructor(
    private _loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,3}$')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^.{4,16}$')]),
    })
  }

  login() {
    if (this.formLogin.valid) {
      console.log("Acceso", this.formLogin.value)
      this._loginService.enter(this.formLogin.value)
        .subscribe({
          next: (response) => {
            console.log("Respuesta: ", response)
            this.router.navigate(['/affiliations'])
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error', err);
            this.handleErrorResponse(err);
          }
        });
    }
    else {
      this.errorAlert('Por favor, complete todos los campos correctamente');
    }
  }

  handleErrorResponse(err: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el registro. Por favor, inténtelo de nuevo';

    if (err.status === 400) {
      errorMessage = 'Correo electrónico o contraseña incorrectos';
    } else if (err.status === 403) {
      errorMessage = 'Acceso denegado. Usuario no autorizado';
    } else if (err.status === 500) {
      errorMessage = 'Error interno del servidor. Por favor, inténtelo más tarde';
    }

    this.errorAlert(errorMessage);
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
    this.formLogin.reset();
  }

}
