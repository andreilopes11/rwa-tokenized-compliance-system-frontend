import { getServerMessages } from "@/shared/i18n/server";
import { LegalPageShell } from "@/shared/ui/LegalPageShell";

export default async function TermsPage() {
  const { messages } = await getServerMessages();
  const terms = messages.legal.terms;

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
