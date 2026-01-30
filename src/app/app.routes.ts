import { Routes } from '@angular/router';
import { Register } from './components/User/register/register';
import { Login } from './components/User/login/login';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path: 'register', component: Register},
    {path:'login',component:Login},
    {path:'',component:Home}
];
