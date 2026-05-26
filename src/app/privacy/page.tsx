import { LegalPageShell } from "@/shared/ui/LegalPageShell";
import { copy } from "@/shared/lib/copy";

export default function PrivacyPage() {
  const privacy = copy.legal.privacy;

  return (
    <LegalPageShell eyebrow={privacy.eyebrow} title={privacy.title} updated={privacy.updated}>
      {privacy.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </LegalPageShell>
  );
}
