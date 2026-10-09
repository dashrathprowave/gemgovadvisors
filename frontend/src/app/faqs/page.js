import PageHero from "@/components/PageHero";
import Faqs from "@/components/Faqs";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { FAQS } from "@/data/site";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about GeM registration, required documents, tender eligibility, bid preparation, timelines and how GeM Advisor works with Indian businesses.",
  path: "/faqs",
  keywords: [
    "GeM registration FAQ",
    "government tender questions",
    "GeM documents required",
    "how to register on GeM",
  ],
});

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Frequently asked questions"
        description="The questions businesses ask us most often about GeM, government tenders and how our engagements work."
      />

      <Faqs items={FAQS} eyebrow="Knowledge Base" title="Everything we get asked, in one place" />

      <CtaBand
        title="Question not answered here?"
        description="Send it to us directly. If it is something we can answer in an email, we will — no obligation to engage us."
      />

      <JsonLd data={faqSchema(FAQS)} />
    </>
  );
}
