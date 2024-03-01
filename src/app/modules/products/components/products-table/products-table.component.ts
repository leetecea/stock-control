import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProductsResponse> = []
  @Output() productEvent = new EventEmitter<EventAction>()
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>()

  public productSelected?: GetAllProductsResponse
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT


  handleProductEvent(action: string, id?:string): void{
    if(action && action !== ''){
      const productsEventData = id && id !=='' ? { action, id } : { action }
      // se recebemos id fo diferente de undefined e difeten de vazio, então passamos um objeto contendo a action e o id, senão passamos apenas um objeto contendo a action

      this.productEvent.emit(productsEventData)
      // EMITIR O VALOR DO EVENTO PARA O COMPONENTE PAI
    }
  }

  handleDeleteProduct(product_ID: string, productName: string): void {
    if(product_ID !== '' && productName !== ''){
      this.deleteProductEvent.emit({ product_ID, productName })
    }
  }

}
