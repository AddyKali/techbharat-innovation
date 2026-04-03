import { Zap, Twitter, Linkedin, Github, Instagram, Youtube } from 'lucide-react';

const LINKS = {
  Programs: ['Full Stack Dev', 'AI & ML', 'DevOps & Cloud', 'UI/UX Design', 'Data Science'],
  Company: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Partner with Us'],
  Support: ['Help Center', 'FAQs', 'Student Portal', 'Placement Cell', 'Contact Us'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'],
};

const SOCIALS = [
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Github, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Youtube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-gradient-to-b from-transparent to-[#080414] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">TechBharat</div>
                <div className="text-[10px] text-saffron-400 tracking-widest uppercase">Innovation</div>
              </div>
            </div>
            <p className="text-sm text-white/45 leading-relaxed mb-6 max-w-xs">
              Building the next generation of Indian tech talent. World-class education, industry-proven curriculum, guaranteed outcomes.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-saffron-500/20 hover:border-saffron-500/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4 text-white/60 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{category}</div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/8">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} TechBharat Innovation Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
          <p className="text-sm text-white/25">
            🇮🇳 Proudly built in India
          </p>
        </div>
      </div>
    </footer>
  );
}
