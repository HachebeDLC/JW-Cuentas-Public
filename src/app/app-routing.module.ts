import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { CalcComponent } from './calc/calc.component';
import { GrupoComponent } from './grupo/grupo.component';
import { NavComponent } from './nav/nav.component';
import { ProductosComponent } from './productos/productos.component';
import { TiendaComponent } from './tienda/tienda.component';
import { VentasComponent } from './ventas/ventas.component';

const redirectLoggedInToApps = () => redirectLoggedInTo(['/']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Route[] = [
  {
    path: '',
    component: NavComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
    },
    children: [
      {
        path: 'calculadora',
        component: CalcComponent,
        canActivate: [AngularFireAuthGuard],
        data: { label: 'Calculadora' },
      },
      {
        path: 'ventas',
        component: VentasComponent,
        canActivate: [AngularFireAuthGuard],
        data: { label: 'Ventas' },
      },
      {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [AngularFireAuthGuard],
        data: { label: 'Productos' },
      },
      {
        path: 'grupos',
        component: GrupoComponent,
        canActivate: [AngularFireAuthGuard],
        data: { label: 'Grupos' },
      },
    ],
  },
  {
    path: 'login',
    component: TiendaComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToApps,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes as Routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
