import { AuthService } from './../services/auth.service';
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

    this.isLoading = true;
    if (this.inLoginMode) {

    } else {

      this.authService.signUp(email, password).subscribe(responseData => {
        console.log(responseData);
        this.isLoading = false;
      }, errorMessage => {
        this.errorMessage = errorMessage;

        this.isLoading = false;
      });
    }

    form.reset();
  }
}
