import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { BookingsService } from 'src/app/services/bookings.service';
import { BookingStatusService } from 'src/app/services/bookingstatus.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {

  restaurantsList: any[] = [];
  usersList: any[] = [];
  bookingStatusList: any[] = [];

  formRestaurant: FormGroup
  formBooking: FormGroup
  formUser: FormGroup
  formBookingStatus: FormGroup

  title: any
  nameButton: any
  id: number

  constructor(
    private _restaurantService: RestaurantsService,
    private _bookingService: BookingsService,
    private _userService: UsersService,
    private _bookingStatusService: BookingStatusService,
    private _loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.listRestaurants()
    this.listBookingStatus()
    this.listUsers();
    this.initForm()
  }

  initForm() {
    this.formRestaurant = new FormGroup({
      restaurant_id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      opening_hours: new FormControl(null, [Validators.required]),
      closing_hours: new FormControl(null, [Validators.required]),
      pax_limit: new FormControl(null, [Validators.required]),
      image_url: new FormControl(null, [Validators.required]),
      enable: new FormControl(null, [Validators.required]),
      restauranttype_id: new FormControl(null, [Validators.required]),
    });

    this.formBooking = new FormGroup({
      restaurant_id: new FormControl(null, [Validators.required]),
      bookingstatusid: new FormControl(null, [Validators.required]),
      booking_date: new FormControl(null, [Validators.required, this.validateBookingDate()]),
      userid: new FormControl(null, [Validators.required]),
      pax: new FormControl(null),
      booking_time: new FormControl(null),
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

    this.formBookingStatus = new FormGroup({
      bookingstatusid: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    })

  }

  validateBookingDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const bookingDate = new Date(control.value);
      const now = new Date();

      if (!control.value) {
        return null;
      }

      bookingDate.setHours(0,0,0,0)
      now.setHours(0,0,0,0)

      let year = bookingDate.getFullYear() - now.getFullYear();
      const month = bookingDate.getMonth() - now.getMonth();
      const day = bookingDate.getDate() - now.getDate();

      if (year == 0) {
        if (month == 0) {
          if (day >= 0) {
            year;
          }
          else {
            year--;
          }
        }
        else if (month > 0) {
          year;
        }
        else {
          year--;
        }
      }

      return year >= 0 ? null : { pastDate: true };
    };
  }

  validateBookingTime(openingHours: string, closingHours: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const bookingTime = new Date();
      const openingTime = new Date();
      const closingTime = new Date();

      if (!control.value) {
        return null;
      }

      const [bookingHour, bookingMinutes] = control.value.split(':').map(Number);
      const [openingHour, openingMinutes] = openingHours.split(':').map(Number);
      const [closingHour, closingMinutes] = closingHours.split(':').map(Number);

      bookingTime.setHours(bookingHour, bookingMinutes, 0);
      openingTime.setHours(openingHour, openingMinutes, 0);
      closingTime.setHours(closingHour, closingMinutes, 0);

      if (bookingTime < openingTime || bookingTime > closingTime) {
        return { invalidBookingTime: true };
      }

      return null;
    };
  }

  validatePax(paxLimit: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pax = control.value

      if (pax > paxLimit || pax < 1) {
        return { invalidPax: true };
      }

      return null;
    };
  }

  listUsers() {
    this._userService.listUsers()
      .subscribe((data) => {
        this.usersList = data.users;
        console.log(data.users)
        if (this.usersList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listRestaurants() {
    this._restaurantService.listRestaurants()
      .subscribe((data) => {
        this.restaurantsList = data.restaurants;
        console.log(data.restaurants)
        if (this.restaurantsList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listRestaurantsByName(name: String) {
    this._restaurantService.listRestaurantsByName(name)
      .subscribe((data) => {
        this.restaurantsList = data.restaurants;
        console.log(data.restaurants)
        if (this.restaurantsList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listBookingStatus(): void {
    this._bookingStatusService.listBookingStatus()
      .subscribe((data) => {
        this.bookingStatusList = data.bookingstatus;
        console.log(data.bookingstatus);
        if (this.bookingStatusList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  createBooking(): void {
    this._bookingService.createBooking(this.formBooking.value)
      .subscribe({
        next: (response) => {
          this.closeModal();
          this.listRestaurants();
          this.resetForm();
          console.log('Reserva registrada', response);
        },
        error: (error) => {
          console.error('Error', error);
          this.errorAlert('Ocurrió un error en el registro. Por favor, inténtelo de nuevo');
        }
      });
  }

  titleModal(id: number) {
    this.title = `Programar Reserva`;
    if (id != null) {
      this.id = id;
      const selectedRestaurant = this.restaurantsList.find(r => r.restaurant_id === id);
      const openingHours = selectedRestaurant.opening_hours;
      const closingHours = selectedRestaurant.closing_hours;
      const pax_limit = selectedRestaurant.pax_limit

      this.formBooking.controls['restaurant_id'].setValue(id);
      this.formBooking.controls['userid'].setValue(this._loginService.getUserid());
      this.formBooking.controls['bookingstatusid'].setValue(2);

      this.formBooking.controls['pax'].setValidators([
        Validators.required,
        this.validatePax(pax_limit)
      ]);
      this.formBooking.controls['booking_time'].setValidators([
        Validators.required,
        this.validateBookingTime(openingHours, closingHours)
      ]);

    }
  }

  createBookingAlert() {
    if (this.formBooking.valid) {
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
          this.createBooking()
          this.successAlert(('Su reserva ha sido registrada correctamente'))
        }
      });
    }
    else {
      this.errorAlert(('Por favor, completa todos los campos requeridos antes de continuar.'))
    }
  }

  closeModal() {
    const modalElement = document.getElementById('modalBooking');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  resetForm(): void {
    this.formBooking.reset();
  }

  closeButton() {
    this.resetForm();
    this.closeModal();
  }

  successAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Reserva Registrada!",
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