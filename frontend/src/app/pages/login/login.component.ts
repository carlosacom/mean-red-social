import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend/backend.service';
import { UserService } from '../../services/auth/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  public title: string;
  myForm: FormGroup;
  constructor(
    private _backend: BackendService,
    public userAuth: UserService
  ) {
    this.title = 'Identifícate';
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
    if (this.myForm.invalid) return ;
    this._backend.postLogin(this.myForm.value).subscribe(
      response => {
        this.userAuth.login(response);
      }, error => {
        console.log(error);
      }
    );
  }

}
