import { Component, Input, OnInit, output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { tableActionsConfigRoleWise } from '../../constants/table-config';
import { AuthService } from '../../../core/services/auth.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { tableActions } from '../../interfaces/table';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, RippleModule, ButtonModule, InputTextModule, InputTextareaModule, CommonModule, 
    FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, 
    InputNumberModule,ToolbarModule,ProgressSpinnerModule,TooltipModule,ConfirmDialogModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent implements OnInit {

  @ViewChild('dt') dt: Table | any;

  userRole: string = '';
  currentSection: string | any = '';
  tableActionsConfigRoleWise : any = tableActionsConfigRoleWise;
  availableActions: tableActions[] = [];

  @Input() columns: any[] = []; // Dynamic columns
  @Input() data: any[] = []; // Data for the table
  @Input() rows: number = 10; // Rows per page
  @Input() globalFilterFields: string[] = []; // Fields for global filtering
  @Input() selection: any[] = []; // Selected rows
  @Input() header:string = ''
  @Input() isDataLoading: boolean = false;
  @Input() exportFilename: string = 'csv';
  @Input() toolbarRightActions: any[] = [];
  @Input() actions:any[] = ['edit']
  @Input() selectionMode: 'single' | 'multiple' = 'multiple';

  selectionChange = output<any>();
  edit = output<any>();
  delete = output<any>();
  new = output<any>();
  dropdown = output<any>();
  linkRTO = output<any>();
  transferInventory = output<any>();
  bulkUpload = output<any>();
  sampleBulkUpload = output<any>();


  constructor(private authService:AuthService,private breadcrumbService:BreadcrumbService) {
    this.userRole = this.authService.getUserRole();
    this.currentSection = this.breadcrumbService.getBreadCrumbsJson()[this.breadcrumbService.getBreadCrumbsJson().length - 1]?.label?.replace(/\s+/g, '');;
    console.log(this.currentSection,'section');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadActions();    
  }



  loadActions() {
    // Retrieve actions based on role and section
    if (tableActionsConfigRoleWise[this.userRole] && tableActionsConfigRoleWise[this.userRole][this.currentSection]) {
      this.availableActions = tableActionsConfigRoleWise[this.userRole][this.currentSection];
    }

    console.log(this.availableActions,'actions');
    
  }


  invokeAction(action: any) {
    const actionMap: { [key: string]: () => void } = {
      'onNewUser': () => this.onNewUser(),
      'onPrint': () => this.onPrint(),
      'onLinkRTO': () => this.onLinkRTO(),
      'onUpload': () => this.onUpload(),
      'onExportSample': () => this.onExportSample(),
      'onTransferInventory': () => this.onTransferInventory(),
    };
  
    const actionMethod = actionMap[action];
    
    if (actionMethod) {
      actionMethod(); // Invoke the corresponding method
    } else {
      console.warn(`No action found for: ${action}`);
    }
  }



  onSelectionChange(event: any[]) {
    this.selectionChange.emit(event);
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(event : Event, item: any) {
    this.delete.emit({event,item});
  }

  onNewUser() {
    this.new.emit(true);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;    
    if (input) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  onPrint() {
    this.dt.exportCSV();
  }


  onDropdownChange(event:any) {
    this.dropdown.emit(event.value)
  }

  onLinkRTO() {
    this.linkRTO.emit(true)
  }

  onUpload() {
    this.bulkUpload.emit(true)
  }

  onExportSample() {
    this.sampleBulkUpload.emit(true);
  }

  onTransferInventory() {
    this.transferInventory.emit(true)
  }
}
