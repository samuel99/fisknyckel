export const metadata = {
  title: "Om – Fisknyckel",
};

export default function OmPage() {
  return (
    <div className="space-y-8 max-w-prose">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Om Fisknyckel</h1>
        <p className="text-slate-500 text-sm mt-1">
          Information om appen och dess syfte
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">
          Vad är Fisknyckel?
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Fisknyckel är ett digitalt hjälpmedel för svenska sportfiskare som
          vill identifiera sin fångst direkt vid vattnet. Genom att svara på
          enkla frågor om fiskens utseende och var den fångades leds du steg för
          steg fram till rätt art.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Appen fungerar helt utan internetanslutning efter första besöket och
          kan installeras på din telefon som en app via webbläsarens meny
          &ldquo;Lägg till på hemskärmen&rdquo;.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">Arter</h2>
        <p className="text-slate-600 leading-relaxed">
          Databasen innehåller för närvarande ett urval av vanliga svenska
          sportfiskearter längs västkusten, östkusten och i insjöar. Fler arter
          kommer att läggas till löpande.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700">Källkod</h2>
        <p className="text-slate-600 leading-relaxed">
          Källkoden är öppen och tillgänglig på GitHub:
        </p>
        <a
          href="https://github.com/username/fisknyckel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium underline underline-offset-2"
        >
          github.com/username/fisknyckel
        </a>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-700">Upphovsrätt</h2>
        <p className="text-slate-600">
          © {new Date().getFullYear()} Samuel Milton. Artbeskrivningar och
          identifieringsdata är baserade på öppna biologiska källor.
        </p>
      </section>
    </div>
  );
}
