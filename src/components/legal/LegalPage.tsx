import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface LegalPageProps {
  title: string;
  sections: Array<{ heading: string; body: string | string[] }>;
  breadcrumb: string;
}

export function LegalPage({ title, sections, breadcrumb }: LegalPageProps) {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: breadcrumb }]} />

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-navy text-display-md md:text-display-lg mb-3">
          {title}
        </h1>
        <p className="text-sm text-navy/50 mb-10">
          Dernière mise à jour : 11 juillet 2026
        </p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display font-bold text-navy text-xl mb-3">
                {section.heading}
              </h2>
              {Array.isArray(section.body) ? (
                section.body.map((p, j) => (
                  <p key={j} className="text-navy/80 leading-relaxed mb-3">
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-navy/80 leading-relaxed">{section.body}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
