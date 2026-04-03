import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function ContactSection({ section }) {
  const cfg = section?.config || {};
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email are required');
    setSubmitting(true);
    try {
      await api.post('/leads', form);
      setSubmitted(true);
      toast.success("Thanks! We'll reach out within 24 hours.");
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Contact Us
          </div>
          <h2 className="section-heading mb-4">{cfg.headline || 'Get in Touch'}</h2>
          <p className="section-sub">{cfg.subheadline || 'Our counsellors are ready to help you choose the right path.'}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-2xl font-display font-bold text-white">Let's talk about your future</h3>
            <p className="text-white/55 leading-relaxed">
              Book a free 30-minute career counselling session with our experts. We'll help you find the right program and create a clear roadmap for your goals.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: Mail, label: 'Email', value: 'hello@techbharat.in' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Location', value: 'Bengaluru, Delhi, Mumbai — Pan India' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/15 border border-saffron-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-saffron-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-wide">{label}</div>
                    <div className="text-white/80 text-sm font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center gap-4">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
                <h3 className="text-2xl font-display font-bold text-white">You're on the list!</h3>
                <p className="text-white/55">Our counsellor will reach out within 24 hours. Check your inbox for a confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Arjun Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-saffron-500/50 focus:bg-white/8 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wide">Email *</label>
                    <input
                      type="email"
                      placeholder="arjun@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-saffron-500/50 focus:bg-white/8 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wide">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-saffron-500/50 focus:bg-white/8 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wide">Interested In</label>
                    <select
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 focus:outline-none focus:border-saffron-500/50 focus:bg-white/8 transition-all text-sm"
                    >
                      <option value="" className="bg-[#0f0a2e]">Select a program</option>
                      <option value="fullstack" className="bg-[#0f0a2e]">Full Stack Development</option>
                      <option value="ai-ml" className="bg-[#0f0a2e]">AI & Machine Learning</option>
                      <option value="devops" className="bg-[#0f0a2e]">DevOps & Cloud</option>
                      <option value="uiux" className="bg-[#0f0a2e]">UI/UX Design</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 uppercase tracking-wide">Message (Optional)</label>
                  <textarea
                    placeholder="Tell us about your background and goals..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-saffron-500/50 focus:bg-white/8 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Book Free Counselling Session'}
                  <Send className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-white/30">
                  By submitting, you agree to our privacy policy. No spam, ever.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
