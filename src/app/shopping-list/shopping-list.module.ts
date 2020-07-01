import { SharedModule } from './../common/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    ShoppingEditComponent,
    ShoppingListComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent }
    ])
  ]
})
export class ShoppingListModule {

}
