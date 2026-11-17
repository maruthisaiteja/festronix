export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  venue: string;
  category: "General" | "Coding" | "Hardware" | "Workshops" | "Gaming" | "Keynote";
  description: string;
  isHighlight?: boolean;
}

export interface DaySchedule {
  dayNumber: 1 | 2;
  dateLabel: string;
  title: string;
  subtitle: string;
  slots: ScheduleItem[];
}

export const FEST_SCHEDULE: DaySchedule[] = [
  {
    dayNumber: 1,
    dateLabel: "DAY 01 // DECEMBER 1, 2026",
    title: "Inauguration, Qualifiers & Arena Kickoffs",
    subtitle: "Inauguration ceremony, flagship marathon launches, and opening rounds across campus room venues.",
    slots: [
      {
        id: "d1-s1",
        time: "08:30 AM – 09:30 AM",
        title: "Delegate Verification & Room Pass Desk",
        venue: "VCE Main Quadrangle & Block Entrances",
        category: "General",
        description: "Registration confirmation, participant badges, and room allocation passes for Day 1 and Both-Days events.",
      },
      {
        id: "d1-s2",
        time: "09:30 AM – 10:30 AM",
        title: "Grand Festronix '26 Inauguration",
        venue: "Main Auditorium (Air-Conditioned)",
        category: "Keynote",
        description: "Official inaugural address by College Leadership, Student Affairs Cell convenor, and track briefing.",
        isHighlight: true,
      },
      {
        id: "d1-s3",
        time: "10:30 AM – 01:00 PM",
        title: "Morning Arena Wave: Coding, Hardware & Challenge Heats",
        venue: "Designated Campus Venues (Rooms 3020, 2002, 5106, 3213, 1328, GB 2nd Floor)",
        category: "Coding",
        description: "Opening rounds of Smartathon, CAD Mania, Circuit Debugging, Rapid Fire, Lock vs Key, and Squid Game 4.0.",
        isHighlight: true,
      },
      {
        id: "d1-s4",
        time: "11:00 AM – 05:00 PM (Ongoing)",
        title: "Both-Days Flagship Zones Open",
        venue: "Rooms 1001, 1003, 3101, 1325 & 3rd Block Lobby",
        category: "Gaming",
        description: "LAN Gaming Valorant tournament heats, Meta-Minds AR/VR Workshop, Escape Room 2.0, Smart Karts, and ROBO Games arena.",
      },
      {
        id: "d1-s5",
        time: "01:00 PM – 02:00 PM",
        title: "Lunch & Networking Intermission",
        venue: "Campus Dining Zones & Central Food Court",
        category: "General",
        description: "Lunch recess for delegates, participants, and event organizers.",
      },
      {
        id: "d1-s6",
        time: "02:00 PM – 05:00 PM",
        title: "Afternoon Arenas: Live Problem Solving & Creative Trials",
        venue: "Rooms 5005-5008, 5009, 3224, 3210, 1002, 3013, 1016, 1321",
        category: "Hardware",
        description: "Electronics Design Hackathon, Live Engineering Arena, Case Files Real Crimes, Werewolf, Short Film Competition, Meme it to Win it, and Brains vs Algorithms.",
        isHighlight: true,
      },
      {
        id: "d1-s7",
        time: "05:00 PM – 05:30 PM",
        title: "Day 1 Results Compilation & Day 2 Finalists Briefing",
        venue: "Respective Room Desks & Notice Boards",
        category: "General",
        description: "Announcement of shortlisted teams for Day 2 finals and presentation slots.",
      },
    ],
  },
  {
    dayNumber: 2,
    dateLabel: "DAY 02 // DECEMBER 2, 2026",
    title: "Championships, Drone Workshop & Grand Valedictory",
    subtitle: "Day 2 arenas, technical workshops, final evaluation rounds, and the gala awards presentation.",
    slots: [
      {
        id: "d2-s1",
        time: "09:00 AM – 10:00 AM",
        title: "Day 2 Arena Roll Call & Workshop Check-In",
        venue: "Respective Block Registration Points",
        category: "General",
        description: "Morning check-in for Day 2 specific arenas and hands-on workshop registrants.",
      },
      {
        id: "d2-s2",
        time: "10:00 AM – 01:00 PM",
        title: "Drone Workshop & Morning Domain Arenas",
        venue: "GB 1st Floor, 5th Block, Rooms 2001, 5106, 1015, 1011, 2106, 2003, 3217",
        category: "Workshops",
        description: "Hands-on Drone Building & Piloting Workshop, Innova MATRIX, Bug Bounty, Treasure Hunt, Tech Charades, Logo Puzzle, and Webathon.",
        isHighlight: true,
      },
      {
        id: "d2-s3",
        time: "10:30 AM – 01:00 PM",
        title: "Both-Days Arenas: Final Play-Offs & Lap Runs",
        venue: "Rooms 1001, 1325/1326, 3rd Block Lobby, 1009, 3010",
        category: "Gaming",
        description: "Valorant Grand Finals, Smart Karts timed lap shootouts, ROBO Games obstacle trials, IPL Auction championship, and Agent Mystery solve.",
        isHighlight: true,
      },
      {
        id: "d2-s4",
        time: "01:00 PM – 02:00 PM",
        title: "Lunch & Project Showcase Recess",
        venue: "Central Dining Pavilion",
        category: "General",
        description: "Afternoon meal recess and informal project networking across department stalls.",
      },
      {
        id: "d2-s5",
        time: "02:00 PM – 04:00 PM",
        title: "Afternoon Arenas: Cyber Forensics & GameDev Sprint",
        venue: "Rooms 1019, 5009, 3005, 1002, 3224, 3rd Block Lobby",
        category: "Coding",
        description: "Cyber Forensics challenge, GameDev Sprint presentations, Speak & Sketch, Technical Short Film screening, and Stack Up showdown.",
      },
      {
        id: "d2-s6",
        time: "04:00 PM – 04:30 PM",
        title: "Grand Smartathon Project Demonstrations & Jury Review",
        venue: "Room 3020 & Computing Centre",
        category: "Coding",
        description: "Final evaluation of working prototypes and software builds before the faculty and alumni jury.",
        isHighlight: true,
      },
      {
        id: "d2-s7",
        time: "04:45 PM – 06:15 PM",
        title: "Grand Valedictory & Festronix '26 Awards Gala",
        venue: "Main Auditorium",
        category: "Keynote",
        description: "Announcement of winners across all 52 arenas, trophy presentations, distribution of certificates, and closing remarks by SAC.",
        isHighlight: true,
      },
    ],
  },
];
