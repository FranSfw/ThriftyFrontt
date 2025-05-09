import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CreateProductComponent } from './views/create-product/create-product.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { InventoryCategoriesComponent } from './views/inventory-categories/inventory-categories.component';
import { ReportsComponent } from './views/reports/reports.component';
import { OrdersComponent } from './views/orders/orders.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'create-product', component: CreateProductComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'inventory-categories', component: InventoryCategoriesComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'orders', component: OrdersComponent },
    { path: '**', redirectTo: 'login' },
];
