import { Component, ViewChild } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { tap, Observable, map, switchMap } from 'rxjs';
import { Grupo, Objeto, ObjetoVenta, Tienda, Venta } from '../types';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth-service.service';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css'],
})
export class CalcComponent {
  @ViewChild(MatAccordion) matAccordion = new MatAccordion();
  items: Observable<Objeto[]>;
  objetos: Objeto[] = [];
  vueltas: number = 0;
  venta = new FormGroup({});
  ventaFinal!: Venta;
  userID: string = '';
  grupos: string[] = [];
  constructor(
    private afs: AngularFirestore,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    const sortAlf = this.authService.userUidSubject.pipe(
      tap((userID) => (this.userID = userID)),
      switchMap((userID) =>
        this.afs
          .collection<Objeto>('objeto', (ref) =>
            ref.where('usuario', '==', userID)
          )
          .valueChanges({ idField: 'id' })
          .pipe(
            tap((items) => {
              return items.sort((a, b) => a.nombre.localeCompare(b.nombre));
            })
          )
      )
    );
    this.ventaFinal = {
      total: 0,
      usuario: this.userID,
      objetos: [],
      fecha: 0,
    };

    this.items = sortAlf.pipe(
      map((data) => {
        return data.map((objeto) => {
          if (objeto.grupo) {
            const data = this.afs
              .doc(objeto.grupo as DocumentReference)
              .get()
              .pipe(
                map((grupo) => {
                  if (!this.grupos.includes((grupo.data() as Grupo).nombre))
                    this.grupos.push((grupo.data() as Grupo).nombre);
                  return (objeto.grupo = {
                    id: grupo.id,
                    ...(grupo.data() as Grupo),
                  });
                })
              );
            data.subscribe();
          }
          return objeto;
        });
      }),
      map((data) => {
        return data.sort(this.ordenarPorGrupo());
      })
    );

    this.items.subscribe((data) => {
      this.objetos = data;
      data.forEach((x) => {
        this.venta.addControl(
          x.id as string,
          new FormControl(0, { nonNullable: true })
        );
      });
    });
  }

  getGrupoNombre(item: Objeto): string {
    return (item.grupo as Grupo).nombre;
  }

  checkGrupo(item: Objeto, grupo?: string): boolean {
    if (grupo && item.grupo !== undefined) {
      return grupo === this.getGrupoNombre(item) ? true : false;
    }
    return item.grupo !== undefined ? true : false;
  }

  onSubmit(): void {
    const itemsVenta: ObjetoVenta[] = [];

    Object.keys(this.venta.controls).forEach((key) => {
      var objeto = this.objetos.filter((x) => x.id == key)[0];
      if (this.venta.get(key)?.value > 0) {
        let itemVenta: ObjetoVenta = {
          id: objeto.id as string,

          nombre: objeto.nombre,
          precio: objeto.precio,
          numero: this.venta.get(key)?.value,
        };
        if (objeto.grupo !== undefined) {
          itemVenta['grupo'] = (objeto.grupo as Grupo).nombre;
        }
        if (objeto.stockVendido !== undefined) {
          itemVenta['stockVendido'] = objeto.stockVendido as number;
        }
        itemsVenta.push(itemVenta);
      }
    });
    const total = itemsVenta.reduce((a, b) => a + b.precio * b.numero, 0);
    console.log(itemsVenta);
    this.ventaFinal = {
      usuario: this.userID,
      total,
      objetos: itemsVenta,
      fecha: Date.now(),
    };
  }

  enviarDatos() {
    console.log(this.ventaFinal);
    this.matAccordion.closeAll();
    this.ventaFinal.objetos.forEach((element) => {
      if (element.stockVendido) {
        this.afs.doc<Objeto>(`objeto/${element.id}`).update({
          stockVendido: element.stockVendido + element.numero,
        });
      } else {
        this.afs.doc<Objeto>(`objeto/${element.id}`).update({
          stockVendido: element.numero,
        });
      }
    });
    this.afs
      .collection<Venta>('venta')
      .add(this.ventaFinal as Venta)
      .then(() => {
        this._snackBar.open('Venta completada', 'Cerrar');
        this.venta.reset();
        this.onSubmit();
      });
  }

  changeValue(item: Objeto, value: number) {
    const valor = this.venta.get(item.id as string)?.value;
    if (valor != 0 || value > 0) {
      this.venta.patchValue({ [item.id as string]: valor + value });
    }
  }
  getId(item: Objeto): string {
    return item.id as string;
  }
  ordenarPorGrupo() {
    return function (a: Objeto, b: Objeto) {
      if (a.grupo === undefined) {
        return 1;
      }
      if (b.grupo === undefined) {
        return -1;
      }
      if ((a.grupo as Grupo).nombre && (b.grupo as Grupo).nombre) {
        return (a.grupo as Grupo).nombre.localeCompare(
          (b.grupo as Grupo).nombre
        );
      }
      return 0;
    };
  }
}
