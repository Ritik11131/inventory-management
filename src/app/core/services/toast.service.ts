import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }



  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail, sticky:true });
  }

  showInfo(summary: string, detail: string) {
    this.messageService.add({ severity: 'info', summary, detail, sticky:true });
  }

  showWarn(summary: string, detail: string, life?: number) {
    this.messageService.add({ severity: 'warn', summary, detail, life, sticky:true });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({ severity: 'error', summary, detail, sticky:true });
  }

  showContrast(summary: string, detail: string) {
    this.messageService.add({ severity: 'contrast', summary, detail, sticky:true });
  }

  showSecondary(summary: string, detail: string) {
    this.messageService.add({ severity: 'secondary', summary, detail, sticky:true });
  }
}
