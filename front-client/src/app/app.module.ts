import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthInterceptor } from './components/helpers/auth.interceptor';
import { AuthGuard } from './components/helpers/auth.guard';
import { AffiliationComponent } from './components/views/affiliation/affiliation.component';
import { UsersComponent } from './components/views/users/users.component';
import { BookingsComponent } from './components/views/bookings/bookings.component';
import { RestaurantsComponent } from './components/views/restaurants/restaurants.component';
import { MainheaderComponent } from './components/structs/mainheader/mainheader.component';
import { MainfooterComponent } from './components/structs/mainfooter/mainfooter.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AffiliationComponent,
    UsersComponent,
    BookingsComponent,
    RestaurantsComponent,
    MainheaderComponent,
    MainfooterComponent,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'affiliate', component: AffiliationComponent, canActivate: [AuthGuard], data: { background: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/22/52/ea/bar-el-resspiro.jpg?w=900&h=500&s=1' }},
      {path: 'profile', component: UsersComponent, canActivate: [AuthGuard], data: { background: 'https://images6.alphacoders.com/366/366291.jpg' }},
      {path: 'my-bookings', component: BookingsComponent, canActivate: [AuthGuard], data: { background: 'https://builder.bootstrapmade.com/static/img/template/Delicious/hero-carousel/hero-carousel-3.jpg'}},
      {path: 'home', component: RestaurantsComponent, canActivate: [AuthGuard], data: { background: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chanwalrus-941861.jpg&fm=jpg' }},
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
