export interface Faculty {
  id: string;            // slug used in URL
  name: string;
  description: string;
  whoFor: string;
  icon: string;
  tagline: string;
  areas: string[];
}


export const faculties: Faculty[] = [
  {
    id: "business-management",
    name: "Business & Management",
    icon: "📊",
    tagline: "Build leadership, strategy, and entrepreneurial skills.",
    description:
      "The Business & Management faculty prepares learners for leadership roles across industries. It focuses on strategic thinking, problem-solving, entrepreneurship, finance, and organizational development.",
    whoFor:
      "Ideal for students who want to become managers, consultants, entrepreneurs, or business analysts.",
    areas: [
      "Business Administration & Management",
      "Marketing & Brand Management",
      "Entrepreneurship & Innovation",
      "Human Resource Management",
      "International Business",
      "Supply Chain & Logistics",
      "Leadership & Organizational Behaviour",
    ],
  },
  {
    id: "science-technology",
    name: "Science & Technology",
    icon: "🧬",
    tagline: "Explore innovation, engineering, and cutting-edge technology.",
    description:
      "This faculty empowers students to explore modern scientific developments, engineering innovations, and emerging technological solutions that shape the future.",
    whoFor:
      "Best suited for students interested in research, engineering, programming, or building tech-based solutions.",
    areas: [
      "Computer Science & Information Technology",
      "Software Engineering & Development",
      "Electronics, Electrical & Mechanical Engineering",
      "Data Science, AI & Machine Learning",
      "Biotechnology & Applied Sciences",
      "Cybersecurity & Network Management",
      "Environmental Science & Applied Research",
    ],
  },
  {
    id: "health-medicine-nursing",
    name: "Health, Medicine & Nursing",
    icon: "🩺",
    tagline: "Serve communities through healthcare and medical science.",
    description:
      "Designed for future healthcare professionals, this faculty builds strong medical knowledge, clinical skills, and ethical patient-care foundations.",
    whoFor:
      "Perfect for students dedicated to improving patient health, community wellbeing, or public health systems.",
    areas: [
      "MBBS, Dentistry & Clinical Medicine",
      "Nursing & Midwifery",
      "Pharmacy & Pharmacology",
      "Public Health & Community Health",
      "Physiotherapy & Rehabilitation",
      "Medical Laboratory Technology",
      "Nutrition, Dietetics & Health Promotion",
    ],
  },
  {
    id: "law-governance",
    name: "Law & Governance",
    icon: "⚖️",
    tagline: "Understand justice, policy, rights, and public leadership.",
    description:
      "This faculty provides academic and practical insight into legal systems, good governance, public policy, and justice administration at national and international levels.",
    whoFor:
      "Best for students passionate about advocacy, legal practice, public service, diplomacy, and policy development.",
    areas: [
      "Bachelor & Master of Laws (LLB / LLM)",
      "Constitutional & Administrative Law",
      "Criminal Law & Criminology",
      "International Law & Human Rights",
      "Public Administration & Governance",
      "International Relations & Diplomacy",
      "Conflict, Peace & Development Studies",
    ],
  },
  {
    id: "accounting-professional",
    name: "Accounting & Professional Courses",
    icon: "💼",
    tagline: "Master numbers, compliance, and global professional pathways.",
    description:
      "Focused on financial systems, auditing, taxation, business law, and international professional certifications that open doors to global careers.",
    whoFor:
      "Ideal for students aiming for careers in accounting, finance, banking, auditing, or corporate advisory.",
    areas: [
      "Accounting & Financial Management",
      "Auditing & Assurance",
      "Taxation & Business Law",
      "Chartered Accountancy (CA)",
      "ACCA, CIMA, CPA & other certifications",
      "Financial Analysis & Reporting",
      "Risk Management & Compliance",
    ],
  },
  {
    id: "arts-humanities-education",
    name: "Arts, Humanities & Education",
    icon: "📚",
    tagline: "Develop thinkers, educators, communicators, and creators.",
    description:
      "This faculty develops critical thinkers, educators, researchers, and creative professionals with strong cultural and communication skills.",
    whoFor:
      "Great for students interested in teaching, social research, writing, communication, and creative industries.",
    areas: [
      "Education, Pedagogy & Teacher Training",
      "Psychology, Sociology & Social Work",
      "English, Literature & Linguistics",
      "Mass Communication & Journalism",
      "History, Philosophy & Cultural Studies",
      "Development Studies & Gender Studies",
      "Creative Writing & Media Studies",
    ],
  },
  {
    id: "agriculture-environment",
    name: "Agriculture & Environment",
    icon: "🌱",
    tagline: "Shape sustainable food systems and environmental solutions.",
    description:
      "This faculty focuses on sustainable agriculture, food security, natural resources, and climate-resilient development.",
    whoFor:
      "Ideal for students passionate about sustainability, food systems, climate action, and environmental conservation.",
    areas: [
      "Agricultural Science & Agribusiness",
      "Forestry & Natural Resource Management",
      "Environmental Science & Ecology",
      "Soil, Plant & Animal Science",
      "Food Technology & Post-Harvest Management",
      "Climate Change & Disaster Risk Reduction",
      "Sustainable Development & Rural Innovation",
    ],
  },
  {
    id: "hospitality-tourism",
    name: "Hospitality & Tourism",
    icon: "🏨",
    tagline: "Create exceptional experiences in global service industries.",
    description:
      "The Hospitality & Tourism faculty trains students to excel in hotel management, travel operations, culinary arts, and tourism entrepreneurship.",
    whoFor:
      "Perfect for students who enjoy people-focused roles and want careers in hotels, restaurants, airlines, travel agencies, or tourism organisations.",
    areas: [
      "Hotel & Hospitality Management",
      "Travel & Tourism Management",
      "Culinary Arts & Professional Cookery",
      "Event & Conference Management",
      "Airlines, Cruise & Service Operations",
      "Resort & Destination Management",
      "Tourism Entrepreneurship & Eco-tourism",
    ],
  },
];