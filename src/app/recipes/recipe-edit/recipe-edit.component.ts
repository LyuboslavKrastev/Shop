import { RecipeService } from './../../services/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.editMode = params.id != null;
          this.initForm();
        }
      );
  }

  private initForm = () => {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      console.log('initializing edit');
      const recipe = this.recipeService.getRecipe(this.id);

      if (recipe) {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;

        if (recipe.ingredients) {
          for (const ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ingredient.name, Validators.required),
                amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]\d*$/)])
              })
            );
          }
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }
  onSubmit() {
    console.log('submitting');
    // const newRecipe = new Recipe(this.recipeForm.value.name, this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath, this.recipeForm.value.ingredients);
    if (this.editMode === true) {
      console.log('updating');
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      console.log('adding');
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onAddIngredient() {
    const formGrp = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]\d*$/)])
    });
    (this.recipeForm.get('ingredients') as FormArray).push(formGrp);
  }

  get controls() { // a getter!
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}
