"use client";

import { useState } from "react";

export default function Dashboard() {
  const [scanResults, setScanResults] = useState<any[]>([]);

  const handleScan = () => {
    setScanResults([
      { issue: "crypto<42.0", severity: "CRITICAL", fix: "runAsNonRoot" },
      { issue: "No healthcheck", severity: "HIGH", fix: "readinessProbe" }
    ]);
  };

  const downloadYaml = () => {
    const yaml = `
securityContext:
  runAsNonRoot: true
readinessProbe:
  httpGet:
    path: /health
`;

    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rxgpt-hardened.yaml";
    a.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>RXGPT Security Dashboard</h1>

      <button onClick={handleScan}>SCAN DASHBOARD</button>

      {scanResults.length > 0 && (
        <>
          <table border={1} cellPadding={10} style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Issue</th>
                <th>Severity</th>
                <th>Fix</th>
              </tr>
            </thead>
            <tbody>
              {scanResults.map((r, i) => (
                <tr key={i}>
                  <td>{r.issue}</td>
                  <td>{r.severity}</td>
                  <td>{r.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <button onClick={downloadYaml}>
            DOWNLOAD rxgpt-hardened.yaml
          </button>
        </>
      )}
    </div>
  );
}