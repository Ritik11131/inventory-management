import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { BreadcrumbService } from "../../core/services/breadcrumb.service";
import { MenuItem } from "primeng/api";

export function getMenuConfig(authService: AuthService, router: Router, breadcrumbService: BreadcrumbService): MenuItem[] {
    const userType = authService.getUserType();
    console.log(userType);
    

    // Common menu items for all user types
    const commonItems: MenuItem[] = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: 'pi pi-objects-column',
            command: () => {
                router.navigate(['/main/dashboard']);
                breadcrumbService.generateBreadcrumbs('/main/dashboard');
            },
        },
        {
            key: 'management',
            label: 'Management',
            icon: 'pi pi-server',
            items: [{
                label: authService.getUserType(),
                icon: 'pi pi-users',
                items: [
                    {
                        label: `${authService.getUserType()} List`,
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate([`/main/management/dynamic-user-list`]);
                            breadcrumbService.generateBreadcrumbs('/main/management/dynamic-user-list');
                        }
                    },
                ]
            }
            ]
        }
    ];

    // User type specific menu items
    const userMenuItems: Record<string, MenuItem[]> = {
        Admin: [
            // {
            //     label: 'Device',
            //     icon: 'pi pi-truck',
            //     items: [
            //         {
            //             label: 'Device List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/device-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/device-list');
            //             }
            //         },
            //     ]
            // },
            {
                label: 'Device Model',
                icon: 'pi pi-truck',
                items: [
                    {
                        label: 'Device Model List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/device-model-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/device-model-list');
                        }
                    },
                ]
            },
            {
                label: 'Device',
                icon: 'pi pi-truck',
                items: [
                    {
                        label: 'Device List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/device-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/device-list');
                        }
                    },
                    {
                        label: `Assigned To ${authService.getUserType()}`,
                        icon: 'pi pi-users',
                        command: () => {
                            router.navigate([`/main/management/assigned/${authService.getUserType()}`]);
                            breadcrumbService.generateBreadcrumbs(`/main/management/assigned/${authService.getUserType()}`);
                        }

                    }
                ]
            },
            {
                label: 'Vehicle',
                icon: 'pi pi-car',
                items: [
                    {
                        label: 'Vehicle Category List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/vehicle-category-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/vehicle-category-list');
                        }
                    }
                ]
            },
            {
                label: 'Sim Providers',
                icon: 'pi pi-id-card',
                items: [
                    {
                        label: 'Sim Provider List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/sim-provider-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/sim-provider-list');
                        }
                    }
                ]
            },
            {
                label: 'States',
                icon: 'pi pi-map-marker',
                items: [
                    {
                        label: 'States List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/states-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/states-list');
                        }
                    }
                ]
            },
            {
                label: 'RTO',
                icon: 'pi pi-id-card',
                items: [
                    {
                        label: 'RTO List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/rto-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/rto-list');
                        }
                    }
                ]
            }
        ],
        OEM: [
            {
                label: 'Device',
                icon: 'pi pi-truck',
                items: [
                    {
                        label: 'Device List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/device-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/device-list');
                        }
                    },
                    // {
                    //     label: `Assigned To ${authService.getUserType()}`,
                    //     icon: 'pi pi-users',
                    //     command: () => {
                    //         router.navigate([`/main/management/assigned/${authService.getUserType()}`]);
                    //         breadcrumbService.generateBreadcrumbs(`/main/management/assigned/${authService.getUserType()}`);
                    //     }

                    // }
                ]
            },
            // {
            //     label: 'Inventory',
            //     icon: 'pi pi-car',
            //     items: [
            //         {
            //             label: 'Inventory List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/inventory-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/inventory-list');
            //             }
            //         }
            //     ]
            // },
            // {
            //     label: 'Vehicle',
            //     icon: 'pi pi-car',
            //     items: [
            //         {
            //             label: 'Vehicle List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/vehicle-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/vehicle-list');
            //             }
            //         }
            //     ]
            // }
        ],
        Distributor: [
            {
                label: 'Device',
                icon: 'pi pi-truck',
                items: [
                    {
                        label: 'Device List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/device-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/device-list');
                        }
                    },
                    // {
                    //     label: `Assigned To ${authService.getUserType()}`,
                    //     icon: 'pi pi-users',
                    //     command: () => {
                    //         router.navigate([`/main/management/assigned/${authService.getUserType()}`]);
                    //         breadcrumbService.generateBreadcrumbs(`/main/management/assigned/${authService.getUserType()}`);
                    //     }

                    // }
                ]
            },
            // {
            //     label: 'Inventory',
            //     icon: 'pi pi-car',
            //     items: [
            //         {
            //             label: 'Inventory List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/inventory-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/inventory-list');
            //             }
            //         }
            //     ]
            // },
            // {
            //     label: 'Vehicle',
            //     icon: 'pi pi-car',
            //     items: [
            //         {
            //             label: 'Vehicle List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/vehicle-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/vehicle-list');
            //             }
            //         }
            //     ]
            // }
        ],
        Dealer: [
            {
                label: 'Device',
                icon: 'pi pi-truck',
                items: [
                    {
                        label: 'Device List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/device-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/device-list');
                        }
                    },
                    {
                        label: 'Fitment',
                        icon: 'pi pi-users',
                        command: () => {
                            router.navigate([`/main/management/assigned/${authService.getUserType()}`]);
                            breadcrumbService.generateBreadcrumbs(`/main/management/assigned/${authService.getUserType()}`);
                        }

                    }
                ]
            },
            // {
            //     label: 'Vehicle',
            //     icon: 'pi pi-car',
            //     items: [
            //         {
            //             label: 'Vehicle List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/vehicle-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/vehicle-list');
            //             }
            //         }
            //     ]
            // },
            {
                label: 'Activation',
                icon: 'pi pi-car',
                items: [
                    {
                        label: 'Activation List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/vehicle-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/vehicle-list');
                        }
                    }
                ]
            }
        ]
    };

    // Add user-specific menu items dynamically
    const managementMenu = commonItems.find((item: any) => item.key === 'management');
    if (managementMenu && managementMenu.items) {
        managementMenu.items.push(...userMenuItems[authService.getUserRole()]);
    }

    return commonItems;
}
