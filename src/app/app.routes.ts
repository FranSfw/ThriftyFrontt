import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CreateProductComponent } from './views/create-product/create-product.component';
import { InventoryComponent } from './views/inventory/inventory.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'create-product', component: CreateProductComponent },
    { path: 'inventory', component: InventoryComponent },
];
