"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const skills = [
  { 
    name: "Python", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", 
    color: "from-blue-500 to-yellow-500" 
  },
  { 
    name: "React", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
    color: "from-blue-400 to-cyan-400" 
  },
  { 
    name: "Next.js", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", 
    color: "from-black to-gray-600" 
  },
  { 
    name: "TypeScript", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", 
    color: "from-blue-600 to-blue-400" 
  },
  { 
    name: "Node.js", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
    color: "from-green-600 to-green-400" 
  },
  { 
    name: "JavaScript", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
    color: "from-yellow-500 to-yellow-300" 
  },
  { 
    name: "Docker", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", 
    color: "from-blue-500 to-blue-300" 
  },
  { 
    name: "AWS", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", 
    color: "from-orange-500 to-orange-300" 
  },
  { 
    name: "MongoDB", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", 
    color: "from-green-500 to-green-300" 
  },
  { 
    name: "PostgreSQL", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", 
    color: "from-blue-600 to-blue-500" 
  },
  { 
    name: "Git", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", 
    color: "from-red-500 to-orange-500" 
  },
  { 
    name: "Tailwind CSS", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg", 
    color: "from-cyan-500 to-blue-500" 
  },
]

// Create multiple copies for seamless scrolling
const duplicatedSkills = [...skills, ...skills, ...skills]

export function SkillsMarquee() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-gray-900 dark:via-transparent dark:to-gray-900 z-10"></div>
      
      <motion.div
        className="flex gap-8 items-center whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        style={{
          width: "200%"
        }}
      >
        {/* First set */}
        <div className="flex gap-8 items-center flex-shrink-0">
          {skills.map((skill, index) => (
            <motion.div
              key={`first-${skill.name}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`bg-gradient-to-br ${skill.color} p-6 rounded-2xl shadow-lg min-w-[140px] text-center backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300`}>
                <div className="mb-3 flex justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center p-2">
                    <Image
                      src={skill.logo}
                      alt={`${skill.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <div className="text-white font-semibold text-sm drop-shadow-sm">
                  {skill.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Second set for seamless loop */}
        <div className="flex gap-8 items-center flex-shrink-0">
          {skills.map((skill, index) => (
            <motion.div
              key={`second-${skill.name}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`bg-gradient-to-br ${skill.color} p-6 rounded-2xl shadow-lg min-w-[140px] text-center backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300`}>
                <div className="mb-3 flex justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center p-2">
                    <Image
                      src={skill.logo}
                      alt={`${skill.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <div className="text-white font-semibold text-sm drop-shadow-sm">
                  {skill.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}