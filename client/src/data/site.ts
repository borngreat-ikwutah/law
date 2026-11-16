export type PracticeArea = {
  slug: string;
  title: string;
  short: string;
  overview: string;
  services: string[];
  challenges: string[];
  assistance: string[];
  faqs: { question: string; answer: string }[];
  image?: string;
  demo?: boolean;
};
export type Attorney = {
  slug: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  fullBio: string;
  education: string[];
  credentials: string[];
  experience: string[];
  languages: string[];
  photo?: string;
  demo?: boolean;
};
export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  body: string[];
  demo?: boolean;
};

export const heroImage = "/assets/images/hero.webp";
export const attorneyImage = "/assets/images/attorney.webp";
export const commercialImage = "/assets/images/commercial.webp";
export const propertyArticleImage = "/assets/images/property-article.webp";
export const familyArticleImage = "/assets/images/family-article.webp";
export const legalConsultationImage = "/assets/images/consultation.webp";

const demoNote =
  "Illustrative demo content only. Confirm the firm's actual services with qualified counsel before publication.";
export const practiceAreas: PracticeArea[] = [
  {
    slug: "corporate-commercial",
    title: "Corporate & Commercial",
    short: "Practical legal guidance for businesses at every stage of growth.",
    overview: `This sample overview illustrates how the firm could describe corporate and commercial support. ${demoNote}`,
    services: [
      "Commercial agreements and negotiations",
      "Company formation and governance",
      "Business transactions and diligence",
    ],
    challenges: [
      "Unclear contract obligations",
      "Governance and ownership questions",
      "Commercial risk during growth or change",
    ],
    assistance: [
      "Understand relevant documents and timelines",
      "Evaluate options and commercial trade-offs",
      "Plan a considered next step",
    ],
    faqs: [
      {
        question: "When should a business seek legal advice?",
        answer:
          "Consider speaking with qualified counsel before signing a significant agreement, changing ownership, or making a material business decision.",
      },
      {
        question: "Can every matter be handled remotely?",
        answer:
          "That depends on the matter and jurisdiction; the firm can discuss suitable meeting formats after reviewing a general summary.",
      },
    ],
    image: commercialImage,
    demo: true,
  },
  {
    slug: "litigation-disputes",
    title: "Litigation & Dispute Resolution",
    short: "Measured advice for disputes, negotiation, and formal proceedings.",
    overview: `This provisional description is a content example, not confirmation of a service offered by the firm. ${demoNote}`,
    services: [
      "Dispute assessment",
      "Negotiation and mediation support",
      "Litigation strategy and representation",
    ],
    challenges: [
      "Uncertain next steps",
      "Time-sensitive correspondence",
      "Balancing legal position and business or personal impact",
    ],
    assistance: [
      "Organize relevant facts and documents",
      "Explain procedural options",
      "Discuss strategy and likely stages",
    ],
    faqs: [
      {
        question: "Should I respond to a legal notice?",
        answer:
          "Deadlines can matter. Consider obtaining jurisdiction-specific legal advice promptly and avoid sharing confidential documents through an unverified channel.",
      },
    ],
    demo: true,
  },
  {
    slug: "property-real-estate",
    title: "Property & Real Estate",
    short:
      "Clear review of property transactions, ownership, and related agreements.",
    overview: `A sample description for a potential property-law practice. ${demoNote}`,
    services: [
      "Transaction document review",
      "Property and lease agreements",
      "Ownership and title questions",
    ],
    challenges: [
      "Complex transaction terms",
      "Unclear responsibilities or costs",
      "Timing and due-diligence concerns",
    ],
    assistance: [
      "Identify questions for review",
      "Explain document structure and responsibilities",
      "Coordinate a practical review path",
    ],
    faqs: [
      {
        question: "Can a lawyer review an agreement before signing?",
        answer:
          "A qualified lawyer in the relevant jurisdiction can advise on the actual document and circumstances.",
      },
    ],
    demo: true,
  },
  {
    slug: "family-matrimonial",
    title: "Family & Matrimonial",
    short: "Thoughtful guidance for sensitive family and relationship matters.",
    overview: `A fictional example of how the firm might introduce family-law support. ${demoNote}`,
    services: [
      "Family-law advice",
      "Matrimonial agreements",
      "Negotiation and resolution options",
    ],
    challenges: [
      "Sensitive personal circumstances",
      "Financial and parenting arrangements",
      "The need for privacy and clear communication",
    ],
    assistance: [
      "Provide a respectful initial conversation",
      "Explain possible processes",
      "Identify appropriate specialist support",
    ],
    faqs: [
      {
        question: "Can an initial consultation be confidential?",
        answer:
          "The firm should explain its confidentiality practices and any legal limits before you provide sensitive details.",
      },
    ],
    demo: true,
  },
  {
    slug: "criminal-defence",
    title: "Criminal Defence",
    short: "Careful, timely legal support for criminal-law concerns.",
    overview: `This sample content is not a claim that the firm accepts criminal matters. ${demoNote}`,
    services: [
      "Initial case assessment",
      "Procedural guidance",
      "Representation options",
    ],
    challenges: [
      "Urgent deadlines or interviews",
      "Uncertainty about process",
      "Serious personal consequences",
    ],
    assistance: [
      "Clarify immediate next steps",
      "Explain rights and process subject to local law",
      "Discuss qualified representation",
    ],
    faqs: [
      {
        question: "What if a matter is urgent?",
        answer:
          "Contact a qualified local lawyer or appropriate emergency legal-support service without delay.",
      },
    ],
    demo: true,
  },
  {
    slug: "employment-labour",
    title: "Employment & Labour",
    short: "Advice on workplace relationships, rights, and responsibilities.",
    overview: `Provisional example content only; applicable employment law varies by jurisdiction. ${demoNote}`,
    services: [
      "Employment agreements",
      "Workplace policies",
      "Employment-related disputes",
    ],
    challenges: [
      "Unclear contractual terms",
      "Workplace changes or concerns",
      "Dispute resolution and deadlines",
    ],
    assistance: [
      "Review the general issue and key documents",
      "Explain potential routes for advice",
      "Plan a practical response",
    ],
    faqs: [
      {
        question: "Do employment rules differ by location?",
        answer:
          "Yes. Obtain advice from a qualified professional in the relevant jurisdiction.",
      },
    ],
    demo: true,
  },
  {
    slug: "intellectual-property",
    title: "Intellectual Property",
    short:
      "Support for businesses seeking to understand and protect intangible assets.",
    overview: `Illustrative copy for a possible intellectual-property practice. ${demoNote}`,
    services: [
      "IP strategy and portfolio questions",
      "Trademark and copyright matters",
      "IP-related commercial terms",
    ],
    challenges: [
      "Ownership questions",
      "Brand protection planning",
      "Licensing and commercial use",
    ],
    assistance: [
      "Identify asset and ownership questions",
      "Discuss available protection routes",
      "Review relevant commercial language",
    ],
    faqs: [
      {
        question:
          "Does registration protect every kind of intellectual property?",
        answer:
          "Protection varies by right, jurisdiction and facts; qualified advice is needed for a specific position.",
      },
    ],
    demo: true,
  },
  {
    slug: "contracts",
    title: "Contract Law",
    short:
      "Careful agreement review focused on clarity, risk, and practical outcomes.",
    overview: `An educational example of contract-related service content. ${demoNote}`,
    services: [
      "Contract review and drafting",
      "Negotiation support",
      "Interpretation and dispute questions",
    ],
    challenges: [
      "Ambiguous obligations",
      "Risk allocation",
      "Changing circumstances",
    ],
    assistance: [
      "Clarify commercial objectives",
      "Identify provisions for discussion",
      "Explain possible next steps",
    ],
    faqs: [
      {
        question: "Can I receive advice from a short summary?",
        answer:
          "A summary can help frame an initial discussion, but legal advice depends on the complete circumstances and relevant documents.",
      },
    ],
    demo: true,
  },
  {
    slug: "immigration",
    title: "Immigration",
    short:
      "Guidance for individuals and businesses navigating immigration questions.",
    overview: `This is a placeholder description, not confirmation of any immigration authorization or practice. ${demoNote}`,
    services: [
      "Initial immigration-law consultation",
      "Application process guidance",
      "Employer-related immigration questions",
    ],
    challenges: [
      "Complex eligibility rules",
      "Changing requirements",
      "Important documentation and dates",
    ],
    assistance: [
      "Identify the correct jurisdiction and process",
      "Discuss document and timeline questions",
      "Refer to qualified specialist support if needed",
    ],
    faqs: [
      {
        question: "Can the firm guarantee an application outcome?",
        answer:
          "No responsible provider should guarantee an outcome; individual decisions depend on applicable law and authorities.",
      },
    ],
    demo: true,
  },
  {
    slug: "business-advisory",
    title: "Business & Legal Advisory",
    short:
      "Legal perspective for important decisions, transactions, and business change.",
    overview: `A provisional sample overview for business advisory. ${demoNote}`,
    services: [
      "General business legal planning",
      "Risk and compliance discussions",
      "Strategic transaction support",
    ],
    challenges: [
      "Decisions made with incomplete legal context",
      "Coordination among advisors",
      "Unclear contractual or regulatory exposure",
    ],
    assistance: [
      "Understand objectives and constraints",
      "Identify legal questions for professional review",
      "Coordinate practical next steps",
    ],
    faqs: [
      {
        question: "Does this replace specialist advice?",
        answer:
          "No. A specific matter may require dedicated advice from a qualified professional in the relevant field and jurisdiction.",
      },
    ],
    demo: true,
  },
];

export const attorneys: Attorney[] = [
  {
    slug: "alex-morgan",
    name: "Alex Morgan",
    title: "Principal Attorney · Demo Profile",
    specialty: "Commercial & Dispute Resolution",
    bio: "A fictional profile used to demonstrate the firm's attorney directory and content management tools.",
    fullBio:
      "Alex Morgan is a fictional attorney profile created solely for this website demonstration. The biography, qualifications, affiliations, experience and languages below are illustrative and must be replaced with verified details before the site is published.",
    education: ["Education details to be verified"],
    credentials: ["Bar admission and professional standing to be verified"],
    experience: ["Practice history to be verified"],
    languages: ["Languages to be verified"],
    photo: attorneyImage,
    demo: true,
  },
];

export const articles: Article[] = [
  {
    slug: "commercial-agreement-review",
    title:
      "Before You Sign: A Practical Guide to Reviewing a Commercial Agreement",
    category: "Corporate Law",
    excerpt:
      "A thoughtful review begins with clarity about the deal, the obligations, and the risks that matter most.",
    date: "2026-09-24",
    author: "LEGAL AID LEGAL SERVICES LLC Editorial Team · Demo",
    image: commercialImage,
    body: [
      "A commercial agreement is more than a record of what the parties intend to do. It allocates responsibilities, timelines, costs and risk. Before signing, take time to understand how its terms work together.",
      "Start with the commercial essentials: who must do what, by when, and what happens if circumstances change. Definitions, schedules and incorporated documents can materially affect the main terms.",
      "Pay attention to renewal, termination, liability, confidentiality, dispute resolution and notice provisions. Their practical effect depends on the complete agreement and the law that applies.",
      "This general educational example is not legal advice and does not describe a verified LEGAL AID LEGAL SERVICES LLC service. For advice on a specific agreement, consult a qualified lawyer in the relevant jurisdiction.",
    ],
    demo: true,
  },
  {
    slug: "property-due-diligence",
    title: "A Clearer View of Property Due Diligence",
    category: "Property Law",
    excerpt:
      "Questions to organize before a property transaction moves from interest to commitment.",
    date: "2026-08-18",
    author: "LEGAL AID LEGAL SERVICES LLC Editorial Team · Demo",
    image: propertyArticleImage,
    body: [
      "Property due diligence is a process of asking the right questions before commitments become difficult to change. The precise inquiries vary by location and transaction.",
      "Buyers and businesses may wish to understand title, permitted use, obligations, costs, timing and the responsibilities set out in transaction documents.",
      "Keep a list of open questions and confirm which specialist professionals are needed. This educational sample is not legal advice and is not jurisdiction-specific.",
    ],
    demo: true,
  },
  {
    slug: "family-law-first-conversation",
    title: "Preparing for a First Family-Law Conversation",
    category: "Family Law",
    excerpt:
      "A respectful first discussion can help identify priorities without oversharing sensitive information.",
    date: "2026-07-30",
    author: "LEGAL AID LEGAL SERVICES LLC Editorial Team · Demo",
    image: familyArticleImage,
    body: [
      "Family-law questions can be personal and complex. Before a first discussion, consider what outcome matters most, what deadlines may exist, and what questions you need answered.",
      "Avoid sending sensitive documents or confidential information through a general website form. Ask about confidentiality and the professional relationship before sharing more than a high-level summary.",
      "This example is general legal education only; it is not advice and does not confirm that the firm provides family-law services.",
    ],
    demo: true,
  },
  {
    slug: "preparing-for-a-first-legal-consultation",
    title: "Preparing for a First Legal Consultation",
    category: "General Legal Education",
    excerpt:
      "A few practical steps can help organize an initial conversation without sending sensitive material through an unverified channel.",
    date: "2026-10-21",
    author: "LEGAL AID LEGAL SERVICES LLC Editorial Team · Demo",
    image: legalConsultationImage,
    body: [
      "A first conversation with a lawyer is often most useful when you can briefly explain the general issue, the outcome you hope to understand, and any dates that may matter. Keep your summary short and avoid sending confidential documents through a general website form.",
      "Before an appointment, make a list of questions about the process, expected next steps, the lawyer's role, fees, and how sensitive information will be handled. If a deadline or hearing is approaching, say so when arranging a conversation and contact a qualified professional in the relevant jurisdiction promptly.",
      "Bring documents only through a channel the lawyer has approved, and ask what information is appropriate to share before a professional relationship has been confirmed. A consultation request is not itself an appointment or an attorney-client relationship.",
      "This illustrative article is general educational information only. It is not legal advice, is not specific to a jurisdiction, and does not confirm that LEGAL AID LEGAL SERVICES LLC provides a particular service.",
    ],
    demo: true,
  },
];

export const categories = [
  "Legal Updates",
  "Corporate Law",
  "Property Law",
  "Business Advisory",
  "Family Law",
  "General Legal Education",
];
export const practiceTypes = practiceAreas.map(item => item.title);
