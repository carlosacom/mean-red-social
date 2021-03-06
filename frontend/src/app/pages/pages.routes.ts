import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegisterComponent },
      { path: 'inicio', component: HomeComponent },
      { path: '', pathMatch: 'full' , redirectTo: '/login' },
    ]
  }
];

export const APP_ROUTES = RouterModule.forChild(routes);
