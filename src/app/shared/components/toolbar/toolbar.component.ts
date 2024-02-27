import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: []
})
export class ToolbarComponent {

  constructor(private cookie: CookieService, private router: Router) { }
  // para injetar alguns serviços/dependencias utilizasse o construtor
  // e especifica os serviços com o private nomeDoServico: TipoDoServico
  // nomeDoServico é o nome que você quiser, e TipoDoServico é o tipo do serviço que você quer injetar
  // nomeDoServico é uma instancia desse serviço que estara disponivel para ser utilizada dentro do componente
  // private indica que o serviço é privado e só pode ser acessado dentro do componente
  // pode utilizar o public também, que indica que o serviço é publico e pode ser acessado de fora do componente

    handleLogout(): void {
      this.cookie.delete('USER_INFO');
      void this.router.navigate(['/home']);
      // utilizasse void apenas para informar que a função não retorna nada
      // nesse caso a função apenas executara o redirecionamento para a rota /home
    }


}
