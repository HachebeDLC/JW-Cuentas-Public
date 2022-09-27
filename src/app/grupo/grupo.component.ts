import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { deleteField } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, switchMap, firstValueFrom } from 'rxjs';
import { AuthService } from '../auth-service.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Grupo, Objeto, Tienda } from '../types';
import { NuevoGrupoComponent } from './nuevo-grupo/nuevo-grupo.component';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css'],
})
export class GrupoComponent implements OnInit {
  @ViewChild(MatSort) sort = new MatSort();

  grupos: Observable<Grupo[]>;
  totalGrupos = 0;
  displayedColumns: string[] = ['nombre', 'detalle'];
  dataSource = new MatTableDataSource<Grupo>();
  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.grupos = this.authService.userUidSubject.pipe(
      switchMap((userID) =>
        this.afs
          .collection<Grupo>('grupo', (ref) =>
            ref.where('usuario', '==', userID)
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  ngOnInit(): void {}

  openNewGrupoDialog(data?: Objeto) {
    if (data) {
      this.dialog.open(NuevoGrupoComponent, {
        data,
      });
    } else {
      this.dialog.open(NuevoGrupoComponent);
    }
  }

  deleteGrupo(data: Objeto) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: `¿Seguro que quieres borrar el grupo ${data.nombre} ?
        Esta acción no se puede deshacer`,
      })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          const refGrupo = this.afs.doc<Grupo>(`grupo/${data.id}`).ref;
          const listaProductos = await firstValueFrom(
            this.afs
              .collection<Objeto>('objeto', (ref) =>
                ref.where('grupo', '==', refGrupo)
              )
              .valueChanges({ idField: 'id' })
          );

          for (const producto of listaProductos) {
            this.afs.doc(`objeto/${producto.id}`).update({
              grupo: deleteField(),
            });
          }

          this.afs
            .doc<Grupo>(`grupo/${data.id}`)
            .delete()
            .then((x) => {
              this._snackBar.open(`Se ha borrado ${data.nombre}`, 'Cerrar');
            });
        }
      });
  }
  ngAfterViewInit() {
    this.grupos.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }
}
