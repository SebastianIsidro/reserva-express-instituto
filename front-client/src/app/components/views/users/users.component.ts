import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { UserTypesService } from 'src/app/services/usertypes.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  usersList: any[] = []
  userTypesList: any[] = []
  user: any = {}
  userType: any = {}
  
  formUserType: FormGroup
  formUser: FormGroup
  title: any
  nameButton: any
  id: number

  showPassword: boolean = false;

  constructor(
    private _userService: UsersService,
    private _loginService : LoginService,
    private _userTypesService: UserTypesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userid = this._loginService.getUserid(); 
    this.getUserById(userid);

    this.listUsers()
    this.listUserTypes()
    this.initForm()

  }

  initForm() {
    this.formUser = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$')]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^9\\d{8}$')]),
      birthdate: new FormControl(null, [Validators.required, this.validateAdult]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      lastname: new FormControl(null, [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$')]),
      gender: new FormControl(null, [    Validators.required, Validators.pattern('^[MFO]$')]),
      creation_date: new FormControl(null, [Validators.required]),
      password_plain: new FormControl(null, [ Validators.required, Validators.pattern('^.{4,16}$')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^.{4,16}$')]),
      usertype_id: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(3)]),
      clientType: new FormControl('cliente')
    })

    this.formUserType = new FormGroup({
      usertype_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    })
  }

  validateAdult(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
  
    const birthdate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
  
    const isAdult =
      age > 18 || (age === 18 && today.getMonth() > birthdate.getMonth()) ||
      (age === 18 && today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());
  
    return isAdult ? null : { invalidAge: true };
  }

  getProfileImage(gender: string): string {
    switch (gender) {
      case 'M':  
        return 'assets/images/Masculino.jpg';
      case 'F': 
        return 'assets/images/Femenino.jpg';
      case 'O': 
        return 'assets/images/Otro.jpg';
      default:
        return 'assets/images/Default.jpg';  
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formUser.controls['password'].setValue(input.value);
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

  getUserById(id: any) {
    let form = this.formUser
    this._userService.getUserById(id)
      .subscribe((data) => {
          /*¿form.controls['name'].setValue(data.users.name);
          form.controls['lastname'].setValue(data.users.lastname);
          form.controls['phone'].setValue(data.users.phone);
          form.controls['gender'].setValue(data.users.gender);
          form.controls['birthdate'].setValue(data.users.birthdate);
          form.controls['email'].setValue(data.users.email);
          form.controls['password'].setValue(data.users.password);
          form.controls['creation_date'].setValue(data.users.creation_date);
          form.controls['usertype_id'].setValue(data.users.usertype_id);
          form.controls['password_plain'].setValue(data.users.usertype_id);
          console.log(data.users);*/

        const user = data.users;
        if (user) {
          this.user = user;
          
          this.formUser.patchValue({
            ...this.user,
            password: this.user.password_plain || '' // Mostrar `password_plain` en el campo
          });
        } else {
          console.error('No se encontró el usuario con ID: ' + id);
        }
      });
  }

  updateUser(id: number, form: any): void {
    if (this.formUser.valid) {
      this._userService.updateUser(id, form).subscribe(response => {
        this.closeModal()
        this.getUserById(id)
        this.resetForm()
        console.log('Los cambios han sido guardados exitosamente', response);
      }, error => {
        console.error('Error al guardar los cambios', error);
      });
    }
  }

  titleModal(id: number) {
    this.title = `Editar Usuario`
    if (id != null) {
      this.id = id
      this.getUserById(id)
    }
  }

  updateUserAlert() {
    if (this.formUser.valid) {
      Swal.fire({
        title: '¿Estás seguro de guardar tus datos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateUser(this.id, this.formUser.value)
          this.successAlert("Su usuario ha sido modificado correctamente.")
        }
      });
    }
    else {
      this.errorAlert(('Por favor, completa todos los campos requeridos antes de continuar.'))
    }
  }

  closeModal() {
    const modalElement = document.getElementById('modalUser');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  resetForm(): void {
    this.formUser.reset();
  }

  closeButton() {
    this.resetForm()
    this.closeModal()
  }

  successAlert(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Datos Guardados!",
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
