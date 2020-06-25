import { DataStorageService } from './../services/data-storage.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent {
  constructor(private dataStorageService: DataStorageService) { }
  onSave() {
    this.dataStorageService.saveRecipes();
  }

  onFetch() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
