import { Subscription } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }
  onSave() {
    this.dataStorageService.saveRecipes();
  }

  ngOnInit() {
    this.userSubscription = this.authService.userSubject.subscribe(user => {
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
    this.authService.logout();
  }
}
