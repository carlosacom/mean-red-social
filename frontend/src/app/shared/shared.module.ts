import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    PageNoFoundComponent,
    LoadingComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    PageNoFoundComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
