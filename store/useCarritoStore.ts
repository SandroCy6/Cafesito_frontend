import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Producto, ItemCarrito } from "@/data/mockData";

// ---------------------------------------------------------------------------
// Tipos del store
// ---------------------------------------------------------------------------

interface CarritoState {
  /** Lista de productos en el carrito con cantidad y subtotal */
  items: ItemCarrito[];

  // ── Acciones ──────────────────────────────────────────────────────────────

  /**
   * Agrega un producto al carrito.
   * - Si ya existe, incrementa la cantidad (respetando el stock).
   * - Si es nuevo, lo inserta con cantidad 1.
   */
  agregarProducto: (producto: Producto, cantidad?: number) => void;

  /**
   * Elimina completamente un producto del carrito por su id.
   */
  eliminarProducto: (id: string) => void;

  /**
   * Cambia la cantidad de un item existente.
   * - Si la nueva cantidad es 0 o menor, elimina el item.
   * - Respeta el stock máximo disponible.
   */
  actualizarCantidad: (id: string, cantidad: number) => void;

  /**
   * Vacía el carrito por completo.
   */
  vaciarCarrito: () => void;

  // ── Selectores (derivados) ────────────────────────────────────────────────

  /**
   * Calcula el total del carrito sumando los subtotales de cada item.
   * Retorna el valor redondeado a 2 decimales.
   */
  calcularTotal: () => number;

  /**
   * Cantidad total de unidades en el carrito (suma de todas las cantidades).
   * Útil para mostrar el badge del ícono del carrito.
   */
  cantidadTotal: () => number;

  /**
   * Verifica si un producto específico ya está en el carrito.
   */
  estaEnCarrito: (id: string) => boolean;
}

// ---------------------------------------------------------------------------
// Helper: recalcula el subtotal de un item
// ---------------------------------------------------------------------------
const calcularSubtotal = (precio: number, cantidad: number): number =>
  parseFloat((precio * cantidad).toFixed(2));

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set, get) => ({
      items: [],

      // ── agregarProducto ───────────────────────────────────────────────────
      agregarProducto: (producto, cantidad = 1) => {
        set((state) => {
          const existente = state.items.find((i) => i.id === producto.id);

          if (existente) {
            // El producto ya existe: incrementar cantidad sin exceder el stock
            const nuevaCantidad = Math.min(
              existente.cantidad + cantidad,
              producto.stock,
            );
            return {
              items: state.items.map((i) =>
                i.id === producto.id
                  ? {
                      ...i,
                      cantidad: nuevaCantidad,
                      subtotal: calcularSubtotal(i.precio, nuevaCantidad),
                    }
                  : i,
              ),
            };
          }

          // Producto nuevo: insertar al carrito
          const cantidadValida = Math.min(cantidad, producto.stock);
          const nuevoItem: ItemCarrito = {
            ...producto,
            cantidad: cantidadValida,
            subtotal: calcularSubtotal(producto.precio, cantidadValida),
          };

          return { items: [...state.items, nuevoItem] };
        });
      },

      // ── eliminarProducto ──────────────────────────────────────────────────
      eliminarProducto: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      // ── actualizarCantidad ────────────────────────────────────────────────
      actualizarCantidad: (id, cantidad) => {
        if (cantidad <= 0) {
          get().eliminarProducto(id);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== id) return i;
            const cantidadValida = Math.min(cantidad, i.stock);
            return {
              ...i,
              cantidad: cantidadValida,
              subtotal: calcularSubtotal(i.precio, cantidadValida),
            };
          }),
        }));
      },

      // ── vaciarCarrito ─────────────────────────────────────────────────────
      vaciarCarrito: () => set({ items: [] }),

      // ── calcularTotal ─────────────────────────────────────────────────────
      calcularTotal: () => {
        const total = get().items.reduce((acc, i) => acc + i.subtotal, 0);
        return parseFloat(total.toFixed(2));
      },

      // ── cantidadTotal ─────────────────────────────────────────────────────
      cantidadTotal: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      // ── estaEnCarrito ─────────────────────────────────────────────────────
      estaEnCarrito: (id) => get().items.some((i) => i.id === id),
    }),

    // ── Configuración de persist ──────────────────────────────────────────
    // En useCarritoStore.ts — reemplaza la config de persist:
    {
      name: "cafeteria-carrito",
      storage: createJSONStorage(() => {
        // Guard: evita crash en SSR cuando localStorage no existe
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
