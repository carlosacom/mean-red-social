import { Component, Input } from '@angular/core';
import { MessageAlert } from '../../models/message-alert';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styles: []
})
export class MessageAlertComponent {

  @Input() message: MessageAlert = new MessageAlert(false, '', '');

  constructor() { }

}
