import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../common/ingredient.model';
import { Injectable } from '@angular/core';
import { Recipe } from './../recipes/recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromAuth from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesModified = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromAuth.AppState>) { }

  getRecipes() {
    return this.recipes.slice(); // return a copy of the array
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesModified.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesModified.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesModified.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesModified.next(this.recipes.slice());
  }
}
