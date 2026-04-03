import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users, Code2, Brain } from 'lucide-react';

const floatingIcons = [
  { icon: Code2, x: '10%', y: '25%', delay: 0 },
  { icon: Brain, x: '85%', y: '20%', delay: 0.5 },
  { icon: Star, x: '80%', y: '65%', delay: 1 },
];

export default function HeroSection({ section }) {
  const cfg = section?.config || {};

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-saffron-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ icon: Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ delay: 1 + delay, duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
          style={{ left: x, top: y }}
          className="absolute hidden lg:flex glass-card p-3 shadow-xl"
        >
          <Icon className="w-6 h-6 text-saffron-400" />
        </motion.div>
      ))}

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 text-saffron-400 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-saffron-400 animate-pulse" />
          {cfg.badgeText || '🇮🇳 Made for Bharat'}
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6"
        >
          {cfg.headline ? (
            <>
              {cfg.headline.split(' ').slice(0, 2).join(' ')}{' '}
              <span className="gradient-text">{cfg.headline.split(' ').slice(2).join(' ')}</span>
            </>
          ) : (
            <>
              Build India's{' '}
              <span className="gradient-text">Digital Future</span>
            </>
          )}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {cfg.subheadline || 'World-class tech education designed for ambitious Indians. Learn from industry veterans, build real projects, and launch your tech career.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href={cfg.ctaLink || '#courses'}
            className="btn-primary text-base px-8 py-4 shadow-2xl shadow-saffron-500/40"
          >
            {cfg.ctaText || 'Start Learning Free'}
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#features"
            className="btn-ghost text-base px-8 py-4"
          >
            <Play className="w-4 h-4 fill-current" />
            {cfg.secondaryCtaText || 'Watch Demo'}
          </a>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/50"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0618] bg-gradient-to-br from-saffron-400 to-violet-500"
                  style={{ zIndex: 5 - i }}
                />
              ))}
            </div>
            <span>50,000+ learners</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1">4.9/5 rating</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-saffron-400" />
            <span>Hiring partners: Google, Microsoft, Flipkart</span>
          </div>
        </motion.div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0618] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
