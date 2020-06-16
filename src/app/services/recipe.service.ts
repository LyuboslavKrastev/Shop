import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from './../../common/ingredient.model';
import { Injectable } from '@angular/core';
import { Recipe } from './../recipes/recipe.model';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'First Recipe',
      'First Description',
      'https://live.staticflickr.com/1441/25154602981_ab2f17e9f8_b.jpg',
      [new Ingredient('Cheese', 5), new Ingredient('Tomato', 6), new Ingredient('Potato', 11)]
    ),
    new Recipe(
      'Second Recipe',
      'Second Description',
      'https://toriavey.com/images/2010/07/Shakshuka-IMAGES-6-1.jpg',
      [new Ingredient('Eggs', 3), new Ingredient('Tomato', 4)]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice(); // return a copy of the array
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
