export function PageHero({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: string; // portion of title to color
}) {
  const [before, after] = accent && title.includes(accent)
    ? title.split(accent)
    : [title, ""];

  return (
    <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
        {before}
        {accent && <span className="text-coral">{accent}</span>}
        {after}
      </h1>
      {description && (
        <p className="mt-4 text-navy/70 text-lg text-balance">{description}</p>
      )}
    </div>
  );
}
