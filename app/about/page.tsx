'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function AboutPage() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            scrub: false,
          },
        }
      )
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1 className="text-6xl md:text-7xl font-bold mb-6" {...fadeInUp}>
            About Our <span className="text-primary">Studio</span>
          </motion.h1>
          <motion.p className="text-xl text-muted-foreground" {...fadeInUp}>
            We are a creative studio focused on delivering exceptional digital experiences through innovative design and cutting-edge technology.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div data-animate className="space-y-6">
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              To transform ideas into compelling digital experiences that engage, inspire, and drive meaningful results for our clients and their audiences.
            </p>
            <div className="space-y-4">
              {['Innovation', 'Quality', 'Collaboration', 'Excellence'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            data-animate
            className="relative h-[400px] rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-primary">10+</div>
                <p className="text-foreground">Years of Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 md:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl font-bold mb-12" data-animate>
            Our Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Johnson', role: 'Creative Director' },
              { name: 'Sarah Chen', role: 'Lead Developer' },
              { name: 'Marcus Lee', role: 'Design Lead' },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                data-animate
                className="rounded-lg border border-border p-6 text-center hover:border-primary/50 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl font-bold mb-12" data-animate>
            What We Offer
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Brand Design', description: 'Comprehensive brand identity development' },
              { title: 'Web Development', description: 'Custom web applications and websites' },
              { title: '3D Animation', description: 'Immersive 3D experiences and animations' },
              { title: 'Motion Graphics', description: 'Dynamic visual storytelling' },
              { title: 'UX/UI Design', description: 'User-centered interface design' },
              { title: 'Strategy', description: 'Digital strategy and consulting' },
            ].map((service) => (
              <motion.div
                key={service.title}
                data-animate
                className="p-6 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-bold" data-animate>
            Ready to work together?
          </motion.h2>
          <motion.button
            data-animate
            className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors text-primary-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </div>
      </section>
    </div>
  )
}
