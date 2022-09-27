import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, mergeMap, Observable, Subject, switchMap } from 'rxjs';
import { AuthService } from '../auth-service.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Grupo, Objeto, Tienda } from '../types';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort = new MatSort();

  // userId!: string;
  productos: Observable<Objeto[]>;
  totalProductos = 0;
  displayedColumns: string[] = [
    'nombre',
    'grupo',
    'stockTotal',
    'stockVendido',
    'stockDisponible',
    'precio',
    'detalle',
  ];
  dataSource = new MatTableDataSource<Objeto>();
  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {


    this.productos = this.authService.userUidSubject.pipe(
      switchMap((userID) =>
        this.afs
          .collection<Objeto>('objeto', (ref) =>
            ref.where('usuario', '==', userID)
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  ngOnInit(): void {}

  openNewProductDialog(data?: Objeto) {
    if (data) {
      this.dialog.open(NuevoProductoComponent, {
        data,
      });
    } else {
      this.dialog.open(NuevoProductoComponent);
    }
  }

  deleteProduct(data: Objeto) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: `¿Seguro que quieres borrar el producto ${data.nombre} ?
        Esta acción no se puede deshacer`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.afs
            .doc<Objeto>(`objeto/${data.id}`)
            .delete()
            .then((x) => {
              this._snackBar.open(`Se ha borrado ${data.nombre}`, 'Cerrar');
            });
        }
      });
  }
  ngAfterViewInit() {
    const data = this.productos.pipe(
      map((data) => {
        return data.map((objeto) => {
          if (objeto.grupo) {
            const data = this.afs
              .doc(objeto.grupo as DocumentReference)
              .get()
              .pipe(
                map(
                  (grupo) =>
                    (objeto.grupo = {
                      id: grupo.id,
                      ...(grupo.data() as Grupo),
                    })
                )
              );
            data.subscribe();
          }
          return objeto;
        });
      })
    );

    data.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: any, property) => {
        switch (property) {
          case 'grupo': {
            if (item[property] !== undefined) {
              return item[property].nombre;
            } else return '';
          }
          default:
            return item[`${property}`];
        }
      };
    });
  }
}
