import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  public productsData: Array<GetAllProductsResponse> = [];
  private ref?: DynamicDialogRef;

  constructor (
    private productsService: ProductsService,
    private productsDataService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmtionService: ConfirmationService,
    private dialogService: DialogService
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
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {"overflow": "auto"},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productsData: this.productsData
        }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIProductsData()
      })
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
      this.productsService.deleteProduct(product_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.messageService.add({
            severity: 'success',
            summary:'Sucesso',
            detail: 'Produto removido com sucesso',
            life: 2500
          }),
          this.getAPIProductsData() // Para atualizar tela após remover o produto, chama novamente o metodo para fazer uma nova requisição
        },
        error: err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao remover produto',
            life: 2500
          })
        }

      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
