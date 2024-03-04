import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetGategoriesResponse';
import { CreateProducRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  public categories: Array<GetCategoriesResponse> = []
  public selectedCategory: Array<{ name: string, code: string}> = []
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  })

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllCategories()
  }


  getAllCategories(): void {
   this.categoriesService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe({
    next: response => {
      if(response.length > 0){
        this.categories = response
      }
    }
   })
  }

  handleSubmitAddProduct(): void{
    if(this.addProductForm?.valid && this.addProductForm?.value){
      const requestCreateProduct: CreateProducRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }

      this.productService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if(response){
            this.messageService.add({
              severity:'success',
              summary:'Successo',
              detail:'Produto criado com sucesso!',
              life: 2500
            });
          }
        },
        error: error => {
          console.error(error)
          this.messageService.add({
            severity:'error',
            summary:'Error',
            detail:'Erro ao criar produto.',
            life: 2500
          });
        }
      })
    }
    this.addProductForm.reset()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
