import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, BarChart2, Tag, ArrowRight, IndianRupee } from 'lucide-react';
import useSiteStore from '../store/siteStore';

function CourseCard({ course, index, isInView }) {
  // Supabase returns original_price (snake_case)
  const discount = course.original_price
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="glass-card group hover:border-saffron-500/30 hover:-translate-y-2 transition-all duration-400 flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-transparent to-transparent" />

        {course.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-saffron-500 text-white text-xs font-bold tracking-wide shadow-lg">
            {course.badge}
          </div>
        )}
        {discount && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-bold">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-saffron-400 transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4 flex-1">{course.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-white/40 mb-5">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> {course.level}
          </span>
        </div>

        {/* Tags */}
        {course.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {course.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-[11px] text-violet-400 border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 rounded-full">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/8">
          <div>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-4 h-4 text-white/80" />
              <span className="text-2xl font-display font-bold text-white">
                {Number(course.price)?.toLocaleString('en-IN')}
              </span>
            </div>
            {course.original_price && (
              <div className="flex items-baseline gap-1 text-white/30 text-sm line-through">
                <IndianRupee className="w-3 h-3" />
                {Number(course.original_price)?.toLocaleString('en-IN')}
              </div>
            )}
          </div>
          <a href="#contact" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-saffron-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-saffron-500/30 group/btn">
            Enroll
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesSection({ section }) {
  const cfg = section?.config || {};
  const courses = useSiteStore((s) => s.courses);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="courses" ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Our Programs
          </div>
          <h2 className="section-heading mb-4">{cfg.headline || 'Industry-Ready Programs'}</h2>
          <p className="section-sub">{cfg.subheadline || 'Hands-on courses built with top companies to match real hiring needs.'}</p>
        </motion.div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} isInView={isInView} />
            ))}
          </div>
        ) : (
          <div className="text-center text-white/40 py-20">No courses available yet.</div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-ghost">
            View All Programs <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
