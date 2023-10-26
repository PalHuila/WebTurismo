import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink'; //libreria para la estrategia de precarga de modulos
import { authGuard } from './core/guards/auth.guard';
import { homeGuard } from './core/guards/home.guard';


const routes: Routes = [

  { path: "home", canActivate:[authGuard], loadChildren:() => import("./modules/home/home.module").then((m) => m.HomeModule)},

  { path: "dashboard-admin", canActivate:[authGuard],  loadChildren: () => import('./modules/dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminModule )},

  { path: "municipios", canActivate:[authGuard], loadChildren:() => import("./modules/municipios/municipios.module").then((m) => m.MunicipiosModule)},

  { path: "auth", canActivate:[homeGuard],  loadChildren:() => import("./modules/auth/auth.module").then((m) => m.AuthModule)},

  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:QuicklinkStrategy})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

