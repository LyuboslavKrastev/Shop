import { Store } from '@ngrx/store';
import { PlaceholderDirective } from '../common/placeholder/placeholder.directive';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { NgForm } from '@angular/forms';
import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AlertComponent } from '../common/alert/alert.component';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  inLoginMode = true;
  isLoading = false;
  errorMessage: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHolder: PlaceholderDirective;
  private closeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {

      this.isLoading = authState.loading;
      this.errorMessage = authState.authError;

      if (this.errorMessage) {
        this.showErrorAlert(this.errorMessage);
      }
    });
  }

  onModeToggle() {
    this.inLoginMode = !this.inLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.inLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email, password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({ email, password })
      );
    }

    form.reset();
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }

  onHandleError() {
    this.errorMessage = null;
  }

  private showErrorAlert(errorMessage: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    const placeHolderRef = this.alertHolder.viewContainerRef;
    placeHolderRef.clear();

    const componentRef = placeHolderRef.createComponent(alertCmpFactory);

    componentRef.instance.message = errorMessage;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      placeHolderRef.clear();
    });
  }
}
