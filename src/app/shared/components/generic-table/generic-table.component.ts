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
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DeviceService } from '../../../core/services/device.service';
import { ToastService } from '../../../core/services/toast.service';
import { PdfService } from '../../../core/services/pdf.service';
import { GenericOverlayComponent } from '../generic-overlay/generic-overlay.component';
import { simOverlayFields, userOverlayFields, vehicleOverlayFields } from '../../constants/constant';
import { FitmentService } from '../../../core/services/fitment.service';
import { parseFitemtCertificateData } from '../../utils/common';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, RippleModule, ButtonModule, InputTextModule, InputTextareaModule, CommonModule, 
    FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, GenericOverlayComponent,
    InputNumberModule,ToolbarModule,ProgressSpinnerModule,TooltipModule,ConfirmDialogModule,MenuModule,OverlayPanelModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent implements OnInit {

  @ViewChild('dt') dt: Table | any;

  userRole: string = '';
  currentSection: string | any = '';
  tableActionsConfigRoleWise : any = tableActionsConfigRoleWise;
  availableHeaderActions: tableActions[] = [];
  menuItems: any[] = [];
  vehicleOverlayFields = vehicleOverlayFields;
  userOverlayFields = userOverlayFields;
  simOverlayFields = simOverlayFields;

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
  @Input() selectionMode: 'single' | 'multiple' | 'none' = 'multiple';

  selectionChange = output<any>();
  edit = output<any>();
  delete = output<any>();
  new = output<any>();
  dropdown = output<any>();
  linkRTO = output<any>();
  transferInventory = output<any>();
  bulkUpload = output<any>();
  sampleBulkUpload = output<any>();
  activate = output<any>();
  fitment = output<any>();
  emitOverlayAction = output<any>();
  actionMenuItems!: any[];
  availableActionsList!: any;
  selectedColumn!: any;
  selectedOverlayObject!:any


  constructor(private authService:AuthService,private breadcrumbService:BreadcrumbService,private fitmentService:FitmentService,
              private deviceService:DeviceService,private toastService:ToastService,private pdfService:PdfService) {
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
    if (tableActionsConfigRoleWise[this.userRole] && tableActionsConfigRoleWise[this.userRole][this.currentSection]) {
      this.availableHeaderActions = tableActionsConfigRoleWise[this.userRole][this.currentSection];
      
      // Map actions to menuItems for p-menu
      this.menuItems = this.availableHeaderActions.map((action:any) => ({
        label: action.label,
        icon: action.icon,
        command: () => this.invokeAction(action.action)
      }));
    } else {
      // Handle case if no actions are found for role and section
      this.menuItems = [
        { label: 'No actions available', icon: 'pi pi-info-circle' }
      ];
    }
  }


  loadActionMenuItems(selectedItem: any) {
    this.actionMenuItems = [];
    this.actions.forEach((actionType:any) => {
        if (actionType === 'edit') {
            this.actionMenuItems.push({
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.onEdit(selectedItem)
            });
        } else if (actionType === 'delete') {
            this.actionMenuItems.push({
                label: 'Delete',
                icon: 'pi pi-trash',
                command: (event:any) => this.onDelete(event, selectedItem)
            });
        } else if (actionType === 'activate' && selectedItem.activationStatusText !== 'Active') {
            this.actionMenuItems.push({
                label: 'Activate',
                icon: 'pi pi-eject',
                command: (event:any) => this.onActivate(event, selectedItem)
            });
        } else if (actionType === 'fitment' && selectedItem.activationStatus && selectedItem.inStock) {
            this.actionMenuItems.push({
                label: 'Fitment',
                icon: 'pi pi-id-card',
                command: (event:any) => this.onFitment(event, selectedItem)
            });
        }
    });

    if(this.actionMenuItems.length === 0) {
        this.actionMenuItems.push({
            label: 'No actions available',
            icon: 'pi pi-info-circle',
            command: () => {}
        });
    }
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

  onActivate(event : Event, item: any) {
    this.activate.emit({event , item})
  }

  onFitment(event : Event,item:any) {
    this.fitment.emit({event , item})
  }

  async showOverlay(col:any,item: any, event: MouseEvent,op: any) :Promise<any> {
    this.selectedOverlayObject = null;
    this.selectedColumn = null;
    if (col.field === 'iccid') {
      this.selectedColumn = col.field;
      this.selectedOverlayObject = item;      
      op.toggle(event);
    } else if (col.field === 'vehicle' && col.subfield === 'vehicleNo') {
      this.selectedColumn = col.subfield;
      if(item?.vehicle) {
        try {
          const response = await this.deviceService.getVehicleDetailsBySno(item?.vehicle?.id);
          this.selectedOverlayObject = response?.data;
          op.toggle(event);
        } catch (error: any) {
            op.toggle(event);
        }
      } else if(!item.vehicle && item.activationStatus && item.inStock) {
        op.toggle(event);
      } 
    } else if(col.header === 'Permit Holder' && col.field === 'user' && col.subfield === 'name' && item?.user?.userType === 'User' ) {
      this.selectedColumn = col.subfield;
      try {
        const response = await this.fitmentService.getPermitHolderDetails(item?.user);
        this.selectedOverlayObject = response?.data;
        op.toggle(event);

      } catch (error) {
        console.log(error, 'error');
        op.toggle(event);
      }
    }

    console.log(this.selectedOverlayObject);
    
  }


  async downloadCertifcate(obj:any) : Promise<any> {
    try {
      const response = await this.fitmentService.getFitmentCertificateData(obj);
      const certificateData : any = parseFitemtCertificateData(response?.data?.attribute);
      console.log(certificateData);
      this.pdfService.generateFitmentCertificate(certificateData);
    } catch (error:any) {
      console.log(error);
      this.toastService.showError('Error',error.error.data);
      
    }
    
  
  }

  handleSelectedOverlayAction(event:any,item:any,overlayObj:any) {
    this.emitOverlayAction.emit({event,item,overlayObj})

  }
 


}
