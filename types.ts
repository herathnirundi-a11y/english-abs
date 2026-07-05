export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  syllabus: string[];
  duration: string;
  priceInfo: string;
  level: "All Levels" | "Beginner" | "Intermediate" | "Advanced";
  icon: string; // Key of LucideIcons
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  imgUrl: string;
}

export interface GalleryItem {
  id: number;
  imgUrl: string;
  title: string;
  desc: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "lia";
  text: string;
  timestamp: Date;
}
