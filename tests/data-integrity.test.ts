import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// --- Ladda datafiler ---
const root = resolve(__dirname, "../data");

const species: any[] = JSON.parse(readFileSync(`${root}/species.json`, "utf-8"));
const questions: any[] = JSON.parse(readFileSync(`${root}/questions.json`, "utf-8"));
const treeRaw: { root: string; nodes: Record<string, any> } = JSON.parse(
  readFileSync(`${root}/tree.json`, "utf-8")
);

const speciesIds = new Set(species.map((s) => s.id));
const questionIds = new Set(questions.map((q) => q.id));
const nodeIds = new Set(Object.keys(treeRaw.nodes));

// --- Hjälp: BFS för att hitta alla nåbara noder ---
function reachableNodes(): Set<string> {
  const visited = new Set<string>();
  const queue = [treeRaw.root];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const node = treeRaw.nodes[id];
    if (node?.branches) {
      for (const next of Object.values(node.branches) as string[]) {
        queue.push(next);
      }
    }
  }
  return visited;
}

// ============================================================
// species.json
// ============================================================
describe("species.json", () => {
  it("ska innehålla minst en art", () => {
    expect(species.length).toBeGreaterThan(0);
  });

  it("varje art ska ha ett unikt id", () => {
    const ids = species.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  const required = ["id", "swedish_name", "latin_name", "description", "identifying_features"];
  for (const field of required) {
    it(`varje art ska ha fältet '${field}'`, () => {
      for (const s of species) {
        expect(s, `Art '${s.id}' saknar '${field}'`).toHaveProperty(field);
        expect(s[field], `Art '${s.id}'.${field} är tomt`).toBeTruthy();
      }
    });
  }

  it("identifying_features ska vara en array med minst ett element", () => {
    for (const s of species) {
      expect(
        Array.isArray(s.identifying_features),
        `${s.id}.identifying_features är inte en array`
      ).toBe(true);
      expect(
        s.identifying_features.length,
        `${s.id} har inga identifying_features`
      ).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// questions.json
// ============================================================
describe("questions.json", () => {
  it("ska innehålla minst en fråga", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("varje fråga ska ha ett unikt id", () => {
    const ids = questions.map((q) => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  const required = ["id", "text", "helpText"];
  for (const field of required) {
    it(`varje fråga ska ha fältet '${field}'`, () => {
      for (const q of questions) {
        expect(q, `Fråga '${q.id}' saknar '${field}'`).toHaveProperty(field);
        expect(q[field], `Fråga '${q.id}'.${field} är tomt`).toBeTruthy();
      }
    });
  }
});

// ============================================================
// tree.json – struktur
// ============================================================
describe("tree.json – grundstruktur", () => {
  it("ska ha ett root-fält", () => {
    expect(treeRaw.root).toBeTruthy();
  });

  it("root-noden ska finnas i nodes", () => {
    expect(nodeIds.has(treeRaw.root)).toBe(true);
  });

  it("varje nod ska vara antingen en frågenod (question_id + branches) eller ett löv (species_id)", () => {
    for (const [id, node] of Object.entries(treeRaw.nodes)) {
      const isQuestion = "question_id" in node && "branches" in node;
      const isLeaf = "species_id" in node;
      expect(
        isQuestion || isLeaf,
        `Nod '${id}' är varken frågenod eller löv`
      ).toBe(true);
      expect(
        !(isQuestion && isLeaf),
        `Nod '${id}' är både frågenod och löv`
      ).toBe(true);
    }
  });
});

// ============================================================
// tree.json – referensintegritet
// ============================================================
describe("tree.json – referensintegritet", () => {
  it("alla question_id i trädet ska referera till en befintlig fråga", () => {
    for (const [id, node] of Object.entries(treeRaw.nodes)) {
      if ("question_id" in node) {
        expect(
          questionIds.has(node.question_id),
          `Nod '${id}' refererar till okänd question_id '${node.question_id}'`
        ).toBe(true);
      }
    }
  });

  it("alla branches-värden ska peka på en befintlig nod", () => {
    for (const [id, node] of Object.entries(treeRaw.nodes)) {
      if ("branches" in node) {
        for (const [answer, nextId] of Object.entries(node.branches) as [string, string][]) {
          expect(
            nodeIds.has(nextId),
            `Nod '${id}', svar '${answer}' pekar på okänd nod '${nextId}'`
          ).toBe(true);
        }
      }
    }
  });

  it("alla species_id i löv-noder ska referera till en befintlig art (eller vara null)", () => {
    for (const [id, node] of Object.entries(treeRaw.nodes)) {
      if ("species_id" in node && node.species_id !== null) {
        expect(
          speciesIds.has(node.species_id),
          `Löv-nod '${id}' refererar till okänd species_id '${node.species_id}'`
        ).toBe(true);
      }
    }
  });
});

// ============================================================
// tree.json – nåbarhet
// ============================================================
describe("tree.json – nåbarhet", () => {
  const reached = reachableNodes();

  it("alla noder ska vara nåbara från roten", () => {
    for (const id of nodeIds) {
      expect(reached.has(id), `Nod '${id}' är inte nåbar från roten`).toBe(true);
    }
  });

  it("alla arter ska ha minst ett löv i trädet", () => {
    const speciesInTree = new Set<string>();
    for (const node of Object.values(treeRaw.nodes)) {
      if ("species_id" in node && node.species_id !== null) {
        speciesInTree.add(node.species_id);
      }
    }
    for (const s of species) {
      expect(
        speciesInTree.has(s.id),
        `Art '${s.id}' (${s.swedish_name}) har inget löv i trädet`
      ).toBe(true);
    }
  });

  it("alla frågor ska användas i minst en nod i trädet", () => {
    const usedQuestions = new Set<string>();
    for (const node of Object.values(treeRaw.nodes)) {
      if ("question_id" in node) usedQuestions.add(node.question_id);
    }
    for (const q of questions) {
      expect(
        usedQuestions.has(q.id),
        `Fråga '${q.id}' används inte i trädet`
      ).toBe(true);
    }
  });
});

// ============================================================
// tree.json – inga cykler / dead ends
// ============================================================
describe("tree.json – cykler och dead ends", () => {
  it("trädet ska inte innehålla cykler", () => {
    function hasCycle(nodeId: string, visiting: Set<string>): boolean {
      if (visiting.has(nodeId)) return true;
      const node = treeRaw.nodes[nodeId];
      if (!node || !("branches" in node)) return false;
      visiting.add(nodeId);
      for (const next of Object.values(node.branches) as string[]) {
        if (hasCycle(next, new Set(visiting))) return true;
      }
      return false;
    }
    expect(hasCycle(treeRaw.root, new Set()), `Trädet innehåller en cykel`).toBe(false);
  });

  it("alla grenar från en frågenod ska leda till ett löv", () => {
    function leadsToLeaf(nodeId: string, visited = new Set<string>()): boolean {
      if (visited.has(nodeId)) return false; // cykel-skydd
      visited.add(nodeId);
      const node = treeRaw.nodes[nodeId];
      if (!node) return false;
      if ("species_id" in node) return true;
      for (const next of Object.values(node.branches) as string[]) {
        if (!leadsToLeaf(next, new Set(visited))) return false;
      }
      return true;
    }
    for (const [id, node] of Object.entries(treeRaw.nodes)) {
      if ("branches" in node) {
        expect(
          leadsToLeaf(id),
          `Nod '${id}' har en gren som aldrig leder till ett löv`
        ).toBe(true);
      }
    }
  });
});
