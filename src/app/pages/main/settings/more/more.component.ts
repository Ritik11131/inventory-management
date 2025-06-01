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
import { DynamicUserService } from '../../../../core/services/dynamic-user.service';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [PanelModule, CardModule, ButtonModule, DividerModule, InputTextModule, CommonModule, FormsModule,DropdownModule,FileUploadModule],
  templateUrl: './more.component.html',
  styleUrl: './more.component.scss'
})
export class MoreComponent {
  isLoading: boolean = false;
  oemList: any[] = [];
  selectedOem: any;

  constructor(private dynamicuserService:DynamicUserService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initMethods();
    
  }

  async initMethods() {
    try {
      const response =  await this.dynamicuserService.getList();
      console.log(response);
      this.oemList = response.data;
    } catch (error) {
      console.error('Error during initialization:', error);
      // Handle error appropriately, e.g., show a toast notification
      this.oemList = [];
      
    }
    
  }



    onSelect(event: any) {
    console.log(event);
    
  }

  uploadCertificate() {

  }

  onOemChange(event: any) {
    console.log(event);
    
  }

}
