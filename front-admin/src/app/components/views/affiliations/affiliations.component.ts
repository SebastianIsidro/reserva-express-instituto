import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { AffiliationRequestsService } from 'src/app/services/affiliationrequests.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliations.component.html',
  styleUrls: ['./affiliations.component.css']
})
export class AffiliationsComponent implements OnInit {

  affiliationRequestsList: any[] = [];

  restaurantsList: any[] = [];
  usersList: any[] = [];
  bookingStatusList: any[] = [];

  formRestaurant: FormGroup
  formBooking: FormGroup
  formUser: FormGroup
  formBookingStatus: FormGroup
  formAffiliationRequest: FormGroup

  selectedRequestId: number; 
  actionType: 'approve' | 'decline'; 

  title: any
  nameButton: any
  id: number

  constructor(
    private _restaurantService: RestaurantsService,
    private _userService: UsersService,
    private _loginService: LoginService,
    private _affiliationService: AffiliationRequestsService
  ) { }

  ngOnInit(): void {
    const id = this._loginService.getUserid();
    this.listRestaurants()
    this.listUsers()
    this.initForm()
    this.listAffiliateRequests()
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

    this.formAffiliationRequest = new FormGroup({
      request_id: new FormControl(null, [Validators.required]),
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
    })

  }

  listAffiliateRequests() {
    this._affiliationService.listAffiliateRequests()
      .subscribe((data) => {
        this.affiliationRequestsList = data.affiliationRequests;

        console.log(data.affiliationRequests)
        if (this.affiliationRequestsList.length == 0) {
          console.log("No hay datos")
        }
      });
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

  approve(requestId: number): void {
    this.openConfirmationModal(requestId, 'approve');
  }

  decline(requestId: number): void {
    this.openConfirmationModal(requestId, 'decline');
  }

  confirmAction(): void {
    if (this.selectedRequestId !== null && this.actionType) {
      if (this.actionType === 'approve') {
        this._affiliationService.approveAffiliationRequest(this.selectedRequestId).subscribe({
          next: () => {
            this.successAlert('La solicitud ha sido aprobada exitosamente.');
            this.listAffiliateRequests();
            this.resetModalState();
          },
          error: (err) => {
            this.errorAlert('Error al aprobar la solicitud.');
            console.error(err);
          },
        });
      } else if (this.actionType === 'decline') {
        this._affiliationService.declineAffiliateRequest(this.selectedRequestId).subscribe({
          next: () => {
            this.successAlert('La solicitud ha sido rechazada exitosamente.');
            this.listAffiliateRequests();
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

    const modalElement = document.getElementById('modalAffiliation');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
  }

  resetModalState(): void {
    this.selectedRequestId = null;
    this.actionType = null;
    this.closeModal();
  }

  closeModal(): void {
    const modalElement = document.getElementById('modalAffiliation');
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
