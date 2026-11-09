import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthInterceptor } from './components/helpers/auth.interceptor';
import { AuthGuard } from './components/helpers/auth.guard';
import { UsersComponent } from './components/views/users/users.component';
import { MainheaderComponent } from './components/structs/mainheader/mainheader.component';
import { MainfooterComponent } from './components/structs/mainfooter/mainfooter.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MybookingsComponent } from './components/views/mybookings/mybookings.component';
import { MyrestaurantsComponent } from './components/views/myrestaurants/myrestaurants.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    MainheaderComponent,
    MainfooterComponent,
    RegisterComponent,
    LoginComponent,
    MybookingsComponent,
    MyrestaurantsComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'profile', component: UsersComponent, canActivate: [AuthGuard], data: { background: 'https://images6.alphacoders.com/366/366291.jpg' }},
      {path: 'my-bookings', component: MybookingsComponent, canActivate: [AuthGuard], data: { background: 'https://builder.bootstrapmade.com/static/img/template/Delicious/hero-carousel/hero-carousel-3.jpg'}},
      {path: 'my-restaurants', component: MyrestaurantsComponent, canActivate: [AuthGuard], data: { background: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chanwalrus-941861.jpg&fm=jpg' }},
      {path: 'register', component: RegisterComponent, data: { background: 'https://builder.bootstrapmade.com/static/img/template/Delicious/hero-carousel/hero-carousel-1.jpg' }},
      {path: 'login', component: LoginComponent, data: { background: 'https://builder.bootstrapmade.com/static/img/template/Delicious/hero-carousel/hero-carousel-2.jpg' }},
      {path: '', component: LoginComponent, data: { background: 'https://builder.bootstrapmade.com/static/img/template/Delicious/hero-carousel/hero-carousel-2.jpg' }},
    ]),
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
