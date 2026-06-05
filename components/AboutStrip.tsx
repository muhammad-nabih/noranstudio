import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AboutStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xLeft = useTransform(scrollYProgress, [0, 1], ['-8%', '0%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['8%', '0%']);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-content',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' } }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">

          {/* Left — personal bio (replaces the old quote) */}
          <motion.div style={{ x: xLeft }} className="about-content">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
                a little about me...
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white leading-tight mb-4">
              Hi, I'm <span className="text-[#C9A96E]">Noran Elgeneady</span>.
            </h2>
            <p className="text-[#E8DCC8]/80 text-base leading-relaxed font-['Cormorant_Garamond'] font-light mb-6">
              I don’t create designs just for art or aesthetics. I craft visuals that bring brand identity to life,
              communicate marketing messages clearly, and transform ideas into impactful designs that truly support goals.
            </p>
            <p className="text-[#C9A96E] text-sm tracking-wide font-['Playfair_Display'] italic">
              Let the design tell your story.
            </p>
          </motion.div>

          {/* Right — decorative grid (unchanged) */}
          <motion.div style={{ x: xRight }} className="about-content grid grid-cols-2 gap-4">
            {[
              { num: '∞', label: 'Possibilities' },
              { num: '01', label: 'Vision' },
              { num: '↑',  label: 'Excellence' },
              { num: '◈',  label: 'Craft' },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-[#C9A96E]/10 p-6 flex flex-col justify-between aspect-square hover:border-[#C9A96E]/30 transition-colors duration-400 group"
              >
                <div className="text-4xl text-[#C9A96E]/30 group-hover:text-[#C9A96E]/60 transition-colors duration-400 font-['Playfair_Display']">
                  {item.num}
                </div>
                <div className="text-[#E8DCC8]/30 text-xs tracking-[0.25em] uppercase font-['Cormorant_Garamond']">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutStrip;