import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { LoaderService } from './core/services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ButtonModule,ToastModule,CommonModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[]
})
export class AppComponent {
  title = 'inventory-management';
  isLoading = false;

   constructor(private loaderService: LoaderService) {
    this.loaderService.loading$.subscribe(status => {
      this.isLoading = status;
    });
  }
}
