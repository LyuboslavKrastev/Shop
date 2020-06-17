import { Ingredient } from './../../common/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientsModified = new Subject<Ingredient[]>();
  triggeredEditting = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Cheese', 1),
    new Ingredient('Tomatoes', 5),
  ];

  getIngredient(index: number) {
    return this.ingredients[index];
  }

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

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsModified.next(this.getIngredients());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsModified.next(this.getIngredients());
  }
}
