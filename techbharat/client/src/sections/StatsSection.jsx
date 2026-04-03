import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, BookOpen, Briefcase, TrendingUp, Star, Award, Globe, Zap } from 'lucide-react';
import useSiteStore from '../store/siteStore';

const ICON_MAP = {
  users: Users,
  'book-open': BookOpen,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  star: Star,
  award: Award,
  globe: Globe,
  zap: Zap,
};

export default function StatsSection() {
  const stats = useSiteStore((s) => s.stats);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="stats" ref={ref} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/5 via-transparent to-violet-600/5" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = ICON_MAP[stat.icon] || TrendingUp;
            return (
              <motion.div
                key={stat.id}                          // .id not ._id
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-6 text-center group hover:border-saffron-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-saffron-500/20 to-amber-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-saffron-400" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1 gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
