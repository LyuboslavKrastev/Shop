import { LoggingService } from './../services/logging.service';
import { ShoppingListService } from './../services/shopping-list.service';
import { Ingredient } from '../common/ingredient.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private shoppingListService: ShoppingListService,
    private loggingService: LoggingService,
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');

    this.loggingService.printLog('Welcome to the shopping list');
  }

  onEditItem(index: number) {
    console.log('index:' + index)
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
