import { Component, Inject, OnInit } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/auth-service.service';
import { Grupo, Objeto } from 'src/app/types';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css'],
})
export class NuevoProductoComponent implements OnInit {
  newProduct = new FormGroup({
    nombre: new FormControl<string>('', Validators.required),
    precio: new FormControl<number>(0, Validators.required),
    stockTotal: new FormControl<number>(0),
    stockVendido: new FormControl<number>(0),
    grupo: new FormControl<string>(''),
  });
  accion: string = 'Añadir';
  grupos: Observable<Grupo[]>;
  nuevoProducto!: Objeto;
  userId: string = '';
  constructor(
    private _snackBar: MatSnackBar,
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<NuevoProductoComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Objeto
  ) {

    this.grupos = this.authService.userUidSubject.pipe(
      tap((UserID)=> this.userId = UserID),
      switchMap((userID) =>
        this.afs
          .collection<Grupo>('grupo', (ref) =>
            ref.where('usuario', '==', userID)
          )
          .valueChanges({ idField: 'id' })
      )
    );
    if (this.data) {
      this.newProduct.controls.nombre.patchValue(this.data.nombre);
      this.newProduct.controls.precio.patchValue(this.data.precio);
      if (this.data.stockTotal) {
        this.newProduct.controls.stockTotal.patchValue(this.data.stockTotal);
      }
      if (this.data.stockVendido) {
        this.newProduct.controls.stockVendido.patchValue(
          this.data.stockVendido
        );
      }
      this.newProduct.controls.grupo.patchValue(this.data.grupo?.id as string);
      this.accion = 'Editar';
    }
  }

  crearProducto() {
    let grupo = this.newProduct.controls.grupo.value;
    let stockVendido = this.newProduct.controls.stockVendido.value;
    let stockTotal = this.newProduct.controls.stockTotal.value;
    this.nuevoProducto = {
      nombre: this.newProduct.controls.nombre.value as string,
      precio: this.newProduct.controls.precio.value as number,
      usuario: this.userId,
    };
    if (grupo !== undefined && grupo!.length > 0) {
      this.nuevoProducto.grupo = this.afs.doc<Grupo>(
        `grupo/${this.newProduct.controls.grupo.value}`
      ).ref;
    }
    if (stockVendido !== null && stockVendido > 0) {
      this.nuevoProducto.stockVendido = stockVendido;
    }
    if (stockTotal !== null && stockTotal > 0) {
      this.nuevoProducto.stockTotal = stockTotal;
    }
    console.log(this.nuevoProducto)
    if (!this.data) {
      this.afs.collection<Objeto>('objeto').add(this.nuevoProducto);
      this._snackBar.open('Producto creado', 'Cerrar', { duration: 2000 });
    } else {
      this.afs.doc(`objeto/${this.data.id}`).set(this.nuevoProducto);

      this._snackBar.open('Producto actualizado', 'Cerrar', { duration: 2000 });
    }
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
