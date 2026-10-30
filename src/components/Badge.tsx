import { etiquetaStock } from "@/lib/format";

export default function Badge({ stock }: { stock: number }) {
  const agotado = stock <= 0;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${
        agotado ? "bg-rose text-[#23212b]" : "bg-peach text-[#23212b]"
      }`}
    >
      {etiquetaStock(stock)}
    </span>
  );
}