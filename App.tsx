import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Users,
  Smile,
  CreditCard,
  BookOpen,
  MessageSquare,
  Award,
  Briefcase,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle,
  X,
  Loader2,
  Check,
  Menu,
  Compass
} from "lucide-react";
import { Course, FAQItem, Testimonial, GalleryItem, QuizQuestion, ChatMessage } from "./types";
import {
  ACADEMY_LOGO_URL,
  HERO_IMAGE_URL,
  MAP_IMAGE_URL,
  COURSES,
  TESTIMONIALS,
  GALLERY,
  FAQS
} from "./data";

export default function App() {
  // Mobile navigation menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sticky header class
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Course Detail Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Enrollment Modal
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    remarks: "",
    mode: "Online Classroom"
  });
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollResponse, setEnrollResponse] = useState<{
    success: boolean;
    refId?: string;
    message?: string;
  } | null>(null);

  const openEnroll = (courseId: string) => {
    const course = COURSES.find((c) => c.id === courseId);
    setEnrollForm({
      name: "",
      email: "",
      phone: "",
      course: course ? course.title : COURSES[0].title,
      remarks: "",
      mode: "Online Classroom"
    });
    setEnrollResponse(null);
    setIsEnrollOpen(true);
    setMobileMenuOpen(false);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollLoading(true);
    setEnrollResponse(null);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollForm)
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollResponse({
          success: true,
          refId: data.refId,
          message: data.message
        });
      } else {
        setEnrollResponse({
          success: false,
          message: data.error || "Failed to process enrollment. Please try again."
        });
      }
    } catch (err) {
      setEnrollResponse({
        success: false,
        message: "Network error. Please check your internet connection and try again."
      });
    } finally {
      setEnrollLoading(false);
    }
  };

  // Gallery Lightbox
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact Message form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactLoading(true);
    // Simulate submission
    setTimeout(() => {
      setContactLoading(false);
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setContactSubmitted(false), 5000);
    }, 1000);
  };

  // Newsletter form
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSubmitted(false), 5000);
  };

  // ==================== AI COACH & PLACEMENT TEST PANEL STATE ====================
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiActiveTab, setAiActiveTab] = useState<"chat" | "test">("chat");

  // --- AI Chat States ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "lia",
      text: "Hello! I am Lia, your AI English Coach and Academic Advisor at LET'S TALK. 🌸 How can I help you improve your English today? Ask me about our courses, schedule, placement level, or get a helpful grammar tip!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading, aiPanelOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsgText = chatInput;
    setChatInput("");

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: userMsgText,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      // Limit history to last 6 messages to keep payloads optimized
      const formattedHistory = chatMessages
        .slice(-6)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsgText, history: formattedHistory })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: "msg-ai-" + Date.now(),
            role: "lia",
            text: data.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Failed reply");
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: "msg-ai-err-" + Date.now(),
          role: "lia",
          text: "I experienced a small hiccup connecting to the server. Please verify your GEMINI_API_KEY is configured correctly, or try sending again! I am always here to help you.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- Placement Quiz States ---
  const [quizLevel, setQuizLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizExplanationOpen, setQuizExplanationOpen] = useState<Record<number, boolean>>({});
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null);

  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizExplanationOpen({});
    setRecommendedCourse(null);

    try {
      const res = await fetch("/api/placement-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: quizLevel })
      });
      const data = await res.json();
      if (res.ok && data.quiz && Array.isArray(data.quiz)) {
        setQuizQuestions(data.quiz);
      } else {
        throw new Error(data.error || "Failed to load quiz");
      }
    } catch (err) {
      // Fallback offline quiz questions if api fails
      const fallbackQuizzes: Record<string, QuizQuestion[]> = {
        Beginner: [
          {
            id: 1,
            question: "Choose the correct sentence:",
            options: ["She have a red car.", "She has a red car.", "She is have a red car.", "She having a red car."],
            correctAnswer: "She has a red car.",
            explanation: "For third-person singular (he, she, it), we use 'has' for possession."
          },
          {
            id: 2,
            question: "I ________ to the English academy every Saturday.",
            options: ["goes", "going", "go", "wenting"],
            correctAnswer: "go",
            explanation: "Simple present tense for 'I' takes the base verb 'go'."
          }
        ],
        Intermediate: [
          {
            id: 1,
            question: "If I ________ rich, I would travel around the world.",
            options: ["am", "was", "were", "will be"],
            correctAnswer: "were",
            explanation: "This is a second conditional sentence. We use 'were' for all subjects in the hypothetical if-clause."
          },
          {
            id: 2,
            question: "By the time the teacher arrived, the students ________ the essay.",
            options: ["finished", "have finished", "had finished", "finish"],
            correctAnswer: "had finished",
            explanation: "The past perfect 'had finished' is used to show an action that completed before another past event."
          }
        ],
        Advanced: [
          {
            id: 1,
            question: "Hardly ________ the lecture begun when the electricity went out.",
            options: ["had", "did", "has", "was"],
            correctAnswer: "had",
            explanation: "Inverted negative structures (Hardly had...) require the past perfect auxiliary 'had' before the subject."
          },
          {
            id: 2,
            question: "She acted as though she ________ the answer all along, which was clearly untrue.",
            options: ["knows", "knew", "had known", "has known"],
            correctAnswer: "had known",
            explanation: "The subjunctive mood with 'as though' refers to an untrue past condition, requiring 'had known'."
          }
        ]
      };
      setQuizQuestions(fallbackQuizzes[quizLevel] || fallbackQuizzes.Intermediate);
    } finally {
      setQuizLoading(false);
    }
  };

  const selectOption = (questionId: number, option: string) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleQuizSubmit = () => {
    if (quizQuestions.length === 0 || quizSubmitted) return;
    setQuizSubmitted(true);

    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePct = (correctCount / quizQuestions.length) * 100;

    // Determine recommended course
    let recommended: Course | null = null;
    if (quizLevel === "Beginner") {
      recommended = COURSES.find((c) => c.id === "grade-1-11") || COURSES[0];
    } else if (quizLevel === "Intermediate") {
      if (scorePct >= 60) {
        recommended = COURSES.find((c) => c.id === "spoken-english") || COURSES[1];
      } else {
        recommended = COURSES.find((c) => c.id === "grammar-master") || COURSES[2];
      }
    } else {
      recommended = COURSES.find((c) => c.id === "adult-english") || COURSES[3];
    }
    setRecommendedCourse(recommended);
  };

  const toggleExplanation = (id: number) => {
    setQuizExplanationOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to map string icon name to Lucide Component
  const renderCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="w-8 h-8" />;
      case "MessageSquare":
        return <MessageSquare className="w-8 h-8" />;
      case "Award":
        return <Award className="w-8 h-8" />;
      case "Briefcase":
        return <Briefcase className="w-8 h-8" />;
      default:
        return <BookOpen className="w-8 h-8" />;
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans overflow-x-hidden min-h-screen">
      {/* HEADER SECTION */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "glass border-b border-outline-variant/30 shadow-md py-3"
            : "bg-transparent py-5"
        }`}
        id="app-header"
      >
        <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
          {/* Logo / Brand */}
          <a
            href="#hero"
            className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
            id="logo-link"
          >
            <img
              alt="LET'S TALK Logo"
              className="h-10 w-10 object-contain rounded-full border border-primary/20 bg-white p-0.5"
              src={ACADEMY_LOGO_URL}
            />
            <span className="font-display font-extrabold text-xl md:text-2xl tracking-tighter text-primary">
              LET'S TALK
            </span>
          </a>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
            <a
              className="text-on-surface font-semibold hover:text-primary transition-colors py-1"
              href="#hero"
            >
              Home
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1"
              href="#about"
            >
              About
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1"
              href="#courses"
            >
              Courses
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1"
              href="#gallery"
            >
              Life at Academy
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1"
              href="#faqs"
            >
              FAQs
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1"
              href="#contact"
            >
              Contact
            </a>
          </nav>

          {/* Nav Right CTAs */}
          <div className="flex items-center gap-3" id="header-ctas">
            <button
              onClick={() => {
                setAiActiveTab("test");
                setAiPanelOpen(true);
              }}
              className="hidden lg:flex items-center gap-2 border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
              id="btn-nav-test"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Free Placement Quiz</span>
            </button>

            <button
              onClick={() => openEnroll("")}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-95 transition-all"
              id="btn-nav-enroll"
            >
              Enroll Now
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-on-surface p-1 hover:bg-surface-container rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4 space-y-3 shadow-inner"
              id="mobile-nav-menu"
            >
              <a
                className="block text-on-surface font-semibold hover:text-primary py-2"
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                className="block text-on-surface-variant font-medium hover:text-primary py-2"
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                className="block text-on-surface-variant font-medium hover:text-primary py-2"
                href="#courses"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </a>
              <a
                className="block text-on-surface-variant font-medium hover:text-primary py-2"
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
              >
                Life at Academy
              </a>
              <a
                className="block text-on-surface-variant font-medium hover:text-primary py-2"
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQs
              </a>
              <a
                className="block text-on-surface-variant font-medium hover:text-primary py-2"
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setAiActiveTab("test");
                    setAiPanelOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 border border-primary/30 w-full bg-primary/5 text-primary py-2.5 rounded-lg font-semibold text-sm"
                  id="btn-mobile-quiz"
                >
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>Free Placement Quiz</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative pt-32 pb-20 md:py-36 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden"
        id="hero"
      >
        <div className="space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-secondary-container/15 text-secondary border border-secondary-container/30 px-4 py-1.5 rounded-full" id="hero-badge">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-xs font-bold tracking-wider uppercase">
              #1 English Academy in Sri Lanka
            </span>
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-on-surface leading-tight tracking-tight">
            Master English with <span className="text-primary relative inline-block">
              Confidence
              <span className="absolute left-0 bottom-1 w-full h-2 bg-secondary-container/20 -z-10 rounded-sm"></span>
            </span>
          </h1>

          <p className="font-sans text-lg text-on-surface-variant leading-relaxed max-w-xl">
            Join <strong>LET'S TALK ENGLISH ACADEMY</strong> and develop outstanding English speaking, grammar, writing, reading, and listening skills through engaging online and physical classrooms.
          </p>

          <div className="flex flex-wrap gap-4 pt-4" id="hero-actions">
            <button
              onClick={() => openEnroll("")}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold shadow-soft hover:bg-primary/95 hover:shadow-lg active:scale-95 transition-all text-sm"
              id="btn-hero-enroll"
            >
              Enroll Now
            </button>
            <button
              onClick={() => {
                setAiPanelOpen(true);
                setAiActiveTab("chat");
              }}
              className="bg-white border-2 border-primary text-primary hover:bg-primary-fixed/25 px-8 py-3.5 rounded-xl font-bold active:scale-95 transition-all text-sm flex items-center gap-2"
              id="btn-hero-chat"
            >
              <Sparkles className="w-4 h-4 text-primary animate-bounce" />
              <span>Chat with AI Coach</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-outline-variant/30 max-w-md" id="hero-highlights">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                <img src={TESTIMONIALS[0].imgUrl} alt="student" className="w-full h-full object-cover" />
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-400 border-2 border-white overflow-hidden">
                <img src={TESTIMONIALS[1].imgUrl} alt="student" className="w-full h-full object-cover" />
              </div>
              <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold border-2 border-white flex items-center justify-center">
                1K+
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Trusted by 1000+ Students</p>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="font-bold text-secondary">4.9/5</span> Average Rating
                <span className="flex text-secondary-container">
                  <Star className="w-3 h-3 fill-secondary-container text-secondary-container" />
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative group lg:ml-6" id="hero-image-container">
          <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-soft border border-outline-variant/30 aspect-square md:aspect-video lg:aspect-square">
            <img
              alt="Academy Learning Session"
              className="relative w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
              src={HERO_IMAGE_URL}
            />
            {/* Floating Live Badge */}
            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              LIVE CLASSES
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 glass p-4 rounded-xl shadow-lg border border-white/60 hidden md:block max-w-xs animate-bounce-slow" id="hero-floating-badge">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6 text-on-secondary-container" />
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface leading-snug">Expert Certified Educators</p>
                <p className="text-xs text-on-surface-variant">Decades of international experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-primary text-on-primary shadow-inner" id="stats-banner">
        <div className="px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-4xl md:text-5xl" id="stat-students">
              1000+
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed/80">
              Happy Students
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-4xl md:text-5xl" id="stat-courses">
              12+
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed/80">
              Expert Courses
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-4xl md:text-5xl" id="stat-success">
              95%
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed/80">
              Success Rate
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-4xl md:text-5xl" id="stat-years">
              8+
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed/80">
              Years Experience
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-surface-container-low" id="about">
        <div className="px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-block bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Welcome to Let's Talk
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-background">
              Our Educational Mission
            </h2>
            <p className="font-sans text-on-surface-variant text-base leading-relaxed">
              Empowering global learners with practical linguistic skills, interactive speaking practice, and the unwavering confidence to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="about-cards-grid">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:translate-y-[-5px] transition-all duration-300 group hover:border-primary/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Qualified Teachers
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Learn from certified Native and Bilingual professionals passionate about your linguistic success.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:translate-y-[-5px] transition-all duration-300 group hover:border-primary/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Interactive Learning
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Ditch the boring lectures. Speak, debate, play games, and presentation build with peer support.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:translate-y-[-5px] transition-all duration-300 group hover:border-primary/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Friendly Environment
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A warm, safe space where making speech mistakes is celebrated as progress. Boost confidence daily.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-soft hover:translate-y-[-5px] transition-all duration-300 group hover:border-primary/50">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Affordable Fees
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Top-quality, premier curriculum accessible to everyone with highly flexible monthly installment plans.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-y-3 gap-x-8 text-on-surface-variant font-semibold text-sm pt-4 border-t border-outline-variant/20" id="about-bullets">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Small class sizes
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Online &amp; physical classes
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Cambridge exam support
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Conversational emphasis
            </span>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12" id="courses">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/20 pb-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-block bg-secondary-container/20 text-on-secondary-container px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
              Skill Advancement
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-background">
              Explore Our English Programs
            </h2>
            <p className="font-sans text-on-surface-variant text-base leading-relaxed">
              From absolute basic communication to advanced corporate executive speech patterns, select the track suited for your growth.
            </p>
          </div>
          <button
            onClick={() => {
              setAiActiveTab("test");
              setAiPanelOpen(true);
            }}
            className="text-primary font-bold flex items-center gap-1.5 hover:underline text-sm shrink-0 hover:gap-2 transition-all"
            id="btn-all-courses-quiz"
          >
            <span>Unsure? Let our AI Quiz evaluate you</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="courses-grid">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-xl border border-outline-variant/30 shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
              id={`course-card-${course.id}`}
            >
              <div className="p-6 space-y-4">
                <div className="w-14 h-14 bg-primary-fixed/30 text-primary flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  {renderCourseIcon(course.icon)}
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 ${
                    course.level === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : course.level === "Intermediate"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {course.level}
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant border-t border-dashed border-outline-variant/40 pt-3">
                  <span>{course.duration}</span>
                  <span className="text-primary font-bold">{course.priceInfo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-2 border border-outline hover:bg-surface-container-low text-on-surface rounded-lg font-bold text-xs transition-colors"
                  >
                    Syllabus
                  </button>
                  <button
                    onClick={() => openEnroll(course.id)}
                    className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:bg-primary/95 transition-colors"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-surface-container-low" id="why-choose-us">
        <div className="px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-extrabold text-3xl text-on-background">
              Why LET'S TALK is different?
            </h2>
            <div className="w-16 h-1 bg-secondary-container mx-auto rounded-full"></div>
            <p className="text-sm text-on-surface-variant">
              We stand for practical language use rather than rote memorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="why-choose-grid">
            <div className="p-6 rounded-xl bg-white border border-outline-variant/20 shadow-soft flex items-start gap-4 hover:border-primary/30 transition-colors">
              <span className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-bold text-base text-on-surface mb-1">
                  Small Batches Only
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We limit our classroom batches to 15 students to guarantee individual evaluation and extensive speech practice.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-outline-variant/20 shadow-soft flex items-start gap-4 hover:border-primary/30 transition-colors">
              <span className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                <MessageSquare className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-bold text-base text-on-surface mb-1">
                  Intense Oral Speaking
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Over 70% of class hour is dedicated to active talking, debates, and dynamic presentations instead of silent reading.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-outline-variant/20 shadow-soft flex items-start gap-4 hover:border-primary/30 transition-colors">
              <span className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                <Compass className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-bold text-base text-on-surface mb-1">
                  Dual Classroom Delivery
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Seamlessly toggle between physically attending our high-tech Colombo campus or joining our smart interactive remote streams.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-outline-variant/20 shadow-soft flex items-start gap-4 hover:border-primary/30 transition-colors">
              <span className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                <Smile className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-bold text-base text-on-surface mb-1">
                  Confidence Coaching
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Our custom syllabus incorporates public-speaking psychology to help students dismantle speech fear and social anxiety.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-outline-variant/20 shadow-soft flex items-start gap-4 hover:border-primary/30 transition-colors">
              <span className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                <Award className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-bold text-base text-on-surface mb-1">
                  IELTS / Exam Mastery
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We integrate test-taking strategies to naturally groom school students for school O-level or IELTS certifications.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-outline-variant/20 shadow-soft flex items-start gap-4 hover:border-primary/30 transition-colors">
              <span className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                <Sparkles className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-bold text-base text-on-surface mb-1">
                  AI Companion Support
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Students get unlimited free access to our Gemini-powered chat companion for homework support and immediate grading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-surface-container" id="testimonials">
        <div className="px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-extrabold text-3xl text-on-background">
              What Our Students Say
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We have supported hundreds of kids and professionals to transform their fear into absolute fluency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" id="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white p-8 rounded-xl shadow-soft border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <span className="absolute top-6 right-8 text-secondary-container/20 text-7xl font-serif select-none pointer-events-none">
                  “
                </span>
                <div className="space-y-4">
                  <div className="flex text-secondary-container gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary-container text-secondary-container" />
                    ))}
                  </div>
                  <p className="font-sans italic text-on-surface-variant text-base leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/20 mt-6">
                  <div className="w-12 h-12 bg-surface-dim rounded-full overflow-hidden border border-primary/20 shadow-inner shrink-0">
                    <img className="w-full h-full object-cover" src={t.imgUrl} alt={t.name} />
                  </div>
                  <div>
                    <h5 className="font-display font-extrabold text-sm text-on-surface">
                      {t.name}
                    </h5>
                    <p className="text-xs text-on-surface-variant">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12" id="gallery">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-on-background">
            Life at LET'S TALK
          </h2>
          <p className="text-sm text-on-surface-variant">
            Explore active moments, community lounges, and award distributions across our campuses.
          </p>
        </div>

        <div className="masonry" id="gallery-masonry-grid">
          {GALLERY.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="masonry-item relative group rounded-xl overflow-hidden cursor-pointer shadow-soft border border-outline-variant/20"
            >
              <img
                src={item.imgUrl}
                alt={item.title}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <h4 className="font-display font-bold text-sm leading-snug">{item.title}</h4>
                <p className="text-[11px] text-white/80 mt-1 line-clamp-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-surface-container-low" id="faqs">
        <div className="px-6 md:px-12 max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display font-extrabold text-3xl text-on-background">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-on-surface-variant">
              Everything you need to know about enrollment, class modes, and exam criteria.
            </p>
          </div>

          <div className="space-y-4" id="faqs-accordion">
            {FAQS.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="flex justify-between items-center w-full px-6 py-4 text-left font-display font-bold text-sm md:text-base text-on-surface hover:text-primary transition-colors focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-on-surface-variant transition-transform shrink-0 ml-3 ${
                      openFaq === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-outline-variant/10"
                    >
                      <div className="px-6 py-4 text-sm text-on-surface-variant leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-extrabold text-3xl text-on-background mb-3">
                Get In Touch
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Have specific queries about curriculum schedules, adult certification, or corporate discounts? Drop us a line and our academic advisors will get back to you!
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                    Your Name
                  </label>
                  <input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your Full Name"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="name@example.com"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                  Subject
                </label>
                <input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="How can we assist you?"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                  Your Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Write your detailed inquiry here..."
                  rows={4}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={contactLoading}
                className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-bold text-sm shadow-soft hover:bg-primary/95 hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                id="btn-contact-submit"
              >
                {contactLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {contactSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-xs flex items-center gap-2 font-semibold"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Inquiry sent successfully! We will email you back shortly.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="space-y-6 lg:pl-6">
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-soft space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Call Us</p>
                  <p className="font-display font-extrabold text-sm md:text-base text-on-surface">+94 11 234 5678</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Our Location</p>
                  <p className="font-display font-bold text-sm md:text-base text-on-surface">123 Academy Road, Colombo, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Inbox</p>
                  <p className="font-display font-bold text-sm md:text-base text-on-surface">info@letstalk.lk</p>
                </div>
              </div>
            </div>

            {/* Stylized Mock Map */}
            <div className="h-64 rounded-xl border border-outline-variant/30 relative overflow-hidden group shadow-soft">
              <div className="absolute inset-0 grayscale opacity-75 group-hover:grayscale-0 transition-all duration-500">
                <img
                  className="w-full h-full object-cover"
                  src={MAP_IMAGE_URL}
                  alt="Colombo, Sri Lanka Academy Map"
                />
              </div>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary text-white py-1.5 px-4 rounded-lg shadow-lg font-bold text-xs flex items-center gap-2 animate-bounce">
                  <MapPin className="w-4 h-4" />
                  <span>Find Us Here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-surface-container-highest border-t border-outline-variant/30 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 max-w-7xl mx-auto pb-12 border-b border-outline-variant/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img alt="Logo" className="h-8 w-8 rounded-full border border-primary/20" src={ACADEMY_LOGO_URL} />
              <span className="font-display font-black text-lg tracking-tight text-on-surface">
                LET'S TALK
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Bridging the gap between potential and performance through superior English education. Join us online or physically to unleash your future prospects.
            </p>
          </div>

          <div>
            <h6 className="font-display font-extrabold text-xs text-primary mb-4 uppercase tracking-wider">
              Quick Links
            </h6>
            <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#hero">Home</a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#about">About</a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#courses">Courses</a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#gallery">Life at Academy</a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-display font-extrabold text-xs text-primary mb-4 uppercase tracking-wider">
              Programs
            </h6>
            <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#courses">School Support</a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#courses">Fluency Drills</a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#courses">Grammar Mastery</a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#courses">Business English</a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-display font-extrabold text-xs text-primary mb-4 uppercase tracking-wider">
              Newsletter
            </h6>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              Subscribe to get English learning tips and course opening reminders.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-white border border-outline-variant/60 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your email address"
                type="email"
                required
              />
              <button
                type="submit"
                className="bg-primary text-on-primary px-3 rounded-lg hover:bg-primary/95 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <AnimatePresence>
              {newsletterSubmitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-green-700 font-medium mt-1.5"
                >
                  Subscribed successfully!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-on-surface-variant font-medium space-y-1">
          <p>© 2026 LET'S TALK ENGLISH ACADEMY. All rights reserved.</p>
          <p className="text-[10px] text-on-surface-variant/60">Registered Ministry of Education Institute, Sri Lanka.</p>
        </div>
      </footer>

      {/* ==================== FLOATING CHAT BUTTON ==================== */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3" id="floating-coach-panel">
        <motion.button
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-on-primary p-4 rounded-full shadow-lg hover:bg-primary/95 flex items-center gap-2 relative group focus:outline-none"
          id="btn-floating-coach"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          <Sparkles className="w-6 h-6 animate-spin-slow" />
          <span className="hidden md:inline font-bold text-sm pr-1">Lia - AI English Coach</span>
        </motion.button>
      </div>

      {/* ==================== AI COACH & PLACEMENT PANEL (DRAWER) ==================== */}
      <AnimatePresence>
        {aiPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiPanelOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Slide Out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-outline-variant/20"
              id="ai-coach-drawer"
            >
              {/* Header */}
              <div className="p-4 bg-primary text-on-primary flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg border border-white/20">
                    🌸
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm leading-tight">
                      Lia — AI English Coach
                    </h4>
                    <p className="text-[11px] text-primary-fixed/80 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Academy Smart Assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
                  id="btn-close-ai-drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-outline-variant/30 bg-surface-container-low shrink-0">
                <button
                  onClick={() => setAiActiveTab("chat")}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors focus:outline-none ${
                    aiActiveTab === "chat"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Conversational Advisor
                </button>
                <button
                  onClick={() => {
                    setAiActiveTab("test");
                    if (quizQuestions.length === 0) generateQuiz();
                  }}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors focus:outline-none flex items-center justify-center gap-1.5 ${
                    aiActiveTab === "test"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Free Placement Quiz</span>
                </button>
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiActiveTab === "chat" ? (
                  /* CONVERSATIONAL CHATBOX */
                  <div className="flex flex-col h-full space-y-4">
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                      {chatMessages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                              m.role === "user"
                                ? "bg-primary text-on-primary rounded-br-none"
                                : "bg-surface-container text-on-surface rounded-bl-none border border-outline-variant/30"
                            }`}
                          >
                            <p className="font-sans whitespace-pre-line">{m.text}</p>
                            <span className={`block text-[9px] mt-1 text-right ${
                              m.role === "user" ? "text-primary-fixed/70" : "text-on-surface-variant/60"
                            }`}>
                              {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-surface-container rounded-2xl rounded-bl-none p-3.5 border border-outline-variant/30 flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                            <span className="text-xs text-on-surface-variant">Lia is generating response...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0 border-t border-outline-variant/20 pt-3">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type any question..."
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={chatLoading}
                      />
                      <button
                        type="submit"
                        disabled={chatLoading || !chatInput.trim()}
                        className="bg-primary text-on-primary p-2.5 rounded-lg hover:bg-primary/95 disabled:bg-slate-300 transition-colors focus:outline-none shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ) : (
                  /* PLACEMENT TEST QUIZ */
                  <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-xl text-xs space-y-1.5">
                      <h5 className="font-bold text-primary flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Evaluate your current English level
                      </h5>
                      <p className="text-on-surface-variant leading-relaxed text-[11px]">
                        Choose a level to trigger a 5-question multiple choice grammar/vocabulary test. Lia will automatically evaluate and recommend the best academy courses!
                      </p>
                    </div>

                    {/* Level Selector */}
                    {!quizSubmitted && (
                      <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg">
                        {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setQuizLevel(level)}
                            className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all focus:outline-none ${
                              quizLevel === level
                                ? "bg-white text-primary shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-2">
                      <button
                        onClick={generateQuiz}
                        disabled={quizLoading}
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        {quizLoading ? "Generating Quiz..." : "Restart / Generate Quiz"}
                      </button>
                    </div>

                    {quizLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-xs text-on-surface-variant font-medium">Lia is creating customized questions...</p>
                      </div>
                    ) : quizQuestions.length > 0 ? (
                      <div className="space-y-4 pt-2">
                        {quizQuestions.map((q, qIndex) => (
                          <div
                            key={q.id}
                            className={`p-4 rounded-xl border transition-all ${
                              quizSubmitted
                                ? q.correctAnswer === quizAnswers[q.id]
                                  ? "bg-green-50/50 border-green-200"
                                  : "bg-red-50/50 border-red-200"
                                : "bg-white border-outline-variant/30"
                            }`}
                          >
                            <h5 className="font-bold text-xs text-on-surface mb-2">
                              {qIndex + 1}. {q.question}
                            </h5>

                            <div className="space-y-1.5">
                              {q.options.map((opt) => {
                                const isSelected = quizAnswers[q.id] === opt;
                                const isCorrect = q.correctAnswer === opt;
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => selectOption(q.id, opt)}
                                    disabled={quizSubmitted}
                                    className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium border transition-all flex justify-between items-center ${
                                      isSelected
                                        ? quizSubmitted
                                          ? isCorrect
                                            ? "bg-green-100 border-green-500 text-green-900 font-semibold"
                                            : "bg-red-100 border-red-400 text-red-900 font-semibold"
                                          : "bg-primary/10 border-primary text-primary font-semibold"
                                        : quizSubmitted && isCorrect
                                        ? "bg-green-100 border-green-500 text-green-900 font-semibold"
                                        : "bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isCorrect && <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Question feedback / Explanations */}
                            {quizSubmitted && (
                              <div className="mt-3">
                                <button
                                  onClick={() => toggleExplanation(q.id)}
                                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 focus:outline-none"
                                >
                                  <span>{quizExplanationOpen[q.id] ? "Hide explanation" : "Why this is correct?"}</span>
                                  <ChevronDown className={`w-3 h-3 transition-transform ${quizExplanationOpen[q.id] ? "rotate-180" : ""}`} />
                                </button>

                                {quizExplanationOpen[q.id] && (
                                  <p className="text-[10px] text-on-surface-variant mt-1.5 bg-white p-2 rounded border border-dashed border-outline-variant leading-relaxed">
                                    {q.explanation}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Submit Actions / Results */}
                        {!quizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-xs hover:bg-primary/95 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-soft"
                          >
                            Submit Answers
                          </button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-primary text-on-primary rounded-xl text-center space-y-3"
                          >
                            <h4 className="font-display font-black text-sm">
                              Quiz Evaluation Completed!
                            </h4>
                            <div className="text-xs">
                              You answered{" "}
                              <strong>
                                {quizQuestions.filter((q) => quizAnswers[q.id] === q.correctAnswer).length}
                              </strong>{" "}
                              out of <strong>{quizQuestions.length}</strong> correctly.
                            </div>

                            {recommendedCourse && (
                              <div className="bg-white/15 p-3 rounded-lg text-left text-xs space-y-1.5">
                                <p className="text-[10px] font-bold tracking-wider text-primary-fixed uppercase">
                                  Lia's Course Recommendation
                                </p>
                                <h5 className="font-display font-extrabold text-sm">{recommendedCourse.title}</h5>
                                <p className="text-[11px] leading-relaxed text-primary-fixed">
                                  {recommendedCourse.description}
                                </p>
                                <div className="pt-2 flex gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedCourse(recommendedCourse);
                                      setAiPanelOpen(false);
                                    }}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-1.5 px-3 rounded font-bold text-[10px]"
                                  >
                                    Syllabus
                                  </button>
                                  <button
                                    onClick={() => {
                                      openEnroll(recommendedCourse.id);
                                      setAiPanelOpen(false);
                                    }}
                                    className="bg-white text-primary hover:bg-primary-fixed py-1.5 px-3 rounded font-bold text-[10px]"
                                  >
                                    Enroll in Course
                                  </button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant text-center py-6">
                        No questions available. Try generating a quiz.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================== SYLLABUS DETAILS MODAL ==================== */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="fixed inset-0 bg-black"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-outline-variant/30"
            >
              {/* Top Cover / Brand color */}
              <div className="p-6 bg-primary text-on-primary flex justify-between items-start">
                <div>
                  <span className="bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {selectedCourse.level} Level
                  </span>
                  <h3 className="font-display font-black text-xl md:text-2xl mt-1.5">
                    {selectedCourse.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors focus:outline-none"
                  id="btn-close-syllabus-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <h4 className="font-display font-bold text-xs uppercase text-primary tracking-wider">
                    Course Description
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {selectedCourse.longDescription}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-xs uppercase text-primary tracking-wider">
                    Syllabus Outline (Modules Covered)
                  </h4>
                  <div className="space-y-1.5">
                    {selectedCourse.syllabus.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20"
                      >
                        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-on-surface font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4 text-xs">
                  <div>
                    <span className="text-on-surface-variant text-[10px] font-semibold uppercase">Duration</span>
                    <p className="font-bold text-on-surface text-xs mt-0.5">{selectedCourse.duration}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant text-[10px] font-semibold uppercase">Fees Structure</span>
                    <p className="font-bold text-primary text-xs mt-0.5">{selectedCourse.priceInfo}</p>
                  </div>
                </div>
              </div>

              {/* Footer CTAs */}
              <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 border border-outline rounded-lg text-xs font-bold hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    openEnroll(selectedCourse.id);
                    setSelectedCourse(null);
                  }}
                  className="px-5 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors"
                >
                  Secure Spot / Enroll
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ENROLLMENT FORM MODAL ==================== */}
      <AnimatePresence>
        {isEnrollOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEnrollOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-outline-variant/30"
              id="enrollment-modal-box"
            >
              {/* Header */}
              <div className="p-5 bg-primary text-on-primary flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-white" />
                  <h3 className="font-display font-extrabold text-base md:text-lg">
                    Academic Registration Form
                  </h3>
                </div>
                <button
                  onClick={() => setIsEnrollOpen(false)}
                  className="text-white/80 hover:text-white p-1 hover:bg-white/15 rounded-full transition-colors focus:outline-none"
                  id="btn-close-enroll-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Response or Form View */}
              {enrollResponse ? (
                <div className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black text-lg text-on-surface">
                    Registration Submitted!
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-md mx-auto">
                    {enrollResponse.message}
                  </p>
                  {enrollResponse.refId && (
                    <div className="bg-surface-container-low p-2.5 rounded-lg border border-dashed border-outline-variant max-w-xs mx-auto text-xs font-mono font-bold text-primary">
                      Ref Code: {enrollResponse.refId}
                    </div>
                  )}
                  <button
                    onClick={() => setIsEnrollOpen(false)}
                    className="mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-xs"
                  >
                    Close &amp; Return
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Submit your basic registration. Our academic advisors in Colombo will process your application and contact you for a friendly oral assessment!
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        value={enrollForm.name}
                        onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Sarah Johnson"
                        required
                        type="text"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                          Email Address
                        </label>
                        <input
                          value={enrollForm.email}
                          onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="name@domain.com"
                          required
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                          Phone Number
                        </label>
                        <input
                          value={enrollForm.phone}
                          onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="e.g. +94 77 123 4567"
                          required
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                          Program / Course
                        </label>
                        <select
                          value={enrollForm.course}
                          onChange={(e) => setEnrollForm({ ...enrollForm, course: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        >
                          {COURSES.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                          Class Attendance Mode
                        </label>
                        <select
                          value={enrollForm.mode}
                          onChange={(e) => setEnrollForm({ ...enrollForm, mode: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        >
                          <option value="Online Classroom">Online Classroom (Zoom/HD Streams)</option>
                          <option value="Physical Campus">Physical Campus (Colombo, Sri Lanka)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                        Remarks / Prior Background (Optional)
                      </label>
                      <textarea
                        value={enrollForm.remarks}
                        onChange={(e) => setEnrollForm({ ...enrollForm, remarks: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Tell us if you have any preferred class timings, or current goals."
                        rows={2}
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsEnrollOpen(false)}
                      className="px-4 py-2 border border-outline rounded-lg text-xs font-semibold hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={enrollLoading}
                      className="px-5 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors flex items-center gap-1.5"
                    >
                      {enrollLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Registration</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== GALLERY LIGHTBOX ==================== */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl overflow-hidden relative z-10 w-full"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors focus:outline-none"
                id="btn-close-lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video md:max-h-[70vh]">
                <img
                  src={lightboxImage.imgUrl}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain bg-black"
                />
              </div>

              <div className="p-5 text-white bg-zinc-950">
                <h4 className="font-display font-black text-base">{lightboxImage.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{lightboxImage.desc}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
