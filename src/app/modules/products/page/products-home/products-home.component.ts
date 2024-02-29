import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  public productsData: Array<GetAllProductsResponse> = [];

  constructor (
    private productsService: ProductsService,
    private productsDataService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmtionService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData() {
    const productsLoaded = this.productsDataService.getProductsData();

    if (productsLoaded.length > 0) {
      this.productsData = productsLoaded;
    } else this.getAPIProductsData()
  }

  getAPIProductsData() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ // callback de sucesso
        next: (response) => {
          if (response.length > 0) {
            this.productsData = response;
          }
        },
        error: (err) => { // callback de erro
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void{
    if(event) {

    }
  }

  handleDeleteProductAction(event: { product_ID: string, productName: string }): void {
    if(event) {
      this.confirmtionService.confirm({
        message: `Confima a exclusão do produto? ${event?.productName}?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => { this.deleteProduct(event.product_ID) }
    })

    }
  }

  deleteProduct(product_ID: string) {
    if(product_ID){
      alert(product_ID)
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
