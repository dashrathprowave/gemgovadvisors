/**
 * Renders one or more schema.org objects as a JSON-LD script tag.
 * Angle brackets are escaped so a stray "</script>" in the data cannot break out.
 */
export default function JsonLd({ data }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload.length === 1 ? payload[0] : payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
