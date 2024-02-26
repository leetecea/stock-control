import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
    ) {}

  onSubmitLogin(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          if(response){
            this.cookieService.set('USER_INFO', response?.token) // setando um cookie
            this.loginForm.reset()
            this.router.navigate(['/dashboard'])


            this.messageService.add({
              severity: 'success',
              summary:'Sucesso',
              detail: `Bem vindo ${response?.name}!`,
              life: 2000,
          })
          }},
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary:'Erro',
              detail: `Erro ao fazer login.`,
              life: 2000,
          })
            console.log(err)}
      })
    }
  }

  onSubmitSignUp(): void {
    if (this.signupForm.value && this.signupForm.valid){
      this.userService.signUpUser(this.signupForm.value as SignUpUserRequest)
        .subscribe({
          next: (response) => {
            if(response){
              this.signupForm.reset()
              this.loginCard = true
              this.messageService.add({
                severity: 'success',
                summary:'Sucesso',
                detail: 'Usuário criado com sucesso!',
                life: 2000,
            })
          }},
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary:'Erro',
            detail: 'Erro ao criar novo usuário',
            life: 2000,
        })
          console.log(err)}
        })
    }
  }
}
