import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ESimActivationLinkedDeviceColumns, ESimColumns, eSimDeviceColumns } from '../../../../../shared/constants/columns';
import { EsimService } from '../../../../../core/services/esim.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SimProvidersService } from '../../../../../core/services/sim-providers.service';
import { DeviceService } from '../../../../../core/services/device.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { GenericOverlayComponent } from '../../../../../shared/components/generic-overlay/generic-overlay.component';
import { srOverlayFields } from '../../../../../shared/constants/constant';
import { ExportService } from '../../../../../core/services/export.service';

@Component({
  selector: 'app-esim-activation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolbarModule, ButtonModule, TableModule, ProgressSpinnerModule, TooltipModule, DialogModule,
     DropdownModule, OverlayPanelModule, InputGroupModule, InputTextModule, TagModule, TimelineModule, GenericOverlayComponent],
  templateUrl: './esim-activation-list.component.html',
  styleUrl: './esim-activation-list.component.scss'
})
export class EsimActivationListComponent {

  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('providerStatusOp') providerStatusOp!: OverlayPanel;
  @ViewChild('dt') dt!: Table;
  @ViewChild('dt1') dt1!: Table;
  overlayContent: string = '';
  dialogHeader: string = '';


  columns: any[] = ESimColumns;
  deviceColumns: any[] = eSimDeviceColumns;
  activationLinkedDeviceColumns = ESimActivationLinkedDeviceColumns
  srOverlayFields:any[] = srOverlayFields;
  currentSelectedRow!: any;
  eSimtableData: any[] = [];
  devices: any[] = [];
  isLoading: boolean = false;
  isDevicesLoading: boolean = false;
  isDialogVisible: boolean = false;
  fetchingActivateTypeOptions: boolean = false;
  fetchingActivatePlansOptions: boolean = false;
  fetchingOverlayDataMap: { [key: string]: boolean } = {}; // Track loading per row
  dialogContentType: string = 'activateFields';
  selectedSimProvider!: any;
  selectedType!: any;
  selectedPlan!: any
  simProvidersOptions: any[] = [];
  activateTypeOptions: any[] = [];
  availablePlanOptions: any[] = [];
  userRole: string = '';
  comment: string = '';
  timelineData:any[] = [];
  srOverlayData:any = {};
  selectedLinkedDevicesData:any = [];



  constructor(private esimService: EsimService, private toastService: ToastService,
    private simProviderService: SimProvidersService, private deviceService: DeviceService,
    private authService: AuthService, private exportService:ExportService
  ) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit(): void {
    this.fetchActivationList();
  }


  async fetchActivationTypeDevices(): Promise<any> {
    this.isDevicesLoading = true;
    this.devices = [];
    try {
      const response =  await (this.selectedType?.sno === 1 ?
        this.esimService.getDeviceListForCommercialActivation() :
        this.selectedType?.sno === 2 ?
          this.esimService.getDeviceListForTopUpActivation() :
          null)
      this.devices = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.devices = [];
      this.toastService.showError('Error', `Failed to fetch Device List!`);
    } finally {
      this.isDevicesLoading = false;
    }
  }

  async fetchActivationList(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.esimService.getActivationList();
      this.eSimtableData = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchSimProviders(): Promise<any> {
    try {
      const response = await this.simProviderService.getList();
      this.simProvidersOptions = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.simProvidersOptions = [];
      this.toastService.showError('Error', `Failed to fetch State List!`);
    }
  }


  async fetchActivationTypes(id: number): Promise<any> {
    this.fetchingActivateTypeOptions = true;
    try {
      const response = await this.esimService.getActivationTypes(id);
      this.activateTypeOptions = response.data;
      this.fetchingActivateTypeOptions = false;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.fetchingActivateTypeOptions = false;
      this.activateTypeOptions = [];
      this.toastService.showError('Error', `Failed to fetch Types!`);
    }
  }


  async fetchActivationAvailablePlans(id: number): Promise<any> {
    this.fetchingActivatePlansOptions = true;
    try {
      const response = await this.esimService.getActivationAvailablePlans(id);
      this.availablePlanOptions = response.data;
      this.fetchingActivatePlansOptions = false;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.fetchingActivatePlansOptions = false;
      this.availablePlanOptions = [];
      this.toastService.showError('Error', `Failed to fetch Types!`);
    }
  }


  onCurrentRowSelectionChange(e: any) {
    console.log(e);
  }

  handleActivateClick = async () => {
    this.isDialogVisible = true;
    this.dialogContentType = 'activateFields';
    this.dialogHeader = 'Create Activation Request';
    await this.fetchSimProviders();
  }

  async handleSimProviderChange(e: any): Promise<any> {
    console.log(this.selectedSimProvider);
    await this.fetchActivationTypes(this.selectedSimProvider?.id)
  }

  async handleActivationTypeChange(e: any): Promise<any> {
    await this.fetchActivationAvailablePlans(this.selectedType?.sno);
    await this.fetchActivationTypeDevices();
  }

  hideDialog() {
    this.isDialogVisible = false;
    this.dialogContentType = 'activateFields';
    this.resetForm();
  }

  async save(): Promise<void> {

    const payload = {
      deviceIds: this.currentSelectedRow?.map((row: any) => row?.sno),
      serviceProviderId: this.selectedSimProvider?.id,
      typeSno: this.selectedType?.sno,
      planSo: this.selectedPlan?.sno
    }

    try {
      const response = await this.esimService.createActivationRequest(payload);
      this.toastService.showSuccess('Success', 'Request Created Successfully!');
      this.hideDialog();
      await this.fetchActivationList();

    } catch (error) {
      this.toastService.showError('Error', 'Failed to create Request!');
    }

  }


  resetForm() {
    this.selectedSimProvider = null;
    this.selectedType = null;
    this.selectedPlan = null;
    this.devices = [];
    this.currentSelectedRow = [];
    this.dialogHeader = '';
  }



  showOverlay(event: Event, type: string) {
    this.overlayContent = type;
    this.op.toggle(event);
  }

  async showProviderStatusOverlay(event: Event, type: any, row:any): Promise<void> {
    this.fetchingOverlayDataMap[row.request.requestId] = true;
    try {
      const response = await this.esimService.getRequestStatusByIdFromProvider(row.request.requestId);
      this.srOverlayData = response.data;
      this.fetchingOverlayDataMap[row.request.requestId]= false;
      this.overlayContent = type;
      this.providerStatusOp.toggle(event);
    } catch (error:any) {
      this.srOverlayData = {};
      this.fetchingOverlayDataMap[row.request.requestId] = false;
      this.toastService.showError('Error', error?.error?.data);
    }
  }

  async submitComment(action: string, row: any): Promise<void> {
    try {
      const response = action === 'send_request_to_operator' ? await this.esimService.processRequestToOperator({
        requestId: row.request.requestId,
        status: 'InProcess',
        comment: this.comment,
      }) : 
        await this.esimService.addCommentOnActivationRequest({
        requestId: row.request.requestId,
        status: action === 'approve' ? 'Approved' : 'Reject',
        comment: this.comment,
      });
      this.toastService.showSuccess('Success', 'Comment Submitted Successfully!');
    } catch (error) {
      this.toastService.showError('Error', 'Failed to submit');
    }
    this.comment = '';
    this.op.hide(); // Close the overlay after submission
    await this.fetchActivationList();

  }

  onDeviceListSearch(event: Event) {
    const input = event.target as HTMLInputElement;    
    if (input) {
      this.dt1.filterGlobal(input.value, 'contains');
    }
  }

  async showHeirarchyPopup(row: any) {
    this.dialogContentType = 'seeHeirarchy';
    this.isDialogVisible = true;
    this.dialogHeader = 'Activation Heirarchy';
    this.timelineData = [];
    try {
      const response = await this.esimService.getActivationRquestDetailsById(row.request.requestId);
      console.log(response);
      let {comment, commenthistory} = response?.data;
      commenthistory = JSON.parse(commenthistory);
      this.timelineData = [
        ...this.timelineData,
        {
            header: 'Comment History',
            events: commenthistory
                .map((item: any) => ({
                    date: new Date(item.commentDate), // Convert to Date object
                    comment: item.comment,
                    commentedBy: item.commentBy
                })).sort((a:any, b:any) => b.date.getTime() - a.date.getTime()) // Sort in DESC order
        }
    ];      
      
    } catch (error) {
      this.toastService.showError('Error', 'Failed to fetch');
    }
  }

  async showLinkedDevicesPopup(type:any, row: any) {
    this.dialogContentType = type;
    this.isDialogVisible = true;
    this.dialogHeader = 'Linked Devices';


    try {
      const response = await this.esimService.getActivationRquestDetailsById(row.request.requestId);
      let { requestjson } = response?.data;
      if (requestjson) {
        requestjson = JSON.parse(requestjson).map((item: any) => ({
          ...item,
          Type: row.type.name,
          Plan: row.plan.name,
          ServiceProvider: row.serviceProvider.providername,
          RequestedBy: row.user.orgname,
        }));
      }
      
      this.selectedLinkedDevicesData = requestjson;
    } catch (error) {
      this.toastService.showError('Error', 'Failed to fetch');
    }
  }

  exportLinkedDevices() {
    this.exportService.exportToExcel(this.selectedLinkedDevicesData, 'Linked Devices');
  }


}
