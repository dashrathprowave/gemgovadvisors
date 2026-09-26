export const SITE = {
  name: "GeM Advisor",
  legalName: "ProBid Consultants LLP",
  tagline: "Your Trusted Partner for Government Business",
  url: "https://www.gemgovadvisors.com",
  description:
    "GeM Advisor helps Indian businesses with GeM registration, government tender search, bid preparation, catalogue management and procurement advisory services.",
  phone: "+91 70166 28865",
  whatsapp: "916204498292",
  email: "gem@gemgovadvisors.com",
  hours: "Monday to Saturday, 9:00 AM to 6:30 PM IST",
  founded: "2025",
  address: {
    street: "Office Address Line 1",
    locality: "Ahmedabad",
    region: "Gujarat",
    postalCode: "380001", 
    country: "IN",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/gemgovadvisors",
    facebook: "https://www.facebook.com/gemgovadvisors",
  },
};

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services" },
      { label: "GeM Registration", href: "/services/gem-registration" },
      { label: "Catalogue Management", href: "/services/catalogue-management" },
      { label: "Tender Search & Analysis", href: "/services/tender-search" },
      { label: "Bid Preparation", href: "/services/bid-preparation" },
      { label: "Tender Consultancy", href: "/services/tender-consultancy" },
      { label: "Post-Bid Support", href: "/services/post-bid-support" },
    ],
  },
  { label: "GeM Services", href: "/gem-services" },
  { label: "Government Tenders", href: "/government-tenders" },
  { label: "Industries", href: "/industries" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
];

/* ------------------------------------------------------------------ *
 * Services
 * ------------------------------------------------------------------ */

export const SERVICES = [
  {
    slug: "gem-registration",
    icon: "registration",
    count: "End-to-end",
    title: "GeM Registration",
    desc: "Complete assistance for seller registration and onboarding on the Government e-Marketplace.",
    metaTitle: "GeM Registration Services in India",
    metaDescription:
      "End-to-end GeM seller registration support — document preparation, profile creation, vendor assessment guidance and category approval assistance for Indian businesses.",
    intro:
      "Getting onto the Government e-Marketplace is the first and most important step in selling to government buyers. A registration that is completed carelessly — wrong constitution type, mismatched PAN details, an incomplete bank profile — creates problems months later when a buyer places an order. We handle the registration properly the first time.",
    bullets: [
      "Assessment of the right seller category for your business constitution",
      "Preparation and verification of PAN, GST, Udyam / MSME documents",
      "Creation of the seller profile, primary user and organisational details",
      "Guidance on vendor assessment requirements where applicable",
      "Brand and OEM authorisation guidance for manufacturers and resellers",
    ],
    outcomes: [
      "A verified seller account that matches your legal documents exactly",
      "Correct MSE / Startup benefits claimed where you are eligible",
      "A clean profile that will not stall at order or payment stage",
    ],
  },
  {
    slug: "catalogue-management",
    icon: "catalogue",
    count: "Ongoing support",
    title: "GeM Catalogue Management",
    desc: "Product and service listing, optimization and ongoing catalogue support.",
    metaTitle: "GeM Catalogue Management & Product Listing",
    metaDescription:
      "Professional GeM catalogue management — product and service listing, correct category mapping, specification accuracy, price updates and ongoing catalogue maintenance.",
    intro:
      "On GeM, buyers find you through the catalogue. If your products sit in the wrong category, carry incomplete specifications or fail to match the technical parameters buyers filter on, you simply do not appear. Catalogue work is unglamorous and it decides how much business you see.",
    bullets: [
      "Mapping your products and services to the correct GeM categories",
      "Complete, accurate specification entry against required parameters",
      "Image, brochure and supporting document preparation",
      "Price, stock and delivery-period updates as your terms change",
      "Resolving rejected or held listings with corrected submissions",
      "Periodic review so listings stay aligned with active buyer demand",
    ],
    outcomes: [
      "Listings that surface in the searches your buyers actually run",
      "Fewer rejections and faster approval turnaround",
      "A catalogue that stays current instead of going stale",
    ],
  },
  {
    slug: "tender-search",
    icon: "search",
    count: "Matched to you",
    title: "Tender Search & Analysis",
    desc: "Find relevant government opportunities and understand eligibility requirements.",
    metaTitle: "Government Tender Search & Eligibility Analysis",
    metaDescription:
      "Tender search and eligibility analysis for Indian businesses — filtered government and PSU tender opportunities matched to your category, turnover, experience and location.",
    intro:
      "Thousands of government tenders are published every week across GeM, CPPP and state portals. Most of them are irrelevant to you, and a good number of the relevant-looking ones have eligibility conditions you cannot meet. Our job is to reduce that noise to a short list you can act on.",
    bullets: [
      "Category, geography and value filters set to your actual capability",
      "Screening against turnover, experience and past-performance clauses",
      "Flagging of restrictive conditions, OEM clauses and pre-bid deadlines",
      "A readable summary of each opportunity instead of a raw PDF dump",
      "Alerts timed so you have room to prepare rather than to rush",
      "An honest view when an opportunity is not worth your effort",
    ],
    outcomes: [
      "A shortlist you can review in minutes, not hours",
      "No more discovering a disqualifying clause on submission day",
      "Bid effort concentrated where you have a genuine chance",
    ],
  },
  {
    slug: "bid-preparation",
    icon: "document",
    count: "Documentation",
    title: "Bid Preparation",
    desc: "Professional assistance with documentation, eligibility and bid submission.",
    metaTitle: "Government Tender Bid Preparation Services",
    metaDescription:
      "Tender bid preparation support — technical and financial bid compilation, eligibility documentation, EMD and compliance checks, and on-time online submission assistance.",
    intro:
      "Most bids are not lost on price. They are lost on a missing affidavit, an unsigned page, a certificate that expired last month or a technical compliance sheet that does not answer the buyer's format. Bid preparation is a checklist discipline, and we run the checklist.",
    bullets: [
      "Line-by-line reading of the tender document and its corrigenda",
      "Eligibility and compliance matrix mapped to your documents",
      "Technical bid compilation in the buyer's prescribed format",
      "Financial bid and BOQ preparation with rate-sheet verification",
      "EMD, bid security declaration and fee guidance",
      "Submission support well before the closing timestamp",
    ],
    outcomes: [
      "Bids that clear technical evaluation instead of being set aside",
      "A complete document set assembled before the deadline, not during it",
      "A record of what was submitted, for future reference",
    ],
  },
  {
    slug: "tender-consultancy",
    icon: "compass",
    count: "Strategic",
    title: "Tender Consultancy",
    desc: "Strategic guidance throughout the tender participation process.",
    metaTitle: "Government Tender Consultancy & Advisory",
    metaDescription:
      "Strategic tender consultancy for Indian suppliers — bid or no-bid advice, pricing strategy, pre-bid queries, consortium guidance and long-term government business planning.",
    intro:
      "Winning government work consistently is a strategy problem, not a paperwork problem. Which departments buy what you sell? Where does your pricing stand? Should you bid alone or partner? We work through those questions with you rather than simply filling in forms.",
    bullets: [
      "Bid or no-bid assessment grounded in your cost structure",
      "Pricing approach informed by scope, risk and delivery terms",
      "Drafting pre-bid queries and clarification requests",
      "Consortium, MoU and OEM tie-up guidance where required",
      "Reading of past awards to understand a buyer's pattern",
      "A twelve-month plan for the departments worth pursuing",
    ],
    outcomes: [
      "A clear view of where your effort earns the best return",
      "Pricing decisions taken deliberately rather than by instinct",
      "A pipeline instead of one-off attempts",
    ],
  },
  {
    slug: "post-bid-support",
    icon: "support",
    count: "After submission",
    title: "Post-Bid Support",
    desc: "Support with clarifications, documentation and subsequent processes.",
    metaTitle: "Post-Bid & Post-Award Support Services",
    metaDescription:
      "Post-bid support for government contracts — clarification responses, technical evaluation queries, contract and order documentation, delivery compliance and payment follow-up.",
    intro:
      "The work does not end at submission. Buyers raise clarifications, evaluation committees ask for supporting proof, contracts arrive with conditions attached, and payment follows its own process. Being responsive during these stages is often what separates a supplier who gets repeat orders from one who does not.",
    bullets: [
      "Drafting responses to clarification and shortfall notices",
      "Support during technical evaluation and demonstration stages",
      "Review of contract, order and delivery conditions before acceptance",
      "Guidance on inspection, delivery and acceptance documentation",
      "Invoice, CRAC and payment-stage follow-up guidance",
      "Debrief after unsuccessful bids so the next one is stronger",
    ],
    outcomes: [
      "Clarifications answered inside the buyer's timeline",
      "Orders executed against conditions you actually understood",
      "Lessons carried forward into subsequent bids",
    ],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);

/* ------------------------------------------------------------------ *
 * Supporting content
 * ------------------------------------------------------------------ */

export const INDUSTRIES = [
  {
    icon: "code",
    title: "IT & Software",
    desc: "Hardware supply, software licensing, AMC, networking and system integration contracts for departments and PSUs.",
  },
  {
    icon: "shield",
    title: "Security Services",
    desc: "Manned guarding, surveillance systems, access control and integrated security service contracts.",
  },
  {
    icon: "building",
    title: "Construction & Civil Works",
    desc: "Civil works, repair and maintenance, interior fit-outs and infrastructure packages.",
  },
  {
    icon: "bolt",
    title: "Electrical & Electronics",
    desc: "Electrical fittings, panels, cabling, lighting, UPS systems and electronic equipment supply.",
  },
  {
    icon: "box",
    title: "Office Supplies & Furniture",
    desc: "Stationery, consumables, office furniture, printing and general procurement categories.",
  },
  {
    icon: "heart",
    title: "Healthcare & Medical",
    desc: "Medical equipment, consumables, laboratory supplies and hospital service contracts.",
  },
  {
    icon: "wrench",
    title: "Facility Management",
    desc: "Housekeeping, sanitation, manpower supply, horticulture and comprehensive facility contracts.",
  },
  {
    icon: "briefcase",
    title: "Professional Services",
    desc: "Consultancy, training, audit, manpower deployment and other service-category engagements.",
  },
];

export const GEM_SERVICES = [
  {
    icon: "users",
    title: "Seller Registration",
    desc: "Account creation, organisation profile, document verification and category activation.",
  },
  {
    icon: "list",
    title: "Product & Service Listing",
    desc: "Correct category mapping, specification entry and listing publication.",
  },
  {
    icon: "catalogue",
    title: "Catalogue Management",
    desc: "Ongoing updates to price, stock, delivery terms and product information.",
  },
  {
    icon: "chart",
    title: "Bid & RA Participation",
    desc: "Participation support for GeM bids, reverse auctions and direct purchase enquiries.",
  },
  {
    icon: "clock",
    title: "Order & Delivery Support",
    desc: "Order acceptance, delivery timelines, inspection and acceptance documentation.",
  },
  {
    icon: "check",
    title: "Compliance Assistance",
    desc: "OEM authorisation, MSE and Make-in-India declarations and profile compliance.",
  },
];

export const STEPS = [
  {
    icon: "profile",
    title: "Understand Your Business",
    desc: "We learn your capabilities, sector and goals to map the right opportunities.",
  },
  {
    icon: "search",
    title: "Find Relevant Opportunities",
    desc: "We identify GeM listings and tenders that genuinely fit your business.",
  },
  {
    icon: "document",
    title: "Prepare & Submit",
    desc: "We help assemble documentation and submit accurate, compliant bids.",
  },
  {
    icon: "growth",
    title: "Support & Grow",
    desc: "We stay engaged through clarifications, orders and future opportunities.",
  },
];

export const WHY = [
  {
    num: "01",
    title: "Practical Expertise",
    desc: "Working knowledge of GeM workflows, tender documentation and the conditions that actually disqualify bids.",
  },
  {
    num: "02",
    title: "Documentation Accuracy",
    desc: "Careful attention to eligibility, formats, signatures and validity dates — the details that decide technical evaluation.",
  },
  {
    num: "03",
    title: "Honest Strategy",
    desc: "We tell you when an opportunity is not worth pursuing. Bid effort spent well beats bid effort spent often.",
  },
  {
    num: "04",
    title: "Continuous Support",
    desc: "From first registration through clarifications, orders and the next financial year's pipeline.",
  },
];

export const STATS = [
  { value: "500+", label: "Businesses Assisted", bg: "bg-brand-100" },
  { value: "1000+", label: "Tender Opportunities Reviewed", bg: "bg-brand-50" },
  { value: "95%+", label: "Client Satisfaction", bg: "bg-orange-50" },
];

export const DOCUMENTS = [
  "PAN card of the business and the authorised signatory",
  "GST registration certificate",
  "Udyam / MSME certificate, if registered",
  "Certificate of incorporation, partnership deed or proprietorship proof",
  "Cancelled cheque or bank account details in the business name",
  "Aadhaar or other KYC of the authorised signatory",
  "Address proof of the registered office",
  "OEM authorisation or brand documents, for resellers",
];

export const PROCESS_TIMELINE = [
  {
    step: "Day 1",
    title: "Discovery call",
    desc: "A short conversation about what you supply, where you operate and what you have sold before.",
  },
  {
    step: "Day 2-3",
    title: "Document review",
    desc: "We check what you have, flag what is missing and give you a single consolidated list.",
  },
  {
    step: "Week 1",
    title: "Registration or listing",
    desc: "Your seller profile, category activation and first catalogue entries go live.",
  },
  {
    step: "Ongoing",
    title: "Opportunities and bids",
    desc: "Filtered tender alerts, bid preparation and support through evaluation and award.",
  },
];

export const FAQS = [
  {
    q: "What is GeM?",
    a: "GeM (Government e-Marketplace) is the official online procurement platform used by central and state government departments, PSUs and autonomous bodies to buy goods and services from registered sellers. It is administered by the Government of India.",
  },
  {
    q: "Who can register as a GeM seller?",
    a: "Most registered businesses can register — proprietorships, partnerships, LLPs, private and public limited companies, trusts, societies and manufacturers — provided they hold valid PAN, GST (where applicable) and a bank account in the business name.",
  },
  {
    q: "How long does GeM registration take?",
    a: "When documents are complete and consistent, a straightforward seller registration is usually completed within a few working days. Timelines extend if vendor assessment, brand approval or OEM authorisation is required for your category.",
  },
  {
    q: "What documents are required for GeM registration?",
    a: "Typically PAN, GST certificate, Udyam/MSME certificate if registered, constitution proof such as incorporation certificate or partnership deed, bank account proof and KYC of the authorised signatory. Some categories require additional certifications.",
  },
  {
    q: "How can GeM Advisor help with government tenders?",
    a: "We identify tenders relevant to your category and capacity, check eligibility conditions before you invest effort, prepare technical and financial documentation in the buyer's format, and support you through clarifications after submission.",
  },
  {
    q: "Do you provide tender search services?",
    a: "Yes. We track opportunities across GeM and government tender portals filtered by your product category, geography and value range, and share only those you are realistically eligible for.",
  },
  {
    q: "Can you help with bid preparation?",
    a: "Yes. We assist with the eligibility and compliance matrix, technical bid compilation, BOQ and financial bid preparation, EMD guidance and timely online submission.",
  },
  {
    q: "Do you support businesses after bid submission?",
    a: "Yes. We help draft clarification responses, support technical evaluation queries, review contract and order conditions, and guide delivery, inspection and payment-stage documentation.",
  },
  {
    q: "Which industries do you work with?",
    a: "We work across IT and software, security services, construction and civil works, electrical and electronics, office supplies and furniture, healthcare and medical, facility management and professional services.",
  },
  {
    q: "Is GeM Advisor a government agency?",
    a: "No. GeM Advisor is a private, independent advisory firm. We are not a government department or agency, and we are not affiliated with or endorsed by the Government of India or the Government e-Marketplace.",
  },
  {
    q: "Do you guarantee that we will win tenders?",
    a: "No, and you should be cautious of anyone who does. Government tender awards are decided by the procuring authority on the basis of evaluation criteria. What we can do is make sure your bid is eligible, complete, compliant and submitted on time.",
  },
  {
    q: "How do I get started?",
    a: "Register your business details on this website or contact us directly. An advisor will review your requirement and get back to you, usually within one working day.",
  },
];

export const TENDER_PORTALS = [
  {
    title: "Government e-Marketplace (GeM)",
    desc: "Direct purchase, L1 comparison, bids and reverse auctions across central and state buyers.",
  },
  {
    title: "Central Public Procurement Portal",
    desc: "Tenders published by central ministries, departments and central public sector undertakings.",
  },
  {
    title: "State Tender Portals",
    desc: "State government departments, municipal corporations and state PSUs across India.",
  },
  {
    title: "PSU & Autonomous Bodies",
    desc: "Railways, defence establishments, universities, boards and other autonomous procurement.",
  },
];

export const DISCLAIMER =
  'GeM Advisor is a private, independent advisory firm. We are not a government department, agency or authority, and are not affiliated with, endorsed by, or acting on behalf of the Government of India or the Government e-Marketplace (GeM). "GeM" refers to the Government e-Marketplace, a portal administered and operated solely by the Government of India.';
