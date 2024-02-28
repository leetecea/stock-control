import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  public productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDataService: ProductsDataTransferService
  ) { }


  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response =>{
          if(response.length > 0){
            this.productsList = response
            this.productsDataService.setProductsData(this.productsList)
          }
        },
        error: err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produto!',
            life: 2500,
          })
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next() // emite um valor através do subject destroy$ - é o sinal de que o componente está sendo destruído
    this.destroy$.complete() // completa o subject destroy$ -para que todos os observables sejam notificados que nao haverá mais valores a serem emitidos. Também libera qualquer memória associada ao Subject
}

}
