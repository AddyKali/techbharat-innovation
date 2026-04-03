import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserCheck, BookOpenCheck, Code2, Rocket, Handshake } from 'lucide-react';

const STEPS = [
  {
    icon: UserCheck,
    step: '01',
    title: 'Choose Your Path',
    description: 'Take our free career assessment. Get a personalised roadmap based on your goals and background.',
    color: 'saffron',
  },
  {
    icon: BookOpenCheck,
    step: '02',
    title: 'Master the Fundamentals',
    description: 'Structured modules with bite-sized lessons, quizzes, and guided exercises to build a rock-solid base.',
    color: 'violet',
  },
  {
    icon: Code2,
    step: '03',
    title: 'Build Real Projects',
    description: 'Apply what you learn with 10+ real-world projects. Ship production-grade code with mentor guidance.',
    color: 'emerald',
  },
  {
    icon: Handshake,
    step: '04',
    title: 'Mock Interviews & Prep',
    description: 'Intense interview preparation with our placement experts. Resume reviews, DSA practice, and mock calls.',
    color: 'blue',
  },
  {
    icon: Rocket,
    step: '05',
    title: 'Get Placed',
    description: "We connect you with our 80+ hiring partners. We don't stop until you land the job you deserve.",
    color: 'pink',
  },
];

const COLOR_MAP = {
  saffron: { bg: 'bg-saffron-500/15', text: 'text-saffron-400', border: 'border-saffron-500/30', glow: 'shadow-saffron-500/20' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  pink: { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },
};

export default function ProcessSection({ section }) {
  const cfg = section?.config || {};
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="process" ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">
            The Journey
          </div>
          <h2 className="section-heading mb-4">{cfg.headline || 'Your Journey to Tech Mastery'}</h2>
          <p className="section-sub">{cfg.subheadline || 'A structured path from beginner to job-ready professional.'}</p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-saffron-500/40 via-violet-500/30 to-pink-500/40 hidden lg:block" style={{ left: '2.75rem' }} />

          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const clr = COLOR_MAP[step.color];

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex items-start gap-6 group"
                >
                  {/* Icon circle */}
                  <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl ${clr.bg} border ${clr.border} flex items-center justify-center shadow-xl ${clr.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${clr.text}`} />
                    <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0a0618] border ${clr.border} flex items-center justify-center`}>
                      <span className={`text-[9px] font-mono font-bold ${clr.text}`}>{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="glass-card-hover flex-1 p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
