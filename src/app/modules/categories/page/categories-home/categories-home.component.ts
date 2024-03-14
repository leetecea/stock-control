import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetGategoriesResponse';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public categoriesData: Array<GetCategoriesResponse> = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
      this.geAllCategories();
  }


  geAllCategories() {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.categoriesData = response;
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar categorias!',
          life: 3000,
        });
        this.router.navigate(['/dashboard']);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
