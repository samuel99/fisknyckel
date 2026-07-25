import FishKey from "@/components/FishKey";

export const metadata = {
  title: "Identifiera fisk – Fisknyckel",
};

export default function Home() {
  return (
    <div className="space-y-4">
      <FishKey />
    </div>
  );
}
