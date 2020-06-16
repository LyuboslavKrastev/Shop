import { Ingredient } from './../../common/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientsModified = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Cheese', 1),
    new Ingredient('Tomatoes', 5),
  ];

  getIngredients() {
    return this.ingredients.slice(); // a copy of the array
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsModified.next(this.getIngredients());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsModified.next(this.getIngredients());
  }
}
