export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-10 w-48 animate-pulse rounded bg-line" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-line" />
    </div>
  );
}