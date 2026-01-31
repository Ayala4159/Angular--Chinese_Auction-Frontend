import { Routes } from '@angular/router';
import { Register } from './components/User/register/register';
import { Login } from './components/User/login/login';
import { Home } from './components/home/home';
import { CategoriesForm } from './components/Categories/categories-form/categories-form';
import { GetAllCategories } from './components/Categories/get-all-categories/get-all-categories';
export const routes: Routes = [
    {path: 'register', component: Register},
    {path:'login',component:Login},
    {path:'',component:Home},
    {path:'categories-form', component: CategoriesForm},
    {path:'categories', component: GetAllCategories}

];
