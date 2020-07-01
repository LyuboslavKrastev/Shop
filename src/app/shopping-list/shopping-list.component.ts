import { LoggingService } from './../services/logging.service';
import { ShoppingListService } from './../services/shopping-list.service';
import { Ingredient } from '../common/ingredient.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // private shoppingSub: Subscription;

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
    this.shoppingListService.triggeredEditting.next(index);
  }

  ngOnDestroy(): void {
    // this.shoppingSub.unsubscribe();
  }
}
