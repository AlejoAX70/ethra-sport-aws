export function StorefrontError({ message }: { message?: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-ethra-stone text-sm">{message ?? "No pudimos cargar los datos."}</p>
    </div>
  );
}
