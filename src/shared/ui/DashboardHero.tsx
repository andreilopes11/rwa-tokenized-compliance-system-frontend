import type { ReactNode } from "react";

type HeroTone = "neutral" | "success" | "warning" | "danger";

export type DashboardHeroPill = {
  icon?: ReactNode;
  label: string;
  tone?: HeroTone;
};

export type DashboardHeroStat = {
  icon?: ReactNode;
  label: string;
  note?: string;
  tone?: HeroTone;
  value: ReactNode;
};

type DashboardHeroProps = {
  description: string;
  eyebrow: string;
  pills: DashboardHeroPill[];
  stats: DashboardHeroStat[];
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function DashboardHero({
  description,
  eyebrow,
  pills,
  stats,
  title
}: DashboardHeroProps) {
  return (
    <section className="dashboard-hero" aria-labelledby="dashboard-hero-title">
      <div className="dashboard-hero-copy">
        <span className="dashboard-hero-eyebrow">{eyebrow}</span>
        <h1 id="dashboard-hero-title">{title}</h1>
        <p>{description}</p>
        <div className="dashboard-pill-row" aria-label="Workspace status">
          {pills.map((pill) => (
            <span className={cx("dashboard-pill", pill.tone && `dashboard-pill-${pill.tone}`)} key={pill.label}>
              {pill.icon ? (
                <span className="dashboard-pill-icon" aria-hidden>
                  {pill.icon}
                </span>
              ) : null}
              <span>{pill.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="dashboard-hero-stats" aria-label="Workspace overview">
        {stats.map((stat) => (
          <article
            className={cx("dashboard-hero-stat", stat.tone && `dashboard-hero-stat-${stat.tone}`)}
            key={stat.label}
          >
            <div className="dashboard-hero-stat-top">
              <span>{stat.label}</span>
              {stat.icon ? (
                <span className="dashboard-hero-stat-icon" aria-hidden>
                  {stat.icon}
                </span>
              ) : null}
            </div>
            <strong>{stat.value}</strong>
            {stat.note ? <p>{stat.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
