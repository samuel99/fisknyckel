import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import speciesData from "@/data/species.json";

type Species = {
  id: string;
  swedish_name: string;
  latin_name: string;
  description: string;
  identifying_features: string[];
  image: string | null;
};

const species: Species[] = speciesData as Species[];

export function generateStaticParams() {
  return species.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = species.find((s) => s.id === id);
  if (!s) return {};
  return { title: `${s.swedish_name} – Fisknyckel` };
}

export default async function ArtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = species.find((s) => s.id === id);
  if (!s) notFound();

  return (
    <div className="space-y-6 max-w-prose">
      <Link
        href="/arter"
        className="text-sm text-sky-700 hover:text-sky-900 flex items-center gap-1"
      >
        ← Tillbaka till artlistan
      </Link>

      <div className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden">
        <div className="bg-sky-700 px-6 py-5">
          <h1 className="text-white text-3xl font-bold">{s.swedish_name}</h1>
          <p className="text-sky-200 italic text-lg mt-1">{s.latin_name}</p>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-slate-700 leading-relaxed">{s.description}</p>

          <div>
            <h2 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Kännetecken
            </h2>
            <ul className="space-y-1.5">
              {s.identifying_features.map((f) => (
                <li
                  key={f}
                  className="text-sm text-slate-700 flex items-start gap-2"
                >
                  <span className="text-sky-500 mt-0.5">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Identifiera en ny fisk
        </Link>
        <Link
          href="/arter"
          className="flex-1 inline-flex items-center justify-center rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 transition-colors"
        >
          Artlistan
        </Link>
      </div>
    </div>
  );
}
