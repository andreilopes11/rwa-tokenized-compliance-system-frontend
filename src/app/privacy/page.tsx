import { getServerMessages } from "@/shared/i18n/server";
import { LegalPageShell } from "@/shared/ui/LegalPageShell";

export default async function PrivacyPage() {
  const { messages } = await getServerMessages();
  const privacy = messages.legal.privacy;

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
