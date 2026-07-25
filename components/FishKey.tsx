"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import speciesData from "@/data/species.json";
import questionsData from "@/data/questions.json";
import treeData from "@/data/tree.json";

type TreeNode =
  | {
      question_id: string;
      branches: Record<string, string>;
      species_id?: never;
    }
  | { species_id: string | null; question_id?: never; branches?: never };

type Tree = {
  root: string;
  nodes: Record<string, TreeNode>;
};

type Question = {
  id: string;
  text: string;
  helpText: string;
};

type Species = {
  id: string;
  swedish_name: string;
  latin_name: string;
  description: string;
  identifying_features: string[];
  image: string | null;
};

const tree = treeData as Tree;
const questions: Question[] = questionsData as Question[];
const species: Species[] = speciesData as Species[];

function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

function getSpecies(id: string): Species | undefined {
  return species.find((s) => s.id === id);
}

const HABITAT_ANSWERS = [
  { label: "Västkusten", value: "västkusten", emoji: "🌊" },
  { label: "Östkusten", value: "östkusten", emoji: "⚓" },
  { label: "Insjö / vattendrag", value: "insjö", emoji: "🏞️" },
];

const YES_NO_ANSWERS = [
  { label: "Ja", value: "ja", emoji: "✓" },
  { label: "Nej", value: "nej", emoji: "✗" },
];

export default function FishKey() {
  const [currentNodeId, setCurrentNodeId] = useState<string>(tree.root);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = tree.nodes[currentNodeId];
  const isRoot = currentNodeId === tree.root;
  const isLeaf = "species_id" in currentNode;

  function handleAnswer(value: string) {
    const node = tree.nodes[currentNodeId];
    if (!("branches" in node) || !node.branches) return;
    const nextId = node.branches[value];
    if (!nextId) return;
    setHistory((h) => [...h, currentNodeId]);
    setCurrentNodeId(nextId);
  }

  function handleBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentNodeId(prev);
  }

  function handleReset() {
    setHistory([]);
    setCurrentNodeId(tree.root);
  }

  if (isLeaf) {
    const node = currentNode as { species_id: string | null };
    const found = node.species_id ? getSpecies(node.species_id) : null;

    return (
      <div className="space-y-6">
        {found ? (
          <div className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden">
            <div className="bg-sky-700 px-6 py-4">
              <p className="text-sky-200 text-sm font-medium mb-1">
                Din fisk är troligen:
              </p>
              <h2 className="text-white text-3xl font-bold">
                {found.swedish_name}
              </h2>
              <p className="text-sky-200 italic text-lg">{found.latin_name}</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                {found.description}
              </p>
              <Link
                href={`/arter/${found.id}`}
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium text-sm"
              >
                Läs mer om {found.swedish_name} →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
            <p className="text-2xl">🤔</p>
            <h2 className="text-xl font-bold text-amber-800">
              Kunde inte identifiera fisken
            </h2>
            <p className="text-amber-700 text-sm">
              Den här kombinationen av kännetecken matchar ingen av arterna i
              databasen. Fisken kan vara ovanlig, ett korsningsexemplar eller
              inte inkluderad ännu.
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            ← Tillbaka
          </Button>
          <Button
            onClick={handleReset}
            className="flex-1 bg-sky-700 hover:bg-sky-800"
          >
            Börja om
          </Button>
        </div>
      </div>
    );
  }

  const node = currentNode as {
    question_id: string;
    branches: Record<string, string>;
  };
  const question = getQuestion(node.question_id);
  const answers = isRoot ? HABITAT_ANSWERS : YES_NO_ANSWERS;
  const stepNumber = history.length + 1;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded-full">
            Steg {stepNumber}
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          {question?.text ?? "Okänd fråga"}
        </h2>

        {question?.helpText && (
          <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 leading-relaxed">
            💡 {question.helpText}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-2">
          {answers.map((a) => (
            <Button
              key={a.value}
              variant="outline"
              className="justify-start text-left h-auto py-3 px-4 hover:bg-sky-50 hover:border-sky-400 hover:text-sky-800 transition-colors"
              onClick={() => handleAnswer(a.value)}
            >
              <span className="mr-3 text-lg">{a.emoji}</span>
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-slate-500 hover:text-slate-800"
        >
          ← Föregående fråga
        </Button>
      )}
    </div>
  );
}
