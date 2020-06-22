import { RecipeService } from './recipe.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDbAddress } from '../secrets/get-db-address.js';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) { }
  private recipesAddress = GetDbAddress() + 'recipes.json';

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.recipesAddress, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }
}
