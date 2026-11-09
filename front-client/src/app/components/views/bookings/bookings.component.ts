import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { BookingsService } from 'src/app/services/bookings.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';

declare var bootstrap: any;

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  restaurantsList: any[] = [];
  bookingsList: any[] = []
  formBooking: FormGroup
  title: any
  id: number

  constructor(
    private _restaurantService: RestaurantsService,
    private _bookingsService: BookingsService,
    private _loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const userid = this._loginService.getUserid();
    this.listRestaurants()
    this.listBookingsByUser(userid);
    this.initForm()
  }

  initForm() {
    this.formBooking = new FormGroup({
      restaurant_id: new FormControl(null, [Validators.required]),
      bookingstatusid: new FormControl(null, [Validators.required]),
      booking_date: new FormControl(null, [Validators.required, this.validateBookingDate()]),
      userid: new FormControl(null, [Validators.required]),
      pax: new FormControl(null),
      booking_time: new FormControl(null),
    })
  }

  validateBookingDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const bookingDate = new Date(control.value);
      const now = new Date();

      if (!control.value) {
        return null;
      }

      bookingDate.setHours(0, 0, 0, 0)
      now.setHours(0, 0, 0, 0)

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

  listBookings() {
    this._bookingsService.listBookings()
      .subscribe((data) => {
        this.bookingsList = data.bookings;
        console.log(data.bookings)
        if (this.bookingsList.length == 0) {
          console.log("No hay datos")
        }
      });
  }

  listBookingsByUser(userid: any) {
    this._bookingsService.listBookingsByUser(userid)
      .subscribe((data) => {
        this.bookingsList = data.bookings;
        this.formBooking.controls['booking_date'].setValue(data.bookings.booking_date)
        this.formBooking.controls['booking_time'].setValue(data.bookings.booking_time)
        this.formBooking.controls['pax'].setValue(data.bookings.pax)
        this.formBooking.controls['restaurant_id'].setValue(data.bookings.restaurant_id)
        this.formBooking.controls['userid'].setValue(data.bookings.userid)
        this.formBooking.controls['bookingstatusid'].setValue(data.bookings.bookingstatusid)
        console.log(data.bookings)
      });
  }

  getBookingById(id: any) {
    let form = this.formBooking
    this._bookingsService.getBookingById(id)
      .subscribe((data) => {
        form.controls['booking_date'].setValue(data.bookings.booking_date)
        form.controls['booking_time'].setValue(data.bookings.booking_time)
        form.controls['pax'].setValue(data.bookings.pax)
        form.controls['restaurant_id'].setValue(data.bookings.restaurant_id)
        form.controls['userid'].setValue(data.bookings.userid)
        form.controls['bookingstatusid'].setValue(data.bookings.bookingstatusid)

        const selectedRestaurant = this.restaurantsList.find(r => r.restaurant_id === data.bookings.restaurant_id);
        console.log(selectedRestaurant)
        const openingHours = selectedRestaurant.opening_hours;
        const closingHours = selectedRestaurant.closing_hours;
        const pax_limit = selectedRestaurant.pax_limit
  
        this.formBooking.controls['pax'].setValidators([
          Validators.required,
          this.validatePax(pax_limit)
        ]);
        this.formBooking.controls['booking_time'].setValidators([
          Validators.required,
          this.validateBookingTime(openingHours, closingHours)
        ]);
      });
  }

  cancelBooking(id: any) {
    Swal.fire({
      title: '¿Estás seguro de cancelar la reserva?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f44336',
    }).then((result) => {
      if (result.isConfirmed) {
        this._bookingsService.cancelBooking(id, null)
          .subscribe((data) => {
            const updatedUserid = this._loginService.getUserid();
            this.listBookingsByUser(updatedUserid);
            console.log("Reserva cancelada", data)
          }, error => {
            console.error('Error al cancelar la reserva', error);
          });
        this.successAlert("La reserva ha sido cancelada correctamente.")
      }
    });
  }

  updateBooking(userid: number, form: any): void {
    console.log("Datos enviados:", form);
    if (this.formBooking.valid) {
      this._bookingsService.updateBooking(userid, form).subscribe(response => {
        this.closeModal()
        this.resetForm()

        const updatedUserid = this._loginService.getUserid();
        this.listBookingsByUser(updatedUserid);

        console.log('Reserva reprogramada', response);
      }, error => {
        console.error('Error al reprogramar reserva', error);
      });
    }
  }

  titleModal(id: number) {
    this.title = `Reprogramar Reserva`
    if (id != null) {
      this.id = id;
      this.getBookingById(id)
    }
  }

  updateBookingAlert() {
    if (this.formBooking.valid) {
      Swal.fire({
        position: "center",
        icon: 'question',
        title: "Espera...",
        text: '¿Estás seguro de modificar la reserva?',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f44336',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateBooking(this.id, this.formBooking.value)
          this.successAlert("Su reserva ha sido actualizada correctamente.")
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
    this.resetForm()
    this.closeModal()
  }

  successAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Reserva Modificada!",
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
