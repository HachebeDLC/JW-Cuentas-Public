import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth-service.service';
import { Grupo, Objeto, Tienda } from 'src/app/types';

@Component({
  selector: 'app-nuevo-grupo',
  templateUrl: './nuevo-grupo.component.html',
  styleUrls: ['./nuevo-grupo.component.css'],
})
export class NuevoGrupoComponent implements OnInit {
  newGrupo = new FormGroup({
    nombre: new FormControl<string>('', Validators.required),
    precio: new FormControl<number>(0, Validators.required),
  });
  nuevoGrupo!: Objeto;
  userId: string = '';
  constructor(
    private _snackBar: MatSnackBar,
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<NuevoGrupoComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Objeto
  ) {
    if (this.data) {
      this.newGrupo.controls.nombre.patchValue(this.data.nombre);
      this.newGrupo.controls.precio.patchValue(this.data.precio);
    }
    this.authService.userUidSubject.subscribe((userID) => (this.userId = userID));

  }

  crearGrupo() {
    this.nuevoGrupo = {
      nombre: this.newGrupo.controls.nombre.value as string,
      precio: this.newGrupo.controls.precio.value as number,
      usuario: this.userId,
    };
    if (!this.data) {
      this.afs.collection<Grupo>('grupo').add(this.nuevoGrupo);
      this._snackBar.open('Grupo creado', 'Cerrar', { duration: 2000 });
    } else {
      this.afs.doc(`objeto/${this.data.id}`).update(this.nuevoGrupo);
      this._snackBar.open('Grupo actualizado', 'Cerrar', { duration: 2000 });
    }
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
