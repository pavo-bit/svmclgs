"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NewNavbar, NewFooter } from "@/components";

const programs = [
  {
    icon: "🎨",
    title: "Early Years",
    description:
      "Nurturing curiosity and creativity in our little learners through play-based learning, sensory activities, and foundational literacy. We create a warm, safe environment where children develop social skills and a love for learning.",
    age: "Ages 3-5",
    color: "from-pink-500 to-pink-600",
    highlights: ["Play-based learning", "Sensory activities", "Social development", "Creative expression"],
  },
  {
    icon: "📚",
    title: "Primary School",
    description:
      "Strong foundation in academics, values and life skills. Our primary curriculum emphasizes reading, writing, mathematics, and science while fostering curiosity and character development.",
    age: "Grades 1-5",
    color: "from-blue-500 to-blue-600",
    highlights: ["Core academics", "Value education", "Life skills", "Activity-based learning"],
  },
  {
    icon: "🔬",
    title: "Middle School",
    description:
      "Encouraging critical thinking and holistic growth. Students explore advanced concepts in science, mathematics, and humanities while developing research and analytical skills.",
    age: "Grades 6-8",
    color: "from-green-500 to-green-600",
    highlights: ["Critical thinking", "Lab experiments", "Research skills", "Project-based learning"],
  },
  {
    icon: "🎓",
    title: "High School",
    description:
      "Preparing for a bright future with strong academics. Focused board exam preparation combined with personality development, career counseling, and competitive exam coaching.",
    age: "Grades 9-10",
    color: "from-purple-500 to-purple-600",
    highlights: ["Board preparation", "Career counseling", "Competitive exams", "Personality development"],
  },
  {
    icon: "📊",
    title: "Senior Secondary",
    description:
      "Stream choices and career-focused education. Students choose between Science, Commerce, and Arts streams with specialized coaching and university admission guidance.",
    age: "Grades 11-12",
    color: "from-orange-500 to-orange-600",
    highlights: ["Science stream", "Commerce stream", "Arts stream", "University preparation"],
  },
  {
    icon: "🌟",
    title: "Co-Curricular",
    description:
      "Sports, arts, clubs and activities for all-round development. From athletics to music, debate to coding clubs — we ensure every student finds their passion beyond the classroom.",
    age: "All Ages",
    color: "from-red-500 to-red-600",
    highlights: ["Sports & athletics", "Music & dance", "Debate & public speaking", "Coding & robotics"],
  },
];

const whyChooseUs = [
  { icon: "📖", title: "Comprehensive Curriculum", desc: "Aligned with national education policy and modern pedagogical approaches." },
  { icon: "🧪", title: "State-of-art Labs", desc: "Fully equipped science, computer, and language laboratories." },
  { icon: "👨‍🏫", title: "Expert Faculty", desc: "Highly qualified and experienced teachers dedicated to student success." },
  { icon: "📱", title: "Smart Classrooms", desc: "Technology-integrated learning with digital tools and resources." },
  { icon: "📝", title: "Regular Assessments", desc: "Continuous evaluation to track progress and identify strengths." },
  { icon: "🌍", title: "Global Exposure", desc: "Inter-school competitions, exchange programs, and global awareness." },
];

export default function AcademicsPage() {
  return (
    <>
      <NewNavbar />
      <main className="min-h-screen bg-[#f8f9fc]">
        {/* Hero Header */}
        <section className="relative pt-[110px] bg-[#0A1628] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          </div>

          <div className="relative max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold mb-6 uppercase tracking-[0.2em]"
              >
                📚 Our Programs
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[clamp(36px,5vw,64px)] font-black text-white leading-tight mb-4"
              >
                Academic{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
                  Programmes
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-lg md:text-xl max-w-[650px] mx-auto mb-8 leading-relaxed"
              >
                A wide range of programs designed to help students discover their passion and achieve their dreams.
              </motion.p>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0 60V30C240 0 480 0 720 15C960 30 1200 45 1440 30V60H0Z" fill="#f8f9fc" />
            </svg>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1400px] mx-auto px-[5%]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group cursor-pointer border border-gray-100"
                >
                  <div className={`w-18 h-18 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform shadow-lg`} style={{ width: "72px", height: "72px" }}>
                    {program.icon}
                  </div>
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                      {program.age}
                    </span>
                  </div>
                  <h3 className="text-[#0A1628] text-2xl font-bold mb-3">{program.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{program.description}</p>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2">
                    {program.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-[#0A1628]">
          <div className="max-w-[1400px] mx-auto px-[5%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-block px-5 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4 uppercase tracking-[0.2em]">
                Why Choose Us
              </div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Advantage</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-white text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <NewFooter />
    </>
  );
}
