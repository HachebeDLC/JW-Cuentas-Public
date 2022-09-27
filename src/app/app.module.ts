import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { CalcComponent } from './calc/calc.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {
  DialogDetalleDialog,
  VentasComponent,
} from './ventas/ventas.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductosComponent } from './productos/productos.component';
import { TiendaComponent } from './tienda/tienda.component';
import { NavComponent } from './nav/nav.component';
import { MatSelectModule } from '@angular/material/select';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSortModule } from '@angular/material/sort';
import { NuevoProductoComponent } from './productos/nuevo-producto/nuevo-producto.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { GrupoComponent } from './grupo/grupo.component';
import { NuevoGrupoComponent } from './grupo/nuevo-grupo/nuevo-grupo.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [
    AppComponent,
    CalcComponent,
    VentasComponent,
    DialogDetalleDialog,
    ProductosComponent,
    TiendaComponent,
    NavComponent,
    NuevoProductoComponent,
    ConfirmationDialogComponent,
    GrupoComponent,
    NuevoGrupoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatSortModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule,
    MatDatepickerModule,
MatNativeDateModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAuth(() => getAuth()),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: PERSISTENCE, useValue: 'local'},
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
