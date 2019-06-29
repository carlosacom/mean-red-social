import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modulos
import { SharedModule } from '../shared/shared.module';

// rutas
import { APP_ROUTES } from './pages.routes';

// pipes

// componentes
import { PagesComponent } from './pages.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    PagesComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
