import { DocumentReference } from "@angular/fire/compat/firestore";

export type Objeto = {
  id?: string
  nombre: string;
  precio: number;
  stockTotal?: number;
  stockVendido?: number;
  grupo?: DocumentReference<Grupo> | Grupo;
  usuario: string;
};



export type Grupo = {
  id?: string;
  nombre: string;
  usuario: string
}
export type ObjetoVenta = {
  id: string,
  stockVendido?: number,
  grupo?: string,
  nombre: string;
  precio: number;
  numero: number;
};
export type Tienda = {
  nombre: string;
  password: string;
};
export interface TiendaId extends Tienda {
  id: string
}

export type Venta = {
  usuario: string;
  total: number;
  objetos: ObjetoVenta[];
  fecha: number;
};

