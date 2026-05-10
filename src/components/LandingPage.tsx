"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lock,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { ExperienceFooter } from "@/components/ui/ExperienceFooter";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { dictionaries, type Locale } from "@/lib/i18n";

export function LandingPage() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const copy = dictionaries[locale].landing;
  const cta = useMemo(
    () => ({
      investor: `/login?next=${encodeURIComponent("/dashboard")}&role=investor`,
      admin: `/login?next=${encodeURIComponent("/admin")}&role=admin`,
      register: "/register",
      productTour: "#product-tour",
      github: "https://github.com/andreilopes11/rwa-tokenized-compliance-system"
    }),
    []
  );

  // Load Google Analytics
  useEffect(() => {
    if (!analyticsLoaded && measurementId && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(this: any, ...args: any[]) {
          (window as any).dataLayer.push(arguments);
        }
        (window as any).gtag = gtag;
        gtag("js", new Date());
        gtag("config", measurementId, { page_path: window.location.pathname });
      };
      document.head.appendChild(script);
      setAnalyticsLoaded(true);
    }
  }, [analyticsLoaded, measurementId]);

  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <Link className="landing-brand" href="/">
          <ShieldCheck size={24} aria-hidden />
          {dictionaries[locale].common.brand}
        </Link>
        <nav className="landing-nav-links" role="navigation">
          <Link href={cta.productTour}>{copy.productTour}</Link>
          <Link href={cta.register}>{copy.joinCta}</Link>
          <Link href={cta.github} target="_blank" rel="noopener noreferrer">
            {dictionaries[locale].common.github}
          </Link>
        </nav>
        <LanguageToggle
          ariaLabel={dictionaries[locale].common.language}
          locale={locale}
          onChange={setLocale}
        />
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <ShieldCheck size={18} aria-hidden />
            {copy.heroBadge}
          </span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <p className="hero-subtext">{copy.heroSubtext}</p>
          <div className="hero-actions">
            <Link className={buttonClassName({ size: "lg" })} href={cta.investor}>
              <WalletCards size={18} aria-hidden />
              {copy.investorCta}
            </Link>
            <Link className={buttonClassName({ size: "lg", variant: "secondary" })} href={cta.admin}>
              <Lock size={18} aria-hidden />
              {copy.adminCta}
            </Link>
          </div>
          <div className="hero-stats-grid">
            {copy.stats.map((stat) => (
              <div className="hero-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-preview" aria-label={copy.previewLabel}>
          <div className="hero-preview-header">
            <span>{copy.previewLabel}</span>
            <Sparkles size={18} aria-hidden />
          </div>
          <div className="hero-preview-list">
            {copy.previewCards.map((card, index) => (
              <article className="preview-card" key={card.title}>
                <div className="preview-card-index">{index + 1}</div>
                <div>
                  <strong>{card.title}</strong>
                  <p>{card.description}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="hero-inline-link" href={cta.productTour}>
            {copy.productTour}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      <section className="landing-features" aria-labelledby="features-title" id="product-tour">
        <div className="features-container">
          <span className="section-kicker">{copy.featureKicker}</span>
          <h2 id="features-title">{copy.featuresTitle}</h2>
          <div className="features-grid">
            {copy.features.map((feature, index) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  {index === 0 ? (
                    <LockKeyhole size={24} aria-hidden />
                  ) : index === 1 ? (
                    <ShieldCheck size={24} aria-hidden />
                  ) : index === 2 ? (
                    <BarChart3 size={24} aria-hidden />
                  ) : (
                    <CheckCircle2 size={24} aria-hidden />
                  )}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-tutorials" aria-labelledby="tutorials-title">
        <div className="tutorials-container">
          <h2 id="tutorials-title">{copy.stepsTitle}</h2>
          <div className="tutorials-grid">
            {copy.steps.map((step, index) => (
              <div className="tutorial-card" key={step.title}>
                <div className="tutorial-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-security" aria-labelledby="security-title">
        <div className="security-container">
          <h2 id="security-title">{copy.securityTitle}</h2>
          <div className="security-grid">
            {copy.securityItems.map((item, index) => (
              <div className="security-item" key={item.title}>
                {index === 0 ? (
                  <Lock size={20} aria-hidden />
                ) : index === 1 ? (
                  <ShieldCheck size={20} aria-hidden />
                ) : (
                  <CheckCircle2 size={20} aria-hidden />
                )}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-section" aria-labelledby="cta-title">
        <div className="cta-container">
          <h2 id="cta-title">{copy.ctaTitle}</h2>
          <p>{copy.ctaBody}</p>
          <div className="cta-actions">
            <Link className={buttonClassName({ size: "lg" })} href={cta.investor}>
              {copy.ctaPrimary}
            </Link>
            <Link className={buttonClassName({ size: "lg", variant: "secondary" })} href={cta.admin}>
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <ExperienceFooter
        links={[
          { href: cta.investor, label: copy.investorCta },
          { href: cta.admin, label: copy.adminCta },
          { href: cta.register, label: copy.joinCta },
          { external: true, href: cta.github, label: dictionaries[locale].common.github }
        ]}
        status={measurementId ? copy.analyticsEnabled : copy.analyticsDisabled}
        summary={dictionaries[locale].common.footerSummary}
      />
    </main>
  );
}
