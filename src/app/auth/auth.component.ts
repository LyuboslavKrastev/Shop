import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './../services/auth.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  inLoginMode = true;
  isLoading = false;
  errorMessage: string = null;

  constructor(private authService: AuthService) { }

  onModeToggle() {
    this.inLoginMode = !this.inLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.inLoginMode) {
      authObservable = this.authService.logIn(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
    }, errorMessage => {
      this.errorMessage = errorMessage;

      this.isLoading = false;
    });

    form.reset();
  }
}
