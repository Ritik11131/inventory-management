import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-certificates',
  standalone: true,
  imports: [PanelModule, CardModule, ButtonModule, DividerModule, InputTextModule, CommonModule, FormsModule,DropdownModule,FileUploadModule],
  templateUrl: './upload-certificates.component.html',
  styleUrl: './upload-certificates.component.scss'
})
export class UploadCertificatesComponent {
  isLoading:boolean = false
  certificate : any = {};
  documentTypes : any[] = [
    {label:'Certificate',value:'certificate'},
    {label:'Cop Certificate',value:'copCertificate'}
  ]
  constructor() { }



  onDocumentTypeChange(event:any) {
    console.log(event);
    
  }

  onSelect(event: any) {
    console.log(event);
    
  }

  uploadCertificate() {

  }

}
