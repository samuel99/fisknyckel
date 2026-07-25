import SpeciesList from "@/components/SpeciesList";

export const metadata = {
  title: "Artlista – Fisknyckel",
};

export default function ArterPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Artlista</h1>
        <p className="text-slate-500 text-sm mt-1">
          Bläddra bland alla arter i databasen. Sök på svenskt eller latinskt
          namn.
        </p>
      </div>
      <SpeciesList />
    </div>
  );
}
