import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sidebar', component: SidebarComponent },
];
