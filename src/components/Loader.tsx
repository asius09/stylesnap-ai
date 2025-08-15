"use client";

import { motion } from "framer-motion";

// NOTE: Each particle now has a unique CSS class for its shadow and effects.
// These classes are for visual decoration only and are not accessible to assistive tech.

const PARTICLES = [
  {
    className: "left-4 top-2 w-[3px] h-[3px] bg-primary loader-particle-1",
    delay: 0,
    opacity: 0.55,
  },
  {
    className: "left-8 top-3 w-[2px] h-[2px] bg-primary loader-particle-2",
    delay: 0.3,
    opacity: 0.22,
  },
  {
    className:
      "left-[30px] top-[34px] w-[2.5px] h-[2.5px] bg-primary loader-particle-3",
    delay: 0.6,
    opacity: 0.18,
  },
  {
    className:
      "left-[10px] top-8 w-[1.5px] h-[1.5px] bg-primary loader-particle-4",
    delay: 0.9,
    opacity: 0.15,
  },
  {
    className: "left-5 top-4 w-[2px] h-[2px] bg-primary loader-particle-5",
    delay: 1.2,
    opacity: 0.19,
  },
];

export const Loader = () => {
  return (
    <div
      id="loader"
      className="relative flex h-12 w-12 items-center justify-center"
    >
      {/* Glossy background with a subtle gradient and shine using primary color */}
      <svg
        className="text-primary absolute z-[1] h-12 w-12"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="glossy-bg" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </radialGradient>
        </defs>
        <rect
          x="0.2"
          y="0.2"
          width="47.6"
          height="47.6"
          rx="12"
          fill="url(#glossy-bg)"
        />
        {/* Shine overlay */}
        <rect
          x="0.2"
          y="0.2"
          width="47.6"
          height="24"
          rx="12"
          fill="url(#shine)"
        />
      </svg>
      {/* Particles group */}
      <motion.div
        className="absolute z-[2] h-12 w-12"
        style={{ transformOrigin: "24px 24px" }}
        animate={{ rotate: [0, -360] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "linear",
        }}
        aria-hidden="true"
      >
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${p.className}`}
            style={{
              opacity: p.opacity,
              background:
                "linear-gradient(135deg, #fff 0%, theme(colors.primary.DEFAULT) 80%)",
              mixBlendMode: "screen",
            }}
            initial={{ scale: 1, opacity: p.opacity }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [p.opacity, 0.85, p.opacity],
              x: [0, 2, 0],
              y: [0, -2, 0],
              // Shadow and blur are handled by the loader-particle-N class in CSS
            }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              repeatType: "reverse",
              delay: p.delay,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />
        ))}
      </motion.div>
      {/* Animated star with glossy shine using primary color */}
      <motion.div
        className="loader-star absolute top-2 left-2 z-[3] flex h-8 w-8 items-center justify-center"
        style={{ transformOrigin: "50% 50%" }}
        animate={{ rotate: [0, 360] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: [0.77, 0, 0.18, 1],
        }}
        aria-hidden="true"
      >
        <motion.svg
          className="text-primary block h-full w-full"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          style={{ transformOrigin: "50% 50%" }}
          animate={{
            scale: [1, 0.7, 1, 0.7, 1],
            opacity: [1, 0.85, 1, 0.85, 1],
            // Shadow is handled by the loader-star class in CSS
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            times: [0, 0.25, 0.5, 0.75, 1],
            ease: [0.77, 0, 0.18, 1],
          }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="star-gloss" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="60%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </radialGradient>
            <linearGradient id="star-shine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.6146 0.669461C15.7453 0.310016 16.256 0.310082 16.3851 0.669461L17.8226 4.66165C19.4194 9.09172 22.9079 12.5806 27.3382 14.1773L31.3304 15.6148C31.69 15.7455 31.6901 16.2554 31.3304 16.3843L27.3382 17.8218C22.9079 19.4185 19.4194 22.9073 17.8226 27.3374L16.3851 31.3296C16.256 31.6908 15.7453 31.6908 15.6146 31.3296L14.178 27.3374C12.5812 22.9073 9.09182 19.4185 4.66143 17.8218L0.669247 16.3843C0.309895 16.2535 0.309859 15.7438 0.669247 15.6148L4.66143 14.1773C9.0919 12.5806 12.5813 9.09192 14.178 4.66165L15.6146 0.669461ZM16.2073 7.74563C16.1368 7.55185 15.8628 7.55186 15.7923 7.74563L15.0179 9.89407C14.1577 12.2785 12.2793 14.1569 9.89483 15.0171L7.7464 15.7915C7.55232 15.8619 7.55241 16.1361 7.7464 16.2066L9.89483 16.981C12.2793 17.8412 14.1577 19.7206 15.0179 22.105L15.7923 24.2534C15.8609 24.4491 16.1368 24.4491 16.2073 24.2534L16.9817 22.105C17.842 19.7205 19.7203 17.8412 22.1048 16.981L24.2532 16.2066C24.4473 16.1361 24.4473 15.8619 24.2532 15.7915L22.1048 15.0171C19.7204 14.1569 17.8419 12.2786 16.9817 9.89407L16.2073 7.74563Z"
            fill="url(#star-gloss)"
          />
          {/* Shine overlay on star */}
          <ellipse
            cx="16"
            cy="10"
            rx="7"
            ry="2"
            fill="url(#star-shine)"
            opacity="0.7"
          />
        </motion.svg>
      </motion.div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/*
  --- Add the following CSS to your global stylesheet (e.g. globals.css) ---

  .loader-particle-1 {
    filter:
      blur(2.5px)
      brightness(1.5)
      drop-shadow(0 0 8px rgba(120,90,255,0.35));
  }
  .loader-particle-2 {
    filter:
      blur(3px)
      brightness(2)
      drop-shadow(0 0 10px rgba(120,90,255,0.22));
  }
  .loader-particle-3 {
    filter:
      blur(3.5px)
      brightness(1.25)
      drop-shadow(0 0 9px rgba(120,90,255,0.28));
  }
  .loader-particle-4 {
    filter:
      blur(2.5px)
      brightness(1.75)
      drop-shadow(0 0 7px rgba(120,90,255,0.18));
  }
  .loader-particle-5 {
    filter:
      blur(3px)
      brightness(2)
      drop-shadow(0 0 10px rgba(120,90,255,0.22));
  }
  .loader-star {
    filter:
      drop-shadow(0 0 8px #fff8)
      drop-shadow(0 0 16px rgba(120,90,255,0.53));
  }

  // These classes are for visual decoration only and are not accessible.
*/
