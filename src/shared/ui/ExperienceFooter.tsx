import Link from "next/link";
import { appConfig } from "@/shared/config/app";

export type ExperienceFooterLink = {
  external?: boolean;
  href: string;
  label: string;
};

type ExperienceFooterProps = {
  links: ExperienceFooterLink[];
  status: string;
  summary: string;
};

export function ExperienceFooter({ links, status, summary }: ExperienceFooterProps) {
  return (
    <footer className="experience-footer">
      <div className="experience-footer-inner">
        <div className="experience-footer-copy">
          <strong>{appConfig.brandName}</strong>
          <p>{summary}</p>
        </div>
        <div className="experience-footer-meta">
          <span className="status-chip">{status}</span>
        </div>
        <nav className="experience-footer-links" aria-label="Footer">
          {links.map((link) => (
            <Link
              href={link.href}
              key={`${link.href}:${link.label}`}
              rel={link.external ? "noopener noreferrer" : undefined}
              target={link.external ? "_blank" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
