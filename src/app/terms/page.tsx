import { LegalPageShell } from "@/shared/ui/LegalPageShell";
import { copy } from "@/shared/lib/copy";

export default function TermsPage() {
  const terms = copy.legal.terms;

  return (
    <LegalPageShell eyebrow={terms.eyebrow} title={terms.title} updated={terms.updated}>
      {terms.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </LegalPageShell>
  );
}
