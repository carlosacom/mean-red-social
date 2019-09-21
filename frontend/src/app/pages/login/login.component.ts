import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend/backend.service';
import { UserService } from '../../services/auth/user.service';
import { MessageAlert } from '../../models/message-alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  title: string;
  myForm: FormGroup;
  loading: boolean;
  messageAlert: MessageAlert;

  constructor(
    private _backend: BackendService,
    public userAuth: UserService,
    private _router: Router
  ) {
    this.title = 'Identifícate';
    this.loading = false;
    this.messageAlert = new MessageAlert(false, '', '');
  }

  ngOnInit() {
    this.userAuth.validateSession();
    this.buildForm();
  }

  buildForm() {
    this.myForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
    });
  }

  onSubmit() {
    if (this.myForm.invalid) return;
    this.loading = true;
    this._backend.postLogin(this.myForm.value).subscribe(
      response => {
        this.userAuth.login(response);
        this.loading = false;
        this._router.navigate(['/inicio']);
      }, error => {
        console.log(error);
        this.messageAlert.color = 'alert-danger';
        this.messageAlert.text = error;
        this.messageAlert.success = true;
        this.loading = false;
      }
    );
  }

}
