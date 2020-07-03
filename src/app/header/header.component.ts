import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService, private store: Store<fromApp.AppState>) { }
  onSave() {
    this.dataStorageService.saveRecipes();
  }

  ngOnInit() {
    this.userSubscription = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !user ? false : true;
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onFetch() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
