import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink'; //libreria para la estrategia de precarga de modulos
import { authGuard } from './core/guards/auth.guard';


const routes: Routes = [

  { path: "home", canActivateChild:[authGuard], loadChildren:() => import("./modules/home/home.module").then((m) => m.HomeModule)},

  { path: "dashboard-admin", loadChildren: () => import('./modules/dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminModule )},

  { path: "municipios", loadChildren:() => import("./modules/municipios/municipios.module").then((m) => m.MunicipiosModule)},

  { path: "auth", loadChildren:() => import("./modules/auth/auth.module").then((m) => m.AuthModule)},

  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:QuicklinkStrategy})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

