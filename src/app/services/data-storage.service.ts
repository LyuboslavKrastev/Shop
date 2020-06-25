import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './recipe.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipesEndpoint } from '../secrets/db-endpoints-store.js';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(RecipesEndpoint, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(RecipesEndpoint)
      .pipe(
        map(recipesData => {
          return recipesData.map(recipe => {
            // set the ingredients to an empty array if they are undefined
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          });
        })
        , tap(recipesData => {
          this.recipeService.setRecipes(recipesData);
        })
      );
  }
}
