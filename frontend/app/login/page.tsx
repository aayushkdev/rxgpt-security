"use client";

import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { roles } from "../lib/themeconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHospital,
  faUserDoctor,
  faUserNurse,
  faUser,
  faUserGear,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/dist/client/components/navigation";


type Role = "Admin" | "Doctor" | "Nurse" | "Patient" | "Staff";
const ROLE_LIST: Role[] = ["Admin", "Doctor", "Nurse", "Patient", "Staff"];
// separate component for particles; memoized so it only updates when accent changes
const ParticleBackground = React.memo(
  ({ accent, init }: { accent: string; init: boolean }) => {
    const options = useMemo(() => {
      return {
        background: { color: "transparent" },
        fullScreen: { enable: false },
        particles: {
          number: { value: 60 },
          color: { value: accent },
          links: {
            enable: true,
            color: accent,
            distance: 140,
            opacity: 0.25,
          },
          move: { enable: true, speed: 0.8 },
          size: { value: { min: 1, max: 3 } },
          opacity: { value: 0.4 },
        },
        detectRetina: true,
      };
    }, [accent]);

    if (!init) return null;
    return <Particles id="tsparticles" options={options} className="absolute inset-0" />;
  }
);


export default function Login() {
  const [dark, setDark] = useState(true);
  const [init, setInit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [roleAnimating, setRoleAnimating] = useState(false);
  const [role, setRole] = useState<Role>("Admin");
  const [securityMessage, setSecurityMessage] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // controlled inputs for validation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => setMounted(true), []);
  const router = useRouter();

  const handleLogin = () => {
    const emailInput = email.trim();
    const passwordInput = password;

    // length validation
    if (emailInput.length < 5) {
      setSecurityMessage("Email must be at least 5 characters long");
      return;
    }
    if (passwordInput.length < 8) {
      setSecurityMessage("Password must be at least 8 characters long");
      return;
    }

    // XSS Detection
    if (/<script.*?>.*?<\/script>/i.test(emailInput) || /<script.*?>.*?<\/script>/i.test(passwordInput)) {
      setSecurityMessage("BLOCKED: XSS");
      return;
    }

    // SQL Injection Detection
    if (/'\s*OR\s*1=1--/i.test(emailInput) || /'\s*OR\s*1=1--/i.test(passwordInput)) {
      setSecurityMessage("BLOCKED: SQLi");
      return;
    }

    // Clear alerts
    setSecurityMessage("");

    // Generate fake 2FA code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setShow2FA(true);
  };

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  
  const roleConfig = useMemo(() => {
    return roles[role as keyof typeof roles];
  }, [role]);

  const current = dark ? roleConfig.dark : roleConfig.light;

  const roleIcons: Record<Role, IconDefinition> = {
    Admin: faHospital,
    Doctor: faUserDoctor,
    Nurse: faUserNurse,
    Patient: faUser,
    Staff: faUserGear,
  };

  const roleIcon = roleIcons[role];


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
          className="w-14 h-8 flex items-center rounded-full p-1 transition-all duration-500 cursor-pointer"
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
          {/* particle background separated into its own memoized component */}
          <ParticleBackground accent={current.accent} init={init} />

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
              {ROLE_LIST.map((r) => (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                minLength={5}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-lg text-white font-medium transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: current.accent }}
            >
              Login
            </button>

            {securityMessage && (
              <div className="mt-4 text-center font-medium text-red-500 animate-pulse">
                {securityMessage}
              </div>
            )}
          </div>
        </div>

        
      </div>

    {show2FA && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
        <div
          className="p-8 rounded-2xl shadow-2xl w-96 text-center transition-all duration-500 scale-100"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${current.rightFrom}, ${current.rightTo})`,
          }}
        >
          <h3
            className="text-xl font-semibold mb-3 transition-colors duration-500"
            style={{ color: current.textPrimary }}
          >
            Two-Factor Authentication
          </h3>

          <p
            className="mb-4 text-sm transition-colors duration-500"
            style={{ color: current.textSecondary }}
          >
            Enter the verification code sent to your device
          </p>

          {/* Demo Code */}
          <p
            className="mb-4 text-xs transition-colors duration-500"
            style={{ color: current.textSecondary }}
          >
            Demo Code:{" "}
            <span
              className="font-mono"
              style={{ color: current.accent }}
            >
              {generatedCode}
            </span>
          </p>

          <input
            type="text"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full rounded-lg px-4 py-2 mb-4 text-center bg-transparent border focus:outline-none transition-colors duration-500 "
            style={{
              color: current.textPrimary,
              borderColor: current.textSecondary,
            }}
          />

          <button
            onClick={() => {
              if (twoFactorCode === generatedCode) {
                setShow2FA(false);
                router.push("/dashboard");
              } else {
                alert("Invalid Code");
              }
            }}
            className="w-full py-2 rounded-lg text-white transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: current.accent }}
          >
            Verify
          </button>

          <button
            onClick={() => setShow2FA(false)}
            className="mt-3 text-sm transition-colors duration-500 cursor-pointer"
            style={{ color: current.textSecondary }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    </div>
  );
}