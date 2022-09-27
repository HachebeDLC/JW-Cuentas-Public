import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, ObjectUnsubscribedError, Observable, switchMap, tap } from 'rxjs';
import { Venta } from '../types';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthService } from '../auth-service.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  @ViewChild(MatDatepicker)
  picker!: MatDatepicker<Date>;
  ventas: Observable<Venta[]>;
  totalVentas = 0;
  displayedColumns: string[] = ['numElementos', 'total', 'fecha', 'detalle'];
  isMobile = window.matchMedia('(pointer:coarse)').matches;
  date: Date | null | undefined;
  fecha = new BehaviorSubject<number>(0);

  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    const queryMedia = window.matchMedia('(pointer:coarse)');
    queryMedia.addEventListener(
      'change',
      (event) => (this.isMobile = event.matches)
    );

    this.ventas = combineLatest([
      this.fecha,
      this.authService.userUidSubject,
    ]).pipe(
      switchMap(([fecha, user]) => {
        let inicioDia = fecha;
        let finalDia = new Date(fecha).setHours(23, 59, 59, 999);
        if (inicioDia === 0) {
          finalDia = new Date().setHours(23, 59, 59, 999);
        }
        return this.afs
          .collection<Venta>('venta', (ref) =>
            ref
              .where('usuario', '==', user)
              .where('fecha', '>', inicioDia)
              .where('fecha', '<', finalDia)
              .orderBy('fecha', 'desc')
          )
          .valueChanges();
      })
    );
    this.ventas.subscribe((x) => {
      this.totalVentas = x.reduce((a, b) => a + b.total, 0);
    });
  }

  ngOnInit(): void {}
  openDialog(element: Venta) {
    this.dialog.open(DialogDetalleDialog, { data: element });
  }
  getNumObjetos(objetos: any[]) {
    return objetos.reduce((a, b) => a + b.numero, 0);
  }

  resetFecha() {
    this.date = null;
    this.fecha.next(0);
  }
  updateFecha(fecha: Date) {
    this.fecha.next(fecha.getTime());
  }
}
@Component({
  selector: 'dialog-detalle-venta-dialog',
  templateUrl: 'dialog-detalle.html',
})
export class DialogDetalleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Venta) {
    console.log(data)
  }
  getNombre(item: any){
    if(item.grupo){
      return `${item.grupo} - ${item.nombre}`
    }else {
      return item.nombre;
    }
  }
}
