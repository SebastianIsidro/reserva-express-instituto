import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AffiliationRequestsService } from 'src/app/services/affiliationrequests.service';
import { LoginService } from 'src/app/services/login.service';
import { RestauranttypeService } from 'src/app/services/restauranttype.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-affiliation',
  templateUrl: './affiliation.component.html',
  styleUrls: ['./affiliation.component.css']
})
export class AffiliationComponent implements OnInit {

  affiliationRequestsList: any[] = [];
  restaurantTypesList: any[] = [];
  usersList: any[] = [];

  formAffiliationRequest: FormGroup
  formUser: FormGroup
  formRestaurantType: FormGroup

  title: any
  nameButton: any
  id: number

  constructor(
    private _affiliationRequestsService: AffiliationRequestsService,
    private _userService: UsersService,
    private _restauranttypesService: RestauranttypeService,
    private _loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listUsers()
    this.initForm()
    this.listRestaurantTypes()
  }

  initForm() {

    this.formAffiliationRequest = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.\\-]{2,50}$')]),
      description: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\\-]{10,300}$')]),
      address: new FormControl(null, [ Validators.required, this.validAddress]),
      opening_hours: new FormControl(null, [Validators.required]),
      closing_hours: new FormControl(null, [Validators.required]),
      pax_limit: new FormControl(null, [Validators.required, Validators.min(1)]),
      image_url: new FormControl(null, [Validators.required, 
        Validators.pattern('^(http(s?):\\/\\/).*$')]),
      restauranttype_id: new FormControl("", [Validators.required]),
      userid: new FormControl("", [Validators.required]),
      ruc: new FormControl(null, [Validators.required, Validators.pattern('^20\\d{9}$')]),
    });

    this.formUser = new FormGroup({
      userid: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      birthdate: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      creation_date: new FormControl(null, [Validators.required]),
      usertype_id: new FormControl(null, [Validators.required]),
    })

    this.formRestaurantType = new FormGroup({
      restauranttype_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
  }

  validAddress(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const validKeywords = [
      "C.", "Calle", "Av.", "Avenida", "Jr.", "Jirón", "Pje.", "Pasaje", "Urb.", "Urbanización", 
      "Mz.", "Manzana", "Lte.", "Lote",
      "Plz.", "Plaza", "Car.", "Carretera", "Km.", "Kilómetro", "Edif.", "Edificio", "Bl.", "Bloque", 
      "Zn.", "Zona", "Sec.", "Sector", "Int.", "Interior"
    ];

    const isValid = validKeywords.some(keyword => value.includes(keyword));
    return isValid ? null : { invalidAddress: true };
  }

  listUsers() {
    this._userService.listUsers()
      .subscribe((data) => {
        this.usersList = data.users;
        this.formAffiliationRequest.controls['userid'].setValue(this._loginService.getUserid());
        console.log(data.users)
        if (this.usersList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listRestaurantTypes() {
    this._restauranttypesService.listRestaurantTypes()
      .subscribe((data) => {
        this.restaurantTypesList = data.restauranttypes;
        console.log(data.restauranttypes)
        if (this.restaurantTypesList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  createAffiliateRequest(): void {
    if (this.formAffiliationRequest.valid) {
      this._affiliationRequestsService.createAffiliateRequest(this.formAffiliationRequest.value)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta', response);
            this.successAlert('Su registro se ha completado correctamente');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error', error);
            const errorMessage = error.error?.message || 'Ocurrió un error en el registro. Por favor, inténtelo de nuevo';
            this.errorAlert(errorMessage);
          }
        });
    } else {
      this.errorAlert('Por favor, complete todos los campos correctamente');
    }
  }

  successAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Solicitud Registrada!",
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
    this.formAffiliationRequest.reset()
    this.listUsers()
    this.listRestaurantTypes()
    this.formAffiliationRequest.controls['restauranttype_id'].setValue("")
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