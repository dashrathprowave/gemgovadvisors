export default function SectionHeading({ eyebrow, title, description, align = "center", as: Tag = "h2" }) {
  const centred = align === "center";
  return (
    <div className={`mb-10 ${centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left"}`}>
      {eyebrow && (
        <p className="m-0 mb-3 text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          {eyebrow}
        </p>
      )}
      <Tag className="m-0 font-heading text-2xl font-extrabold leading-snug text-darkIndigo-900 dark:text-white sm:text-3xl lg:text-4xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-gray-300 lg:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
