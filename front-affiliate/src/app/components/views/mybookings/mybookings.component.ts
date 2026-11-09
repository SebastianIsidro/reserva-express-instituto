import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
declare var bootstrap: any

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css']
})
export class MybookingsComponent implements OnInit {

  bookingsList: any[]=[]

  selectedBookingId: number;
  actionType: 'accept'| 'decline';
  constructor(
    private _bookingsService: BookingsService,
    private _loginService: LoginService
  ) { }

  userId = this._loginService.getUserid();
  ngOnInit(): void {
    this.listBookingsByOwner(this.userId);
  }

  listBookingsByOwner(userid: any){
    this._bookingsService.getBookingByOwner(userid)
    .subscribe((data)=>{
      this.bookingsList = data.bookings;
      console.log(data.bookings)
    })
  }
  accept(status: number):void{
    this.openConfirmationModal(status, 'accept');
  }

  decline(stauts: number): void {
    this.openConfirmationModal(stauts, 'decline');
  }
  confirmAction(): void {
    if (this.selectedBookingId !== null && this.actionType) {
      if (this.actionType === 'accept') {
        this._bookingsService.acceptBooking(this.selectedBookingId).subscribe({
          next: () => {
            this.successAlert('La reserva a sido aceptada exitosamente.');
            this.listBookingsByOwner(this.userId);
            this.resetModalState();
          },
          error: (err) => {
            this.errorAlert('Error al aceptar la reserva.');
            console.error(err);
          },
        });
      } else if (this.actionType === 'decline') {
        this._bookingsService.declineBooking(this.selectedBookingId).subscribe({
          next: () => {
            this.successAlert('La reserva ha sido rechazada exitosamente.');
            this.listBookingsByOwner(this.userId);
            this.resetModalState();
          },
          error: (err) => {
            this.errorAlert('Error al rechazar la reserva.');
            console.error(err);
          },
        });
      }
    }
  }

  openConfirmationModal(bookingId: number, actionType: 'accept' | 'decline'): void {
    this.selectedBookingId = bookingId;
    this.actionType = actionType;

    const modalElement = document.getElementById('modalMyBookings');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    

  }
  resetModalState(): void {
    this.selectedBookingId = null;
    this.actionType = null;
    this.closeModal();
  }
  closeModal(): void {
    const modalElement = document.getElementById('modalMyBookings');
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
