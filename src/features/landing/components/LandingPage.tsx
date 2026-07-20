"use client";

import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Layers3,
  Lock,
  LockKeyhole,
  MinusCircle,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "../landing.css";
import { publicRuntime } from "@/shared/config/publicRuntime";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { ExperienceFooter } from "@/shared/ui/ExperienceFooter";
import { GlobalAppHeader } from "@/shared/ui/GlobalAppHeader";

const featureIcons = [LockKeyhole, ShieldCheck, BarChart3, CheckCircle2] as const;
const useCaseIcons = [BriefcaseBusiness, UserRound, ShieldCheck] as const;
const securityIcons = [Lock, Zap, Layers3] as const;

export function LandingPage() {
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const measurementId = publicRuntime.gaMeasurementId;
  const m = useMessages();
  const landingCopy = m.landing;
  const cta = useMemo(
    () => ({
      investor: `/login?next=${encodeURIComponent("/dashboard")}&role=investor`,
      admin: `/login?next=${encodeURIComponent("/governance")}&role=governance`,
      register: "/register",
      login: "/login",
      product: "#product",
      useCases: "#use-cases",
      howTo: "#how-to",
      tradeoffs: "#tradeoffs",
      capabilities: "#capabilities",
      platform: "#platform",
      trust: "#trust",
      cta: "#cta"
    }),
    []
  );

  useEffect(() => {
    if (!analyticsLoaded && measurementId && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.onload = () => {
        (window as Window & { dataLayer?: unknown[] }).dataLayer =
          (window as Window & { dataLayer?: unknown[] }).dataLayer || [];
        function gtag(...args: unknown[]) {
          (window as Window & { dataLayer?: unknown[] }).dataLayer?.push(args);
        }
        (window as Window & { gtag?: typeof gtag }).gtag = gtag;
        gtag("js", new Date());
        gtag("config", measurementId, { page_path: window.location.pathname });
      };
      document.head.appendChild(script);
      setAnalyticsLoaded(true);
    }
  }, [analyticsLoaded, measurementId]);

  return (
    <main className="experience-shell landing-shell">
      <GlobalAppHeader showLandingNav variant="landing" />

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-kicker">
            <Sparkles size={16} aria-hidden />
            {landingCopy.heroBadge}
          </span>
          <h1 id="hero-title">
            {landingCopy.title}
            <br />
            <span>{landingCopy.titleAccent}</span>
          </h1>
          <p className="hero-lead">{landingCopy.subtitle}</p>
          <p className="hero-subtext">{landingCopy.heroSubtext}</p>
          <div className="hero-actions">
            <Link className="lp-btn-primary" href={cta.investor}>
              <WalletCards size={18} aria-hidden />
              {landingCopy.investorCta}
            </Link>
            <Link className="lp-btn-outline" href={cta.admin}>
              <Lock size={18} aria-hidden />
              {landingCopy.adminCta}
            </Link>
          </div>
          <div className="hero-stats-grid" role="list">
            {landingCopy.stats.map((stat) => (
              <div className="hero-stat-card" key={stat.label} role="listitem">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-preview" aria-label={landingCopy.previewLabel}>
          <div className="hero-preview-header">
            <span>{landingCopy.previewLabel}</span>
            <div className="hero-preview-dots" aria-hidden>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="hero-flow">
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
          <Link className="hero-inline-link" href={cta.howTo}>
            {landingCopy.productTour}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      <section className="landing-trust" aria-label={landingCopy.trustTitle}>
        <p>{landingCopy.trustTitle}</p>
        <div className="landing-trust-grid">
          {landingCopy.trustLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </section>

      <section
        className="landing-section landing-use-cases"
        aria-labelledby="use-cases-title"
        id="use-cases"
      >
        <header className="section-head">
          <span className="section-kicker">Use cases</span>
          <h2 id="use-cases-title">{landingCopy.useCasesTitle}</h2>
          <p>{landingCopy.useCasesIntro}</p>
        </header>
        <div className="use-cases-grid">
          {landingCopy.useCases.map((item, index) => {
            const Icon = useCaseIcons[index] ?? ShieldCheck;
            return (
              <article className="use-case-card" key={item.title}>
                <div className="use-case-icon">
                  <Icon size={20} aria-hidden />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="landing-section landing-features"
        aria-labelledby="features-title"
        id="product"
      >
        <header className="section-head">
          <span className="section-kicker">{landingCopy.featureKicker}</span>
          <h2 id="features-title">{landingCopy.featuresTitle}</h2>
          <p>{landingCopy.featuresIntro}</p>
        </header>
        <div className="features-grid">
          {landingCopy.features.map((feature, index) => {
            const Icon = featureIcons[index] ?? CheckCircle2;
            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={22} aria-hidden />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section landing-howto" aria-labelledby="howto-title" id="how-to">
        <header className="section-head">
          <span className="section-kicker">Quick start</span>
          <h2 id="howto-title">{landingCopy.howToTitle}</h2>
          <p>{landingCopy.howToIntro}</p>
        </header>
        <ol className="howto-list">
          {landingCopy.howToSteps.map((step, index) => (
            <li className="howto-item" key={step.title}>
              <span className="howto-index">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="landing-section landing-tradeoffs"
        aria-labelledby="tradeoffs-title"
        id="tradeoffs"
      >
        <header className="section-head">
          <span className="section-kicker">Scope</span>
          <h2 id="tradeoffs-title">{landingCopy.tradeoffsTitle}</h2>
          <p>{landingCopy.tradeoffsIntro}</p>
        </header>
        <div className="tradeoffs-grid">
          <article className="tradeoffs-card tradeoffs-card-strength">
            <h3>
              <PlusCircle size={18} aria-hidden />
              Strengths
            </h3>
            <ul>
              {landingCopy.tradeoffsStrengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="tradeoffs-card tradeoffs-card-limit">
            <h3>
              <MinusCircle size={18} aria-hidden />
              Limits
            </h3>
            <ul>
              {landingCopy.tradeoffsLimits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section
        className="landing-section landing-more"
        aria-labelledby="more-title"
        id="capabilities"
      >
        <header className="section-head">
          <span className="section-kicker">Extended</span>
          <h2 id="more-title">{landingCopy.moreFeaturesTitle}</h2>
          <p>{landingCopy.moreFeaturesIntro}</p>
        </header>
        <div className="more-features-grid">
          {landingCopy.moreFeatures.map((item) => (
            <article className="more-feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" aria-labelledby="security-title" id="trust">
        <header className="section-head">
          <span className="section-kicker">Security & UX</span>
          <h2 id="security-title">{landingCopy.securityTitle}</h2>
          <p>{landingCopy.securityIntro}</p>
        </header>
        <div className="security-grid">
          {landingCopy.securityItems.map((item, index) => {
            const Icon = securityIcons[index] ?? ShieldCheck;
            return (
              <article className="security-item" key={item.title}>
                <Icon size={22} aria-hidden />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-cta-section" aria-labelledby="cta-title" id="cta">
        <div className="cta-panel">
          <h2 id="cta-title">{landingCopy.ctaTitle}</h2>
          <p>{landingCopy.ctaBody}</p>
          <div className="cta-actions">
            <Link className="lp-btn-primary" href={cta.investor}>
              {landingCopy.ctaPrimary}
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link className="lp-btn-outline" href={cta.register}>
              {landingCopy.joinCta}
            </Link>
          </div>
        </div>
      </section>

      <ExperienceFooter
        status={measurementId ? landingCopy.analyticsEnabled : landingCopy.analyticsDisabled}
        variant="landing"
      />
    </main>
  );
}
