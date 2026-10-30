export default function Loading() {
  return (
    <section className="flex flex-col gap-8">
      <div className="h-10 w-48 animate-pulse rounded bg-line" />
      <div className="h-10 w-full max-w-xl animate-pulse rounded-full bg-line" />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/4] animate-pulse rounded-lg bg-line" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-line" />
          </div>
        ))}
      </div>
    </section>
  );
}