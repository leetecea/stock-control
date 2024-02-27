import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/user/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

  public productsDataEmitter$ = // convenção: quando uma propriedade retorna um Observable, adicionasse um $ no final do nome
    new BehaviorSubject<Array<GetAllProductsResponse> | null> (null)

    // diferença entre Subject e o BehaviorSubject
    // BehaviorSubject precisa iniciar com um valor e envia o ultimo valor emitido para novos observadores
    // Subject começa sem nenhum valor inicial e emite apenas valores após inscrição dos observadores

  public productsData: Array<GetAllProductsResponse> = []

  getProductsData() {
    this.productsDataEmitter$
    .pipe(
      take(1),
      // o operador TAKE chama apenas uma vez, evitando o MemoryLeak, pois após chamar a quantidade de vezes passadas, ele se desinscreve
      // especifica o numero max de valores que deseja receber de um observable
      map(data => data?.filter( (product) => product.amount > 0))
    )
    .subscribe({
      next: response => { // next emite um novo valor para os subscribers registrados em um observable
        if (response) { // se o response nao for undefined
          this.productsData = response
        }}
    })
    return this.getProductsData
  }

  setProductsData(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.productsDataEmitter$.next(products)
      this.getProductsData()
    }
  }

}
