import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { BreadcrumbService } from "../../core/services/breadcrumb.service";
import { MenuItem } from "primeng/api";

export function getMenuConfig(authService: AuthService, router: Router, breadcrumbService: BreadcrumbService): MenuItem[] {
    const userRole = authService.getUserRole();    

    // Common menu items for all user types
    let commonItems: MenuItem[] = [
        // {
        //     key: 'dashboard',
        //     label: 'Dashboard',
        //     icon: 'pi pi-objects-column',
        //     command: () => {
        //         router.navigate(['/main/dashboard']);
        //         breadcrumbService.generateBreadcrumbs('/main/dashboard');
        //     },
        // },
        // {
        //     key: 'tracking',
        //     label: 'Tracking',
        //     icon: 'pi pi-map',
        //     command: () => {
        //         router.navigate(['/main/tracking']);
        //         breadcrumbService.generateBreadcrumbs('/main/tracking');
        //     },
        // },
        {
            key: 'management',
            label: 'Management',
            icon: 'pi pi-server',
            items: [{
                label: userRole === 'Dealer' ? 'Permit Holder' : authService.getUserType(),
                icon: 'pi pi-users',
                items: [
                    {
                        label: userRole === 'Dealer' ? 'Permit Holder List' : `${authService.getUserType()} List`,
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate([`/main/management/dynamic-user-list`]);
                            breadcrumbService.generateBreadcrumbs('/main/management/dynamic-user-list');
                        }
                    },
                ]
            }
            ]
        },
        {
            key: 'reports',
            label: 'Reports',
            icon: 'pi pi-book',
            command: () => {
                router.navigate(['/main/reports/all']);
                breadcrumbService.generateBreadcrumbs('/main/reports/all');
            },
        },
    ];

    // User type specific menu items
    const userMenuItems: Record<string, MenuItem[]> = {
        Admin: [
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
                icon: 'pi pi-building-columns',
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
            },
            {
                label: 'Route',
                icon: 'pi pi-map-marker',
                items: [
                    {
                        label: 'Route List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/route']);
                            breadcrumbService.generateBreadcrumbs('/main/management/route');
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
            {
                label: 'E-Sim',
                icon: 'pi pi-car',
                items: [
                    {
                        label: 'E-SIM List',
                        icon: 'pi pi-list',
                        command: () => {
                            router.navigate(['/main/management/esim-list']);
                            breadcrumbService.generateBreadcrumbs('/main/management/esim-list');
                        }
                    }
                ]
            },
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
            //     label: 'Vehicle',
            //     icon: 'pi pi-car',
            //     items: [
            //         {
            //             label: 'Vehicle Category List',
            //             icon: 'pi pi-list',
            //             command: () => {
            //                 router.navigate(['/main/management/vehicle-category-list']);
            //                 breadcrumbService.generateBreadcrumbs('/main/management/vehicle-category-list');
            //             }
            //         }
            //     ]
            // },
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
                ]
            },
        ]
    };

    // Add user-specific menu items dynamically
    const managementMenu = commonItems.find((item: any) => item.key === 'management');
    if (managementMenu && managementMenu.items) {
        managementMenu.items.push(...userMenuItems[authService.getUserRole()]);
    }

    commonItems = (userRole === 'Dealer' || userRole === 'Distributor') ? commonItems?.filter((item: any) => item?.key !== 'dashboard' || item?.key !== 'tracking') : commonItems;

    
    return commonItems;
}
