export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: "Hackathon" | "Robotics" | "Keynote" | "Crowd";
  accentColor: string;
}

export const FEST_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Midnight Hackathon Hustle",
    caption: "Teams debugging production APIs at 3:00 AM under ambient cyan lighting.",
    category: "Hackathon",
    accentColor: "#00E5FF",
  },
  {
    id: "gal-2",
    title: "Chicane Turn Rover Trial",
    caption: "High-torque four-wheel rovers navigating the sand incline obstacle course.",
    category: "Robotics",
    accentColor: "#10B981",
  },
  {
    id: "gal-3",
    title: "Main Auditorium Keynote",
    caption: "Over 1,200 student engineers gathered for the opening technical symposium.",
    category: "Keynote",
    accentColor: "#3B82F6",
  },
  {
    id: "gal-4",
    title: "Breadboard Oscilloscope Probing",
    caption: "Silicon debug finalists inspecting MHz signal frequencies on Tektronix scopes.",
    category: "Robotics",
    accentColor: "#F59E0B",
  },
  {
    id: "gal-5",
    title: "Grand Trophy Valedictory",
    caption: "Winners hoisting the National Level Festronix Championship Cup.",
    category: "Crowd",
    accentColor: "#EC4899",
  },
  {
    id: "gal-6",
    title: "Figma UI/UX Critique Circle",
    caption: "Designers presenting design systems and component tokens to senior jury mentors.",
    category: "Hackathon",
    accentColor: "#8B5CF6",
  }
];

export interface SponsorItem {
  id: string;
  name: string;
  tier: "Title Sponsor" | "Associate Sponsor" | "Ecosystem Partner" | "Platform Partner";
  category: string;
}

export const FEST_SPONSORS: SponsorItem[] = [
  { id: "sp-1", name: "AWS Cloud Club", tier: "Title Sponsor", category: "Cloud & Compute" },
  { id: "sp-2", name: "GitHub Education", tier: "Associate Sponsor", category: "Developer Tools" },
  { id: "sp-3", name: "Red Bull", tier: "Platform Partner", category: "Energy Partner" },
  { id: "sp-4", name: "Postman API", tier: "Associate Sponsor", category: "API Ecosystem" },
  { id: "sp-5", name: "Unstop", tier: "Platform Partner", category: "Official Ticketing" },
  { id: "sp-6", name: "Polygon Labs", tier: "Ecosystem Partner", category: "Web3 Grants" },
  { id: "sp-7", name: "Intel Student Lab", tier: "Ecosystem Partner", category: "Hardware Kits" },
  { id: "sp-8", name: "JetBrains", tier: "Associate Sponsor", category: "IDE Licenses" },
];
