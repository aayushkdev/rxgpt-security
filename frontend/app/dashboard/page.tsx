"use client";

import { useMemo, useState } from "react";
import { roles } from "../lib/themeconfig";

type Vulnerability = {
  issue: string;
  severity: "CRIT" | "HIGH" | "LOW";
  fix: string;
};

export default function Dashboard() {
  const [role, setRole] = useState("Admin");
  const [dark, setDark] = useState(true);

  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Vulnerability[] | null>(null);

  const roleConfig = useMemo(() => {
    return roles[role as keyof typeof roles];
  }, [role]);

  const current = dark ? roleConfig.dark : roleConfig.light;

  const hardenedYaml = `securityContext:
  runAsNonRoot: true
  capabilities:
    drop: ["ALL"]

readinessProbe:
  httpGet:
    path: /health
    port: 8000`;

  const handleScan = () => {
    if (!imageName.trim()) return;

    setLoading(true);
    setResults(null);

    setTimeout(() => {
      const mockResults: Vulnerability[] = [
        { issue: "cryptography<42.0", severity: "CRIT", fix: "Upgrade dependency" },
        { issue: "Missing healthcheck", severity: "HIGH", fix: "Add readinessProbe" },
        { issue: "XSS detected", severity: "HIGH", fix: "Sanitize input" },
      ];

      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  const stats = useMemo(() => {
    if (!results) return null;

    const crit = results.filter(r => r.severity === "CRIT").length;
    const high = results.filter(r => r.severity === "HIGH").length;
    const score = Math.max(0, 100 - (crit * 40 + high * 15));

    return { crit, high, score };
  }, [results]);

  const downloadYaml = () => {
    const blob = new Blob([hardenedYaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rxgpt-hardened.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen p-12 transition-all duration-700"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${current.rightFrom}, ${current.rightTo})`,
      }}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <span style={{ color: current.textSecondary }}>Light</span>

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

        <span style={{ color: current.textSecondary }}>Dark</span>
      </div>

      <div className="max-w-6xl mx-auto mt-10">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold"
            style={{ color: current.textPrimary }}
          >
            RXGPT Security Dashboard
          </h1>
          <p
            className="mt-2"
            style={{ color: current.textSecondary }}
          >
            Scan Docker images for vulnerabilities and generate hardened configs.
          </p>
        </div>

        {/* Scan Input */}
        <div className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter Docker image (e.g. myapp:latest)"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl bg-transparent border focus:outline-none"
            style={{
              borderColor: current.textSecondary,
              color: current.textPrimary,
            }}
          />

          <button
            onClick={handleScan}
            className="px-6 py-3 rounded-xl text-white font-medium transition cursor-pointer"
            style={{ backgroundColor: current.accent }}
          >
            {loading ? "Scanning..." : "Scan Image"}
          </button>
        </div>

        {results && stats && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="rounded-2xl p-6 shadow-lg bg-white/10 backdrop-blur">
                <div style={{ color: current.textSecondary }}>Critical</div>
                <div className="text-3xl font-bold text-red-500">
                  {stats.crit}
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-lg bg-white/10 backdrop-blur">
                <div style={{ color: current.textSecondary }}>High</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {stats.high}
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-lg bg-white/10 backdrop-blur">
                <div style={{ color: current.textSecondary }}>Score</div>
                <div
                  className="text-3xl font-bold"
                  style={{
                    color:
                      stats.score >= 80
                        ? "#22c55e"
                        : stats.score >= 50
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                >
                  {stats.score}/100
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="rounded-2xl p-8 bg-white/10 backdrop-blur shadow-lg mb-10">
              <h2
                className="text-xl font-semibold mb-6"
                style={{ color: current.textPrimary }}
              >
                Scan Results for {imageName}
              </h2>

              {results.map((vuln, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-4 mb-4"
                  style={{ borderColor: current.textSecondary }}
                >
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: current.textPrimary }}
                    >
                      {vuln.issue}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: current.textSecondary }}
                    >
                      Recommended Fix: {vuln.fix}
                    </div>
                  </div>

                  <span
                    className="px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      backgroundColor:
                        vuln.severity === "CRIT"
                          ? "#ef4444"
                          : vuln.severity === "HIGH"
                          ? "#f59e0b"
                          : "#22c55e",
                    }}
                  >
                    {vuln.severity}
                  </span>
                </div>
              ))}
            </div>

            {/* Hardened YAML */}
            <div className="rounded-2xl p-8 bg-black/80 text-green-400 font-mono shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">
                  Hardened Deployment Configuration
                </h3>
                <button
                  onClick={downloadYaml}
                  className="px-4 py-2 rounded-lg text-white text-xs cursor-pointer"
                  style={{ backgroundColor: current.accent }}
                >
                  Download YAML
                </button>
              </div>

              <pre className="whitespace-pre-wrap">
                {hardenedYaml}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}