export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function etiquetaStock(stock: number): string {
  if (stock <= 0) return "Agotado";
  if (stock <= 5) return "Ultimas unidades";
  return "Disponible";
}