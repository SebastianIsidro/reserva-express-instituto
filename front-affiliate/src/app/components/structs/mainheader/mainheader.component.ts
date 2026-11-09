import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mainheader',
  templateUrl: './mainheader.component.html',
  styleUrls: ['./mainheader.component.css']
})
export class MainheaderComponent implements OnInit {

  constructor(
    private _loginService : LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout(){
    Swal.fire({
      position: "center",
      icon: 'question',
      title: "Espera...",
      text: '¿Estás seguro de cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f44336',
    }).then((result) => {
      if (result.isConfirmed) {
        this._loginService.logout()
        this.router.navigate(['login'])
      }
    });
  }

}
