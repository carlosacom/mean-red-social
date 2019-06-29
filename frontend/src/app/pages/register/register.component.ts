import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend/backend.service';
import { UserService } from '../../services/auth/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  public title: string;
  myForm: FormGroup;
  constructor(
    private _backend: BackendService,
    private _userAuth: UserService
  ) {
    this.title = 'Regístrate';
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.myForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z ]+/)
      ]),
      surname: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z ]+/)
      ]),
      nick: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z]+/)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ])
    });
  }

  onSubmit() {
    if (this.myForm.invalid || !(this.myForm.value.password === this.myForm.value.password_confirmation)) return ;
    this._backend.postRegister(this.myForm.value).subscribe(
      response => {
        this._userAuth.login(response);
      }, error => {
        console.error(error);
      }
    );
  }

}
