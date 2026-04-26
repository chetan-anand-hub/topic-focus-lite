import { GraduationCap } from "lucide-react";

export function PaperBlueprint({ subject, stream }: { subject: "Maths" | "Science"; stream?: "All" | "Physics" | "Chemistry" | "Biology" }) {
  const sections = [
    { id: "A", label: "Section A", marks: 20, hint: "MCQ + Assertion-Reason (1m × 20)" },
    { id: "B", label: "Section B", marks: 10, hint: "Short Answer I (2m × 5)" },
    { id: "C", label: "Section C", marks: 18, hint: "Short Answer II (3m × 6)" },
    { id: "D", label: "Section D", marks: 20, hint: "Long Answer (5m × 4)" },
    { id: "E", label: "Section E", marks: 12, hint: "Case-based (4m × 3)" },
  ];

  const subjectLine =
    subject === "Maths"
      ? "All questions from CBSE Class 10 Maths topics."
      : stream && stream !== "All"
      ? `Questions from CBSE Class 10 ${stream} only.`
      : "Mix of Physics + Chemistry + Biology — proportional to exam weight.";

  return (
    <div className="lt-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-accent" />
        <div>
          <div className="font-display text-base font-semibold">Paper blueprint preview</div>
          <div className="text-xs text-muted-foreground">{subject} full mock · 80 marks · 3 hours · {subjectLine}</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {sections.map((s) => (
          <div key={s.id} className="rounded-lg bg-secondary/60 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl font-semibold mt-1">{s.marks}<span className="text-xs text-muted-foreground"> m</span></div>
            <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.hint}</div>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
        Total: 80 marks · Duration: 3 hours.
      </div>
    </div>
  );
}
