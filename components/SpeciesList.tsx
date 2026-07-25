"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function SpeciesList() {
  const [query, setQuery] = useState("");

  const filtered = species.filter((s) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      s.swedish_name.toLowerCase().includes(q) ||
      s.latin_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="search"
          placeholder="Sök på svenskt eller latinskt namn…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          🔍
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-8">
          Inga arter hittades för &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          Visar {filtered.length} av {species.length} arter
        </p>
      )}

      <div className="grid gap-4">
        {filtered.map((s) => (
          <Link key={s.id} href={`/arter/${s.id}`} className="block">
            <Card className="border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-xl text-slate-800">
                    {s.swedish_name}
                  </CardTitle>
                  <p className="text-sm text-slate-500 italic">
                    {s.latin_name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {s.description}
              </p>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
