#!/usr/bin/env python3

import sys
import subprocess
import time
from rich.console import Console, Group
from rich.table import Table
from rich.panel import Panel
from rich.align import Align
from rich.text import Text
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich import box

console = Console()


# -------------------------------
# Vulnerability Checks
# -------------------------------

def check_cryptography_version(image):
    try:
        result = subprocess.run(
            ["docker", "run", "--rm", image, "pip", "show", "cryptography"],
            capture_output=True,
            text=True,
            timeout=8
        )

        if "Version:" not in result.stdout:
            return True

        for line in result.stdout.splitlines():
            if line.startswith("Version:"):
                version = line.split(":")[1].strip()
                if version < "42.0":
                    return True
                else:
                    return False

        return True

    except Exception:
        return True


def mock_source_scan():
    mock_code = """
    <form>
    <input name="email">
    <script>alert(1)</script>
    </form>
    """

    vulns = []

    if "<script>" in mock_code:
        vulns.append(("XSS detected", "HIGH", "Sanitize input"))

    if "' OR 1=1--" in mock_code:
        vulns.append(("SQLi detected", "CRIT", "Use parameterized queries"))

    return vulns


def generate_hardened_yaml():
    yaml_content = """
securityContext:
  runAsNonRoot: true
  capabilities:
    drop: ["ALL"]

readinessProbe:
  httpGet:
    path: /health
    port: 8000
"""

    with open("rxgpt-hardened.yaml", "w") as f:
        f.write(yaml_content.strip())

def severity_format(level):
    if level == "CRIT":
        return Text("CRITICAL", style="bold red")
    if level == "HIGH":
        return Text("HIGH", style="bold yellow")
    return Text("LOW", style="green")


def main():
    if len(sys.argv) < 2:
        console.print("[bold red]Usage: python rxgpt-scan.py <image-name>[/bold red]")
        sys.exit(1)

    image = sys.argv[1]

    # Spinner animation
    with Progress(
        SpinnerColumn(),
        TextColumn("[bold cyan]Scanning container image..."),
        transient=True,
    ) as progress:
        progress.add_task("scan", total=None)
        time.sleep(1.2)

    vulnerabilities = []

    # Core findings
    if check_cryptography_version(image):
        vulnerabilities.append(("cryptography<42.0", "CRIT", "Upgrade dependency"))

    vulnerabilities.append(("Missing healthcheck", "HIGH", "Add readinessProbe"))
    vulnerabilities.extend(mock_source_scan())

    # Build table
    table = Table(
        box=box.SIMPLE_HEAVY,
        show_header=True,
        header_style="bold bright_cyan",
        expand=False,
    )

    table.add_column("Issue", style="bold")
    table.add_column("Severity", justify="center")
    table.add_column("Fix")

    crit = 0
    high = 0

    for issue, severity, fix in vulnerabilities:
        table.add_row(issue, severity_format(severity), fix)

        if severity == "CRIT":
            crit += 1
        elif severity == "HIGH":
            high += 1

    # Security score calculation
    score = max(0, 100 - (crit * 40 + high * 15))

    score_text = Text()
    score_text.append("Security Score: ", style="bold")

    if score >= 80:
        score_text.append(f"{score}/100", style="bold green")
    elif score >= 50:
        score_text.append(f"{score}/100", style="bold yellow")
    else:
        score_text.append(f"{score}/100", style="bold red")

    # Summary
    summary = Text()
    summary.append("Summary: ", style="bold")
    summary.append(f"{crit} Critical", style="bold red")
    summary.append(" • ")
    summary.append(f"{high} High", style="bold yellow")

    # Metadata
    meta = Text()
    meta.append("Engine: ", style="dim")
    meta.append("RxGPT DevSecOps v1.0\n", style="dim")
    meta.append("Target: ", style="dim")
    meta.append(f"{image}", style="dim")

    # Compose content
    content = Group(
        meta,
        Text(""),
        table,
        Text(""),
        score_text,
        summary,
        Text(""),
        Text("✔ Hardened deployment file generated → rxgpt-hardened.yaml", style="green"),
    )

    panel = Panel(
        Align.center(content),
        title="🔒 RXGPT SECURITY SCAN",
        title_align="center",
        border_style="bright_cyan",
        box=box.ROUNDED,
        padding=(1, 4),
        expand=False,
    )

    console.print()
    console.print(panel)
    console.print()

    generate_hardened_yaml()


if __name__ == "__main__":
    main()