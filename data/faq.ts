export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Registration" | "Logistics" | "Competitions";
}

export const FEST_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "General",
    question: "Who is eligible to participate in Festronix 2026?",
    answer: "Any student currently pursuing an undergraduate (B.Tech, B.E., B.Sc, BCA) or postgraduate (M.Tech, MCA, MBA) degree from a recognized institution with a valid student ID card can participate. Cross-college teams are fully permitted for both hackathons and technical arenas.",
  },
  {
    id: "faq-2",
    category: "Registration",
    question: "Can I participate in multiple events across the two days?",
    answer: "Yes! The event timeline has been choreographed with non-overlapping major slots. You can register for multiple individual or team events, provided their physical rounds do not collide on the official schedule.",
  },
  {
    id: "faq-3",
    category: "Logistics",
    question: "Is accommodation available for outstation participants?",
    answer: "Yes. Supervised campus hostel accommodation (separate secure wings for male and female participants) is available on campus on a first-come reservation basis. Outstation participants can request accommodation directly after securing their arena registration.",
  },
  {
    id: "faq-4",
    category: "Competitions",
    question: "What equipment or hardware must participants bring?",
    answer: "For coding events and the hackathon, bring your personal laptops, chargers, extension strips, and any necessary peripherals. For the Robo Race, bring your assembled rover chassis and battery packs. For circuit debugging and SQL events, high-spec desktop labs and laboratory test benches are provided on-site.",
  },
  {
    id: "faq-5",
    category: "Registration",
    question: "How are event rewards and prize pools distributed?",
    answer: "Each competition and arena features its own independent prize pool, registration fee, and honors. Champions and runners-up receive official trophies, merit grants, and institutional laurels directly during the Day 02 Valedictory Ceremony in the VCE Main Auditorium, accompanied by verified accredited certificates.",
  },
  {
    id: "faq-6",
    category: "General",
    question: "Will all participants receive certificates?",
    answer: "Yes, every registered attendee who participates in at least one competition or keynote receives an official National Level Certificate of Participation accredited by Vardhaman College of Engineering and the Student Affairs Cell.",
  }
];
