import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { MyrestaurantsService } from 'src/app/services/myrestaurants.service';
import { BookingsService } from 'src/app/services/bookings.service';
import { BookingStatusService } from 'src/app/services/bookingstatus.service';
import Swal from 'sweetalert2';
import { RestaurantType } from 'src/app/model/restauranttype';
import { RestauranttypeService } from 'src/app/services/restauranttype.service';
import { UserTypesService } from 'src/app/services/usertypes.service';
import { AffiliationRequestsService } from 'src/app/services/affiliationrequests.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-myrestaurants',
  templateUrl: './myrestaurants.component.html',
  styleUrls: ['./myrestaurants.component.css']
})
export class MyrestaurantsComponent implements OnInit {

  usersList: any[] = [];
  userTypesList: any[] = [];
  userById: any[] = [];
  restaurantById: any[] = [];
  restaurantType: any[] = [];

  restaurant: any = {}

  formUserType: FormGroup
  formRestaurant: FormGroup
  formBooking: FormGroup
  formUser: FormGroup
  formRestaurantRequest: FormGroup
  formRestaurantType: FormGroup
  formNewRestaurantRequest: FormGroup

  title: any
  nameButton: any
  id: number

  constructor(
    private _myrestaurantService: MyrestaurantsService,
    private _userService: UsersService,
    private _loginService: LoginService,
    private _restaurantTypeService: RestauranttypeService,
    private _userTypesService: UserTypesService,
    private _sendNewRestaurantService: AffiliationRequestsService,
  ) { }

  ngOnInit(): void {
    const userid = this._loginService.getUserid(); 

    this.listRestaurantsByUserId(userid)
    this.listRestaurantTypes()
    this.listUserTypes()
    this.listUsers();
    this.initForm()
  }

  initForm() {
    this.formRestaurant = new FormGroup({
      restaurant_id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [ Validators.required, this.validAddress]),
      opening_hours: new FormControl(null, [Validators.required]),
      closing_hours: new FormControl(null, [Validators.required]),
      pax_limit: new FormControl(null, [Validators.required]),
      image_url: new FormControl(null, [Validators.required]),
      enable: new FormControl(null, [Validators.required]),
      restauranttype_id: new FormControl(null, [Validators.required]),
      userid: new FormControl(null, [Validators.required]),
    });

    this.formRestaurantType = new FormGroup({
      restauranttype_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });

    this.formRestaurantRequest = new FormGroup({
      restaurant_id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.\\-]{2,50}$')]),
      description: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\\-]{10,300}$')]),
      address: new FormControl(null, [ Validators.required, this.validAddress]),
      opening_hours: new FormControl(null, [Validators.required]),
      closing_hours: new FormControl(null, [Validators.required]),
      pax_limit: new FormControl(null, [Validators.required, Validators.min(1)]),
      image_url: new FormControl(null, [Validators.required, 
        Validators.pattern('^(http(s?):\\/\\/).*$')]),
      restauranttype_id: new FormControl(null, [Validators.required]),
      userid: new FormControl(null, [Validators.required]),
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

    this.formUserType = new FormGroup({
      usertype_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    })

    this.formNewRestaurantRequest = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.\\-]{2,50}$')]),
      description: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.\\-]{10,300}$')]),
      address: new FormControl(null, [Validators.required, this.validAddress]),
      opening_hours: new FormControl(null, [Validators.required]),
      closing_hours: new FormControl(null, [Validators.required]),
      pax_limit: new FormControl(null, [Validators.required, Validators.min(1)]),
      image_url: new FormControl(null, [Validators.required, 
        Validators.pattern('^(http(s?):\\/\\/).*$')]),
      restauranttype_id: new FormControl("", [Validators.required]),
      userid: new FormControl("", [Validators.required]),
      ruc: new FormControl(null, [Validators.required, Validators.pattern('^20\\d{9}$')]),
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
        this.formNewRestaurantRequest.controls['userid'].setValue(this._loginService.getUserid());
        console.log(data.users)
        if (this.usersList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listUserTypes() {
    this._userTypesService.listUserTypes()
      .subscribe((data) => {
        this.userTypesList = data.usertypes;
        console.log('Tipos de Usuarios recibidos:',data.usertypes)
        if (this.userTypesList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listRestaurantTypes() {
    this._restaurantTypeService.listRestaurantTypes()
      .subscribe((data) => {
        this.restaurantType = data.restauranttypes;
        console.log(data.restauranttypes)
        if (this.restaurantType.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  getRestaurantById(id: any) {
    this._myrestaurantService.getRestaurantById(id).subscribe((data) => {
      console.log('Datos del restaurante:', data);
      if (data && data.restaurants) {
        this.restaurant = data.restaurants;
  
        this.formRestaurantRequest.patchValue({
          restaurant_id: this.restaurant.restaurant_id || null,
          name: this.restaurant.name || null,
          description: this.restaurant.description || null,
          address: this.restaurant.address || null,
          opening_hours: this.restaurant.opening_hours || null,
          closing_hours: this.restaurant.closing_hours || null,
          pax_limit: this.restaurant.pax_limit || null,
          image_url: this.restaurant.image_url || null,
          restauranttype_id: this.restaurant.restauranttype_id || null,
          userid: this.restaurant.userid || null,
          ruc: this.restaurant.ruc || null
        });
        console.log('Formulario actualizado con:', this.formRestaurantRequest.value);
      } else {
        console.error('No se encontraron datos del restaurante.');
      }
    });
  }

  listRestaurantsByUserId(id: number) {
    this._myrestaurantService.listRestaurantsByUserId(id)
      .subscribe((data) => {
        console.log(data); 
        this.restaurantById = data.restaurants;
        console.log(data.restaurants)
        console.log("Obteniendo datos de restaurante "+id)
        console.log('Datos recibidos del restaurante:', data.restaurants);
        if (this.restaurantById.length == 0) {
          console.log("No hay datos de restaurantes por este usuario "+id)
        }
      });
  }
  sendUpdateRestaurant(id: number, form: any): void {
    console.log('Datos enviados:', form); 

    if (this.formRestaurantRequest.valid) {
      this._myrestaurantService.sendUpdateRestaurant(form, id).subscribe(
        (response) => {
          console.log('Respuesta del backend:', response);
          this.closeModal();
          this.getRestaurantById(id);
          this.resetForm();
        },
        (error) => {
          console.error('Error al enviar solicitud:', error);
        }
      );
    } else {
      console.log("Formulario no válido");
      this.errorAlert('Por favor, completa todos los campos requeridos antes de continuar.');
    }
  }

  titleModal(id: number) {
    this.title = `Actualizando tu restaurante`
    if (id != null) {
      this.id = id
      this.getRestaurantById(id)
      console.log("Listo para editar")
    }
  }

  titleNew(titulo: any, id: number) {
    this.listUsers();
    this.title = `${titulo} restaurante`
    titulo == "Crear" 
    if (id != null) {
      this.id = id
      console.log("Listo para crear")
    }
  }
  
  sendUpdateAlert() {
    if (this.formRestaurantRequest.invalid) {
      this.errorAlert('Por favor, completa todos los campos requeridos antes de continuar.');
    } else {
      Swal.fire({
        position: "center",
        icon: 'question',
        title: "Espera...",
        text: '¿Estás seguro de registrar la reserva?',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f44336',
      }).then((result) => {
        if (result.isConfirmed) {
          this.sendUpdateRestaurant(this.id, this.formRestaurantRequest.value);
          this.successAlert('Su solicitud de actualización ha sido enviada correctamente');
        }
      });
    }
  }

  createNewRestaurantRequest(): void {
    if (this.formNewRestaurantRequest.valid) {
      this._sendNewRestaurantService.createAffiliateRequest(this.formNewRestaurantRequest.value)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta', response);
            this.closeModalForNew();
            this.successAlert('Su envio se ha realizado correctamente');
            this.resetFormNew();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error', error);
            this.errorAlert('Ocurrió un error en el envio. Por favor, inténtelo de nuevo');
          }
        });
    } else {
      this.errorAlert('Por favor, complete todos los campos correctamente');
    }
  }
  

  closeModal() {
    const modalElement = document.getElementById('modalResRequestUpdate');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

  }

  closeModalForNew() {
    const modalElement = document.getElementById('modalNewRestaurant');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  resetForm(): void {
    this.formRestaurantRequest.reset();
  }

  resetFormNew(): void {
    this.formNewRestaurantRequest.reset();
  }

  
  closeButton() {
    this.resetForm();
    this.closeModal();
    
  }

  closeButtonNew(){
    this.resetFormNew();
    this.closeModalForNew();
  }

  successAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Restaurante enviado!",
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
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