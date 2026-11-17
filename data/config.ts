export interface FestConfig {
  name: string;
  year: string;
  tagline: string;
  college: string;
  collegeShort: string;
  organizer: string;
  organizerShort: string;
  location: {
    campus: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: string;
    mapEmbedUrl: string;
    airportDistance: string;
  };
  dates: {
    display: string;
    day1Date: string;
    day2Date: string;
    day1Label: string;
    day2Label: string;
    countdownTarget: string; // ISO string
    note: string;
  };
  registrationUrl: string;
  contact: {
    email: string;
    convenor: { name: string; phone: string };
    techLead: { name: string; phone: string };
    studentWelfare: { name: string; phone: string };
  };
  socials: {
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    discord: string;
    linkedin: string;
  };
  metrics: {
    duration: string;
    eventsCount: string;
    expectedParticipants: string;
    partnerColleges: string;
  };
}

export const FEST_CONFIG: FestConfig = {
  name: "FESTRONIX",
  year: "2026",
  tagline: "A NATIONAL LEVEL TECHNICAL FEST",
  college: "Vardhaman College of Engineering",
  collegeShort: "VCE",
  organizer: "Student Affairs Cell",
  organizerShort: "SAC",
  location: {
    campus: "Kacharam, Shamshabad",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "501218",
    coordinates: "17.2400° N, 78.5200° E",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3811.8!2d78.52!3d17.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba3!2sVardhaman+College+of+Engineering!5e0!3m2!1sen!2sin",
    airportDistance: "25 minutes from Rajiv Gandhi International Airport (RGIA)",
  },
  dates: {
    display: "December 1 & 2, 2026",
    day1Date: "December 1, 2026",
    day2Date: "December 2, 2026",
    day1Label: "Day 01 — Qualifiers, Hackathons & Arenas",
    day2Label: "Day 02 — Championships, Workshops & Valedictory",
    // Countdown targeting December 1, 2026 09:00 IST
    countdownTarget: "2026-12-01T09:00:00+05:30",
    note: "Some events run for a single day while others span both days. Detailed per-hour slot allocations will be finalized closer to December 1.",
  },
  registrationUrl: "https://festronix.in/register",
  contact: {
    email: "festronix@vardhaman.org",
    convenor: { name: "Dr. K. S. Rao (Faculty Convenor)", phone: "+91 98765 43210" },
    techLead: { name: "Student Technical Lead", phone: "+91 98765 43211" },
    studentWelfare: { name: "Student Welfare Desk", phone: "+91 98765 43212" },
  },
  socials: {
    instagram: "https://instagram.com/student_affairs_vce",
    facebook: "https://facebook.com/vardhamancollegehyd",
    twitter: "https://x.com/vardhamanhyd",
    github: "https://github.com/vce-sac",
    discord: "https://discord.gg/festronix",
    linkedin: "https://linkedin.com/school/vardhaman-college-of-engineering",
  },
  metrics: {
    duration: "02 Days",
    eventsCount: "50+ Events",
    expectedParticipants: "2,500+ Participants",
    partnerColleges: "40+ Colleges",
  },
};
