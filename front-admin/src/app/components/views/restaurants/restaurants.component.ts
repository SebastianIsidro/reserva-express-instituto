import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { BookingsService } from 'src/app/services/bookings.service';
import { BookingStatusService } from 'src/app/services/bookingstatus.service';
import Swal from 'sweetalert2';
import { RestaurantrequestService } from 'src/app/services/restaurantrequest.service';

declare var bootstrap: any;

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {

  restaurantsList: any[] = [];
  restaurantRequestList: any[] = [];
  usersList: any[] = [];
  bookingStatusList: any[] = [];
  restaurantTypeList: any[] = [];

  formRestaurant: FormGroup
  formBooking: FormGroup
  formUser: FormGroup
  formBookingStatus: FormGroup
  formRestaurantRequest: FormGroup

  selectedRequestId: number; 
  actionType: 'approve' | 'decline'; 

  title: any
  nameButton: any
  id: number

  constructor(
    private _restaurantService: RestaurantsService,
    private _bookingService: BookingsService,
    private _userService: UsersService,
    private _bookingStatusService: BookingStatusService,
    private _loginService: LoginService,
    private _restaurantrequestService :RestaurantrequestService,
  ) { }

  ngOnInit(): void {
    this.listRestaurantsRequests()
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
      bookingstatus_id: new FormControl(null, [Validators.required]),
      booking_date: new FormControl(null, [Validators.required, this.validateBookingDate()]),
      userid: new FormControl(null, [Validators.required]),
      pax: new FormControl(null),
      booking_time: new FormControl(null),
    });

    this.formUser = new FormGroup({
      user_id: new FormControl(null, [Validators.required]),
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
      bookingstatus_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    })

    this.formRestaurantRequest = new FormGroup({
      restaurantrequests_id: new FormControl(null, [Validators.required]),
      restaurant_id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      opening_hours: new FormControl(null, [Validators.required]),
      closing_hours: new FormControl(null, [Validators.required]),
      pax_limit: new FormControl(null, [Validators.required]),
      image_url: new FormControl(null, [Validators.required]),
      restauranttype_id: new FormControl(null, [Validators.required]),
      requeststatus_id: new FormControl(null, [Validators.required]),
      request_date: new FormControl(null, [Validators.required]),
      userd_id: new FormControl(null, [Validators.required]), 
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

  listRestaurantsRequests() {
    this._restaurantrequestService.listRestaurantsRequests()
      .subscribe((data) => {
        this.restaurantRequestList = data.restaurantrequests;
        console.log(data.restaurantrequests)
        if (this.restaurantRequestList.length == 0) {
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

  approve(requestId: number): void {
    this.openConfirmationModal(requestId, 'approve');
  }

  decline(requestId: number): void {
    this.openConfirmationModal(requestId, 'decline');
  }

  confirmAction(): void {
    if (this.selectedRequestId !== null && this.actionType) {
      if (this.actionType === 'approve') {
        this._restaurantrequestService.approveRestaurantRequest(this.selectedRequestId).subscribe({
          next: () => {
            this.successAlert('La solicitud ha sido aprobada exitosamente.');
            this.listRestaurantsRequests();
            this.resetModalState();
          },
          error: (err) => {
            this.errorAlert('Error al aprobar la solicitud.');
            console.error(err);
          },
        });
      } else if (this.actionType === 'decline') {
        this._restaurantrequestService.declineRestaurantRequest(this.selectedRequestId).subscribe({
          next: () => {
            this.successAlert('La solicitud ha sido rechazada exitosamente.');
            this.listRestaurantsRequests();
            this.resetModalState();
          },
          error: (err) => {
            this.errorAlert('Error al rechazar la solicitud.');
            console.error(err);
          },
        });
      }
    }
  }

  openConfirmationModal(requestId: number, actionType: 'approve' | 'decline'): void {
    this.selectedRequestId = requestId;
    this.actionType = actionType;

    const modalElement = document.getElementById('modalRestaurantRequest');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
  }

  resetModalState(): void {
    this.selectedRequestId = null;
    this.actionType = null;
    this.closeModal();
  }

  closeModal(): void {
    const modalElement = document.getElementById('modalRestaurantRequest');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  }

  successAlert(message: string): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  errorAlert(message: string): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
}