export const tableActionsConfigRoleWise : any = {
    Admin: {
      OEMList: [
        { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
      ],
      DeviceModelList: [
        { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
      ],
      DeviceList: [
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
      ],
      SimProviderList: [
        { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
      ],
      StateList: [
        { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
      ],
      RTOList: [
        { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
      ]
    },
    OEM: {
        DistributorList: [
          { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
          { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' }
        ],
        DeviceList: [
            { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
            { label: 'Bulk Upload', icon: 'pi pi-cloud-upload', action: 'onUpload' },
            { label: 'Sample Bulk Upload', icon: 'pi pi-file-o', action: 'onExportSample' },
            { label: 'Transfer Inventory', icon: 'pi pi-external-link', action: 'onTransferInventory' },
            { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' },
        ]
      },
    Distributor: {
        DealerList: [
            { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
            { label: 'Link RTO', icon: 'pi pi-link', action: 'onLinkRTO' },
            { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' },
        ],
        DeviceList: [
            { label: 'Transfer Inventory', icon: 'pi pi-external-link', action: 'onTransferInventory' },
            { label: 'Export to CSV', icon: 'pi pi-print', action: 'onPrint' },
        ],
    },
    Dealer: {
      DeviceList: [
        { label: 'Add', icon: 'pi pi-plus', action: 'onNewUser' },
        { label: 'Export to CSV', icon: 'pi pi-print', action: 'onExportDevice' }
      ],
      FitmentList: [
        { label: 'Validate Fitment', icon: 'pi pi-check', action: 'onFitmentValidation' }
      ]
    }
  };
  