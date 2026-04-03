import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Cpu, Users, Award, Clock, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: Layers,
    title: 'Project-First Curriculum',
    description: 'Every module ends with a real-world project. Build a portfolio that speaks louder than certificates.',
    color: 'from-saffron-500/20 to-amber-400/10',
    iconColor: 'text-saffron-400',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Learning',
    description: 'Adaptive learning paths that adjust to your pace. Get hints, explanations, and code reviews from AI.',
    color: 'from-violet-500/20 to-indigo-400/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: Users,
    title: 'Live Mentorship',
    description: '1-on-1 sessions with senior engineers from Google, Microsoft, and top Indian startups.',
    color: 'from-emerald-500/20 to-teal-400/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Award,
    title: 'Industry Certification',
    description: 'Earn credentials recognized by 80+ hiring partners across India and globally.',
    color: 'from-pink-500/20 to-rose-400/10',
    iconColor: 'text-pink-400',
  },
  {
    icon: Clock,
    title: 'Learn at Your Pace',
    description: 'Flexible scheduling designed for working professionals. Study mornings, evenings, or weekends.',
    color: 'from-blue-500/20 to-cyan-400/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: Globe,
    title: 'Placement Support',
    description: 'Dedicated placement team, mock interviews, and resume reviews until you land the job.',
    color: 'from-amber-500/20 to-yellow-400/10',
    iconColor: 'text-amber-400',
  },
];

export default function FeaturesSection({ section }) {
  const cfg = section?.config || {};
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Why Choose Us
          </div>
          <h2 className="section-heading mb-4">
            {cfg.headline || 'Why TechBharat?'}
          </h2>
          <p className="section-sub">
            {cfg.subheadline || 'A learning experience built for results, not just certificates.'}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card-hover p-7 group cursor-default"
              >
                <div className={`w-12 h-12 mb-5 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
