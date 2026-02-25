"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faUserDoctor,
  faUserNurse,
  faUser,
  faUserGear,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [dark, setDark] = useState(true);
  const [init, setInit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [roleAnimating, setRoleAnimating] = useState(false);
  const [role, setRole] = useState("Admin");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  /* ---------------------------------- */
  /* ROLE CONFIG (converted for animation) */
  /* ---------------------------------- */

  const roleConfig = useMemo(() => {
    const roles = {
      Admin: {
        light: {
          leftFrom: "#eff1f5",
          leftTo: "#ccd0da",
          rightFrom: "#f2f3f7",
          rightTo: "#e6e9ef",
          accent: "#7287fd",
          textPrimary: "#2e3440",
          textSecondary: "#4c566a",
        },
        dark: {
          leftFrom: "#1e1e2e",
          leftTo: "#181825",
          rightFrom: "#181825",
          rightTo: "#11111b",
          accent: "#89b4fa",
          textPrimary: "#e2e8f0",
          textSecondary: "#a6adc8",
        },
        title: "Administration Portal",
        sub: "System oversight and operational control.",
      },
      Doctor: {
        light: {
          leftFrom: "#f3ead3",
          leftTo: "#e6e2cc",
          rightFrom: "#f8f5e4",
          rightTo: "#e6dcc6",
          accent: "#7fbbb3",
          textPrimary: "#2f3e46",
          textSecondary: "#556b6e",
        },
        dark: {
          leftFrom: "#2d353b",
          leftTo: "#232a2e",
          rightFrom: "#232a2e",
          rightTo: "#1f2428",
          accent: "#83c092",
          textPrimary: "#d3c6aa",
          textSecondary: "#a7c080",
        },
        title: "Doctor Workspace",
        sub: "Clinical access and patient records.",
      },
      Nurse: {
        light: {
          leftFrom: "#fbf1c7",
          leftTo: "#ebdbb2",
          rightFrom: "#f2e5bc",
          rightTo: "#e0d2a8",
          accent: "#b16286",
          textPrimary: "#3c3836",
          textSecondary: "#665c54",
        },
        dark: {
          leftFrom: "#282828",
          leftTo: "#1d2021",
          rightFrom: "#1d2021",
          rightTo: "#141617",
          accent: "#d3869b",
          textPrimary: "#ebdbb2",
          textSecondary: "#bdae93",
        },
        title: "Nursing Station",
        sub: "Care coordination and monitoring.",
      },
      Patient: {
        light: {
          leftFrom: "#faf4ed",
          leftTo: "#f2e9e1",
          rightFrom: "#f4ede8",
          rightTo: "#e8dcd3",
          accent: "#907aa9",
          textPrimary: "#403d52",
          textSecondary: "#6e6a86",
        },
        dark: {
          leftFrom: "#191724",
          leftTo: "#1f1d2e",
          rightFrom: "#1f1d2e",
          rightTo: "#16141f",
          accent: "#c4a7e7",
          textPrimary: "#e0def4",
          textSecondary: "#908caa",
        },
        title: "Patient Access",
        sub: "Appointments and health history.",
      },
      Staff: {
        light: {
          leftFrom: "#e1e2e7",
          leftTo: "#d5d6db",
          rightFrom: "#e5e6ea",
          rightTo: "#d8d9df",
          accent: "#7aa2f7",
          textPrimary: "#1f2937",
          textSecondary: "#4b5563",
        },
        dark: {
          leftFrom: "#1a1b26",
          leftTo: "#16161e",
          rightFrom: "#16161e",
          rightTo: "#0f0f17",
          accent: "#7aa2f7",
          textPrimary: "#c0caf5",
          textSecondary: "#9aa5ce",
        },
        title: "Staff Operations",
        sub: "Logistics and internal coordination.",
      },
    };

    return roles[role as keyof typeof roles];
  }, [role]);

  const current = dark ? roleConfig.dark : roleConfig.light;

  const roleIcon = {
    Admin: faHospital,
    Doctor: faUserDoctor,
    Nurse: faUserNurse,
    Patient: faUser,
    Staff: faUserGear,
  }[role];

  /* ---------------------------------- */
  /* PARTICLES */
  /* ---------------------------------- */

  const options = useMemo(() => {
    return {
      background: { color: "transparent" },
      fullScreen: { enable: false },
      particles: {
        number: { value: 60 },
        color: { value: current.accent },
        links: {
          enable: true,
          color: current.accent,
          distance: 140,
          opacity: 0.25,
        },
        move: { enable: true, speed: 0.8 },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: 0.4 },
      },
      detectRetina: true,
    };
  }, [current.accent]);

  /* ---------------------------------- */
  /* RENDER */
  /* ---------------------------------- */

  return (
    <div className="h-screen w-screen overflow-hidden">

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <span className="transition-colors duration-500"
          style={{ color: current.textSecondary }}>
          Light
        </span>

        <button
          onClick={() => setDark(!dark)}
          className="w-14 h-8 flex items-center rounded-full p-1 transition-all duration-500"
          style={{ backgroundColor: dark ? "#4b5563" : "#d1d5db" }}
        >
          <div
            className="bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-500"
            style={{ transform: dark ? "translateX(24px)" : "translateX(0px)" }}
          />
        </button>

        <span className="transition-colors duration-500"
          style={{ color: current.textSecondary }}>
          Dark
        </span>
      </div>

      <div className="flex h-full flex-col md:flex-row">

        {/* LEFT */}
        <div
          className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${current.leftFrom}, ${current.leftTo})`,
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[80px]" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/10 dark:bg-black/20" />

          <div
            className={`relative z-10 max-w-md text-center space-y-6 px-8 transition-all duration-500 ${
              mounted && !roleAnimating
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-95"
            }`}
          >
            <FontAwesomeIcon
              icon={roleIcon}
              size="4x"
              className="transition-colors duration-500"
              style={{ color: current.accent }}
            />
            <h1
              className="text-4xl font-semibold transition-colors duration-500"
              style={{ color: current.textPrimary }}
            >
              {roleConfig.title}
            </h1>
            <p
              className="transition-colors duration-500"
              style={{ color: current.textSecondary }}
            >
              {roleConfig.sub}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${current.rightFrom}, ${current.rightTo})`,
          }}
        >
          {init && (
            <Particles
              id="tsparticles"
              options={options}
              className="absolute inset-0"
            />
          )}

          <div
            className={`relative z-10 w-full max-w-md px-10 transition-all duration-500 ${
              mounted && !roleAnimating
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-95"
            }`}
          >
            <h2
              className="text-3xl font-semibold mb-2 transition-colors duration-500"
              style={{ color: current.textPrimary }}
            >
              Welcome Back
            </h2>

            <p
              className="mb-8 transition-colors duration-500"
              style={{ color: current.textSecondary }}
            >
              Please select your portal and enter details
            </p>

            {/* Role Selection */}
            <div className="mb-8 grid grid-cols-3 gap-3">
              {["Admin","Doctor","Nurse","Patient","Staff"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRoleAnimating(true);
                    setTimeout(() => {
                      setRole(r);
                      setRoleAnimating(false);
                    }, 250);
                  }}
                  className="py-2 px-4 rounded-lg text-sm transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor:
                      role === r
                        ? current.accent
                        : "rgba(255,255,255,0.15)",
                    color:
                      role === r
                        ? "#fff"
                        : current.textPrimary,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Email */}
            <div
              className="mb-6 flex items-center border-b py-2 transition-colors duration-500"
              style={{ borderColor: current.textSecondary }}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-3 transition-colors duration-500"
                style={{ color: current.accent }}
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent focus:outline-none transition-colors duration-500"
                style={{ color: current.textPrimary }}
              />
            </div>

            {/* Password */}
            <div
              className="mb-8 flex items-center border-b py-2 transition-colors duration-500"
              style={{ borderColor: current.textSecondary }}
            >
              <FontAwesomeIcon
                icon={faLock}
                className="mr-3 transition-colors duration-500"
                style={{ color: current.accent }}
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent focus:outline-none transition-colors duration-500"
                style={{ color: current.textPrimary }}
              />
            </div>

            <button
              className="w-full py-3 rounded-lg text-white font-medium transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: current.accent }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}