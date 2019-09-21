import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MessageAlertComponent } from './message-alert/message-alert.component';

@NgModule({
  declarations: [
    LoadingComponent,
    MessageAlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    MessageAlertComponent
  ]
})
export class ComponentsModule { }
