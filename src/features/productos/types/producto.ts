import type { CategoriaRead } from "@/features/categorias/types/categoria";

export interface ProductoRead {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria: CategoriaRead | null;
}

export interface ProductosPaginados {
  total: number;
  items: ProductoRead[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagen_url?: string | null;
  stock: number;
  disponible: boolean;
  categoria_id: number;
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string | null;
  precio_base?: number;
  imagen_url?: string | null;
  stock?: number;
  disponible?: boolean;
  categoria_id?: number;
}

export interface ProductoStockUpdate {
  stock: number;
  disponible: boolean;
}

export interface ProductosQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}