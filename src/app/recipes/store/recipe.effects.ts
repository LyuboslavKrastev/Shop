import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { RecipesEndpoint } from '../../secrets/db-endpoints-store.js';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) { }

  @Effect({ dispatch: false })
  storeRecipes = this.actions$
    .pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put(RecipesEndpoint, recipesState.recipes);
      }));

  @Effect()
  fetchRecipes = this.actions$
    .pipe(ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(RecipesEndpoint);
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => {
        return new RecipesActions.SetRecipes(recipes);
      })
    );
}
