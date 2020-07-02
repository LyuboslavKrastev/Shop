import { Ingredient } from './../../common/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Cheese', 1), new Ingredient('Tomatoes', 5)],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.Actions) {
  // state changes with NgRx must always be immutable
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        // copy the properties of the old state into the new object
        // (currently only one property in the state, so the line below can be omitted)
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload // overwrites everything
      };

      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      console.log(`Deleting ingredient ${state.editedIngredientIndex}`);
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, index) => {
          return index !== state.editedIngredientIndex;
        }), // filter always returns a new array
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] } // copy into a new object
      };
    case ShoppingListActions.STOP_EDIT:
      console.log('calling stop edit');
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}

