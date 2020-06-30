import { RecipesModule } from './recipes/recipes.module';
import { PlaceholderDirective } from './../common/placeholder/placeholder.directive';
import { AlertComponent } from '../common/alert/alert.component';
import { AuthInterceptorService } from './services/auth.interceptor.service';
import { LoadingSpinnerComponent } from './../common/loading-spinner/loading-spinner.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipeService } from './services/recipe.service';
import { ShoppingListService } from './services/shopping-list.service';
import { DropdownDirective } from './../common/dropdown.directive';
import { HeaderComponent } from './header/header.component';

import { AppComponent } from './app.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';

import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    PlaceholderDirective,
    AuthComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RecipesModule
  ],
  providers: [ShoppingListService, RecipeService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [
    AlertComponent
  ]
})
export class AppModule { }
