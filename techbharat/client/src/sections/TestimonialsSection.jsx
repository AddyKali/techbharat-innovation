import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import useSiteStore from '../store/siteStore';

function TestimonialCard({ testimonial }) {
  return (
    <div className="glass-card p-8 h-full flex flex-col">
      <Quote className="w-8 h-8 text-saffron-400/40 mb-4 flex-shrink-0" />
      <p className="text-white/75 leading-relaxed text-base flex-1 mb-6 italic">
        "{testimonial.content}"
      </p>
      <div className="flex items-center gap-4 mt-auto">
        <img
          src={
            testimonial.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(testimonial.name)}`
          }
          alt={testimonial.name}
          className="w-12 h-12 rounded-full border-2 border-saffron-500/30 bg-white/10"
        />
        <div>
          <div className="font-semibold text-white text-sm">{testimonial.name}</div>
          <div className="text-xs text-white/50">{testimonial.role} · {testimonial.company}</div>
        </div>
        <div className="ml-auto flex gap-0.5">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ section }) {
  const cfg = section?.config || {};
  const testimonials = useSiteStore((s) => s.testimonials);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const perPage = 2;
  const totalPages = Math.ceil(testimonials.length / perPage);

  useEffect(() => {
    if (testimonials.length <= perPage) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length, totalPages]);

  const visible = testimonials.slice(activeIndex * perPage, activeIndex * perPage + perPage);

  return (
    <section id="testimonials" ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Success Stories
          </div>
          <h2 className="section-heading mb-4">{cfg.headline || 'Success Stories'}</h2>
          <p className="section-sub">
            {cfg.subheadline || 'Hear from our graduates now leading at top companies.'}
          </p>
        </motion.div>

        {testimonials.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
              >
                {visible.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />    // .id not ._id
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Carousel controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setActiveIndex((p) => (p - 1 + totalPages) % totalPages)}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/15 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white/70" />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex ? 'w-8 bg-saffron-400' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveIndex((p) => (p + 1) % totalPages)}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/15 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/40 py-16">No testimonials yet.</div>
        )}
      </div>
    </section>
  );
}
