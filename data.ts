import { Course, FAQItem, Testimonial, GalleryItem } from "./types";

export const ACADEMY_LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFPufmUKZ-jAfH4uULaRGU1Ln1fvFzs3jTof3CFBMFL1m6LFUhMYRUDUKEFHbEnzfbe2HzghfEXEYvzY7rcnVn4Oz3ovP-d54ZNBt--NHJ33m6OguAM1oIlv-HFWaJfvODVsB3L5va5vDGPkZZ8R3YOeQfO6uFKAp37u2f1siCZyU7EiKMHNRTnFOKWMZdDS4AzT3-e16ocVJC0plWkAQZiOQztn9HEdCPmurmvCX9PkEFtnfAlg0nO9LgGxcTy2AnUfs4OX_oMvs1";

export const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcvZRRFQkij2DM7NUMkK-5V_OYifZKR5flLvj1doQYAL4jg9inz3LGawprmxINMXmokkr2clwVRQR1Uo1gHxdlfZK1DTCcK1rnpsM2z0wW-yLL5zbeaKVcy-6KwK61G48GK-FvC4Zog-BHpPUg86Xfvl7O3V52qZ6DuI1u1GBySfJkdlUYm6Nfwn7gIhW5FqfXkn21wyhcYAnfTPIw7j7cQywnys0HfnxHIC-1gUEZMjezJNyeykWDFJ14bulGoNw8VnyaxESgZnhy";

export const MAP_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCS-xjOMmfp3qjNM63AkveZsTA6k_sdJ9cTMBa3OCrj3UJmXn_vBV7fX2voXKXND-vavcEZhobFCDkwMcXCe9WeqGN6eowKGTzWvMd9ucpLcWYpUdS7lae5XKVI3-JZVZiZfyFJRz8PScNoaDWh2dOLuHpxNGXWsbmLRxi5lYDkO4Qm-B4MnQM4iCYuV4InrlQgd49Z8gPAqrl1907pDSTHCNUcejgUb98teD-FST67lcgmEIuhg13FYSvHyarPDWkCmcSPIvvbNrV9";

export const COURSES: Course[] = [
  {
    id: "grade-1-11",
    title: "Grade 1-11 English",
    description: "Comprehensive school curriculum support to excel in local and international exams.",
    longDescription: "Our school English syllabus program is custom-tailored to help school-going kids from Grade 1 to 11 gain ultimate mastery over their school textbooks, literature, composition guidelines, and grammar criteria. We ensure thorough exam preparation and regular progress monitoring.",
    syllabus: [
      "School Textbook Alignment & Reading Practice",
      "Creative Writing, Essay Writing & Letter Formats",
      "Local & Cambridge / Edexcel Exam Mock Papers",
      "Essential Vocabulary & Spelling Mastery Exercises"
    ],
    duration: "Ongoing (Monthly Cycles)",
    priceInfo: "$15 / Month",
    level: "Beginner",
    icon: "BookOpen"
  },
  {
    id: "spoken-english",
    title: "Spoken English",
    description: "Build fluency and confidence through practical conversation-based learning.",
    longDescription: "Ditch the stage fright! Spoken English classes are heavy on interactions, debates, roleplaying, speech giving, and presentation simulations. We design an immersive environment focusing entirely on native phonics, intonations, and vocabulary for spontaneous daily life conversations.",
    syllabus: [
      "Overcoming Stage Fright & Public Speaking Skills",
      "Phonics, Pronunciation & Word Stress Drills",
      "Conversations in Diverse Contexts (Cafe, Office, Travel)",
      "Daily Idiomatic Phrases & Modern Slang Comprehension"
    ],
    duration: "3 Months (2 sessions per week)",
    priceInfo: "$25 / Month",
    level: "Intermediate",
    icon: "MessageSquare"
  },
  {
    id: "grammar-master",
    title: "Grammar Master",
    description: "Master the structural foundation of English for flawless writing and speaking.",
    longDescription: "A bulletproof foundation is key. This class breaks down difficult grammar guidelines into simple, modular rules. From tenses to relative clauses and conditional structures, you will learn to structure perfect emails, formal documentations, and clean paragraphs.",
    syllabus: [
      "All 12 English Tenses & Active vs. Passive Voice",
      "Subject-Verb Agreement & Error Identification Methods",
      "Complex & Compound Sentence Structuring",
      "Punctuation Rules & Style Guides for Formal Writing"
    ],
    duration: "2 Months Intensive",
    priceInfo: "$20 / Month",
    level: "Intermediate",
    icon: "Award"
  },
  {
    id: "adult-english",
    title: "Adult English Course",
    description: "Tailored lessons for working professionals and adult learners seeking advancement.",
    longDescription: "Geared towards job-seekers, executives, and adult learners who need English to advance in their careers. Learn to draft high-converting proposals, present projects, draft corporate emails, network, and excel in interviews with confidence.",
    syllabus: [
      "Job Interview Simulations & Professional CV Preparation",
      "Corporate Communication Etiquette & Email Drafting",
      "Delivering Power Presentations & Project Explanations",
      "Global Networking, Small Talk & Business Idioms"
    ],
    duration: "4 Months Certification",
    priceInfo: "$30 / Month",
    level: "Advanced",
    icon: "Briefcase"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "The lessons are so interactive! I used to be shy about my English, but now I can speak confidently in my office meetings.",
    name: "Sarah Johnson",
    role: "Adult English Student",
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoS58uVuL_2pyqSaNTNw_GIkqwKYuz--wO-3LsFFAzT7Ynb_soZ0jxhcsPrSsxmyuzB65z21AsnwCz73uD4QDaL1iehZaAo1MTn4utcxlA3O1e13N-cOnsQHORE2zJZQlsqTrggTqdD6T4nOfnAYmjBrdNCUnrUFaw_3Er_xgSHj0S-hig36s30W1TwJdHWVj69KatLbDkVQNWgqzlr5xcXc3UMSHrt8esSebSkKLTMJdlufX8loazMh2DAIz1Kzb20RCDk7WYie27"
  },
  {
    id: 2,
    quote: "My grades improved from a C to an A in just one term. The teachers here really know how to explain difficult grammar rules.",
    name: "Ahmed Razak",
    role: "Grade 11 Student",
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB93-_3J6yb9PqvxpgefrQApaIijgIqwzL4IYwLgtk81r-YwI6eH4SwOrW4fxRMsfEoPYklRYRBBkRjPbYUeMJRRAxxISgF7EQa4wn6CNwfv89L_xqHmt5iipwjevEHsBtrco9zgzQ-7pDHtwrzl1-sfi04xkS5IQ5DYNDYRCt2Oo2-n3AAD35wuC1ZqQvzkdQkh-d86PGw9ImDM8UbMj4dTuyBbFr6VRIBGbHyFOLMpS3ENqPVjzpUtEnKykJtildgWuS8KEaqJ-8E"
  }
];

export const GALLERY: GalleryItem[] = [
  {
    id: 1,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSoSGiptqItgssO_JPXOwCH4_bVxjOmZ1VSzgpAu46Jy0iiwr0tZedpCPVW2yVB7cZFwM4g4Pd_q8pkH0Z9FneZKOFPoSGJTitGxTJhiuTA7_hsMRzQJgOjinr86Fi6jVBEj73WXQJtg4pTovUEDgzNp8GqAEGM_bSFpuTELV2hxviy25w1-Ius72CUC_LmuWGO76CRqfqq7FJgo5OlqdasJmwhbqTOAj9locrlpUR1AUnYUJC32zk1KPlYp0gi4bFzoiWJuD9qYab",
    title: "Vibrant Classroom Discussions",
    desc: "Collaborative learning setting filled with colorful visuals and modern tools."
  },
  {
    id: 2,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7JADgop1GohGUuzrycRXIyMVnGpFoZzPMau3KN2Sm3lt8seLp2IBUtfZUgHOXGs_vkphwBJfc7QmleJLrq_kMfSCSieA01C1cHYlt7n00wjGRiuPMijyeFh3K17cWxa_qWySlmGTJxGt3DABmaREJcdUTOLEkxve4MC3fBhZ-mRS-TerasVCf7PTbVtaqRWuZaAiT7oRsTrKhmnwH4pfmfju1J_YcOyR-GjIYx1WNeQAFqr40uEBZyKNOXvbQ3K4zkn09KEKluXjM",
    title: "Online Interactive Whiteboards",
    desc: "Remote learning interface bridging distance with top digital classroom structures."
  },
  {
    id: 3,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKOfHRMwP05nTEBwq08QEJ2h8QUUIcM3ymxflGxNCseYP1O69B9CMfcoQHOKgMR_lS_hbZoUlnh4y83O9oUaJWEvouAktfz_8LaxiiPrj07OkvFgjeJ2p7ncVZjzvprnmBDvINLhiBMnHpyunJVBGRF-EMZRcroi7Habh7uSP4kZzetdjgy4TevEjpMURu5etqvrj4xSLVDQKJHjK4EY6W6A8I2NidjRP1oMcTeYIyKUcKXLqTEeXoJ9JB7lijITOGjDN08IwvAewI",
    title: "Confidence in Presentations",
    desc: "Students practicing real public speaking at the lectern before their peers."
  },
  {
    id: 4,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQoMMh3wgnrcvsQzHu3zlt81fjzyelcMgPpEpybn9Slu40R4u_ZiF7MCCLj5ZUZFdk35lqiarMKaf7wXgiARc4AcSoeg89A2yfRRdW5Wj0wyoHe5k4kS-QpBGGlKjo1yvYO0_SZLbCKxd9xXXNBwf4lNG5WMehLCJYKyuQSy15buI66n4tYF5GIL5yFahhxC2_OJ_iugU2p-0AX0ix0Z0cR1pVCwVyJAdhxHSRX14fnHAKZSUSxHEav2CbFt4HbWCHOjjmp2nSGdjz",
    title: "Graduation & Award Ceremonies",
    desc: "Celebrating our students achieving certificate completion with glowing smiles."
  },
  {
    id: 5,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAJ8mTY6FSzCZhnIm3jUvSDLiSsQUZKFW5m8vRp34nKv0OnSaWAcVZGI65T-pQPQVuj1m2n2L8zfHSJWo-66epd4fZv1PlMO6JIJw73rN8y4OhnD3-gYGNygQAKK4FjCt2lPYL5KXg06LQRnpSurF3FxTP7Udiy2OFcOjgBzyPG0ped4BwY_mPWs8rc_KSk6jOEPpp-ZDk4V9qirlA0pP8-eAJhOI3EmTwNfV8CeDGfVQZK0OxIgCxaBxTAKq70cfnNlQMTJOAf8UD",
    title: "Relaxed Academy Lounges",
    desc: "A warm and friendly community lounge filled with plants for casual chat practice."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "How can I enroll in a course?",
    answer: "You can enroll by visiting our academy in Colombo, Sri Lanka, or simply by filling out our interactive Online Enrollment Form right here on this website. Our team will then reach out to schedule a diagnostic chat and place you in the perfect batch!"
  },
  {
    id: 2,
    question: "What grades do you cover?",
    answer: "We provide comprehensive school English syllabus support for students starting from Grade 1 up to Grade 11. This includes covering all core grammar, prose, essay-writing, vocabulary, and preparation for local and Cambridge/Edexcel O-Level examinations."
  },
  {
    id: 3,
    question: "Do you offer evening classes or weekend classes?",
    answer: "Yes, we do! We provide highly flexible timings. We have after-school batches for youngsters, evening weekday batches (6:00 PM - 8:00 PM) for corporate workers and university students, and fully immersive weekend schedules on Saturdays and Sundays."
  },
  {
    id: 4,
    question: "Do you offer both Online and Physical options?",
    answer: "Absolutely. We understand your convenience. Students can choose to join our physical interactive smart classrooms in Colombo, Sri Lanka, or opt for our live, collaborative high-definition Online classrooms utilizing dynamic virtual tools and whiteboard sessions."
  }
];
