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
import { appConfig } from "@/shared/config/app";
import { copy } from "@/shared/lib/copy";
import { buttonClassName } from "@/shared/ui/Button";
import { ExperienceFooter } from "@/shared/ui/ExperienceFooter";

export function LandingPage() {
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const landingCopy = copy.landing;
  const cta = useMemo(
    () => ({
      investor: `/login?next=${encodeURIComponent("/dashboard")}&role=investor`,
      admin: `/login?next=${encodeURIComponent("/admin")}&role=admin`,
      register: "/register",
      productTour: "#product-tour",
      github: appConfig.repositoryUrl
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
          {copy.common.brand}
        </Link>
        <nav className="landing-nav-links" role="navigation">
          <Link href={cta.productTour}>{landingCopy.productTour}</Link>
          <Link href={cta.register}>{landingCopy.joinCta}</Link>
          <Link href={cta.github} target="_blank" rel="noopener noreferrer">
            {copy.common.github}
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <ShieldCheck size={18} aria-hidden />
            {landingCopy.heroBadge}
          </span>
          <h1>{landingCopy.title}</h1>
          <p>{landingCopy.subtitle}</p>
          <p className="hero-subtext">{landingCopy.heroSubtext}</p>
          <div className="hero-actions">
            <Link className={buttonClassName({ size: "lg" })} href={cta.investor}>
              <WalletCards size={18} aria-hidden />
              {landingCopy.investorCta}
            </Link>
            <Link className={buttonClassName({ size: "lg", variant: "secondary" })} href={cta.admin}>
              <Lock size={18} aria-hidden />
              {landingCopy.adminCta}
            </Link>
          </div>
          <div className="hero-stats-grid">
            {landingCopy.stats.map((stat) => (
              <div className="hero-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-preview" aria-label={landingCopy.previewLabel}>
          <div className="hero-preview-header">
            <span>{landingCopy.previewLabel}</span>
            <Sparkles size={18} aria-hidden />
          </div>
          <div className="hero-preview-list">
            {landingCopy.previewCards.map((card, index) => (
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
            {landingCopy.productTour}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      <section className="landing-features" aria-labelledby="features-title" id="product-tour">
        <div className="features-container">
          <span className="section-kicker">{landingCopy.featureKicker}</span>
          <h2 id="features-title">{landingCopy.featuresTitle}</h2>
          <div className="features-grid">
            {landingCopy.features.map((feature, index) => (
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
          <h2 id="tutorials-title">{landingCopy.stepsTitle}</h2>
          <div className="tutorials-grid">
            {landingCopy.steps.map((step, index) => (
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
          <h2 id="security-title">{landingCopy.securityTitle}</h2>
          <div className="security-grid">
            {landingCopy.securityItems.map((item, index) => (
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
          <h2 id="cta-title">{landingCopy.ctaTitle}</h2>
          <p>{landingCopy.ctaBody}</p>
          <div className="cta-actions">
            <Link className={buttonClassName({ size: "lg" })} href={cta.investor}>
              {landingCopy.ctaPrimary}
            </Link>
            <Link className={buttonClassName({ size: "lg", variant: "secondary" })} href={cta.admin}>
              {landingCopy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <ExperienceFooter
        links={[
          { href: cta.investor, label: landingCopy.investorCta },
          { href: cta.admin, label: landingCopy.adminCta },
          { href: cta.register, label: landingCopy.joinCta },
          { external: true, href: cta.github, label: copy.common.github }
        ]}
        status={measurementId ? landingCopy.analyticsEnabled : landingCopy.analyticsDisabled}
        summary={copy.common.footerSummary}
      />
    </main>
  );
}
