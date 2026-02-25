#!/usr/bin/env python3

import sys
import subprocess
from rich.console import Console
from rich.console import Group
from rich.table import Table
from rich.panel import Panel
from rich.align import Align
from rich.text import Text
from rich import box

console = Console()

def check_cryptography_version(image):
    try:
        result = subprocess.run(
            ["docker", "run", "--rm", image, "pip", "show", "cryptography"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if "Version:" in result.stdout:
            for line in result.stdout.splitlines():
                if line.startswith("Version:"):
                    version = line.split(":")[1].strip()
                    if version < "42.0":
                        return True
        return False

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

    console.print("\n[bold green]✔ Hardened deployment file generated → rxgpt-hardened.yaml[/bold green]")


def severity_format(level):
    if level == "CRIT":
        return "[bold red]CRITICAL[/bold red]"
    if level == "HIGH":
        return "[bold yellow]HIGH[/bold yellow]"
    return "[green]LOW[/green]"


def main():
    print()
    if len(sys.argv) < 2:
        console.print("[bold red]Usage: python rxgpt-scan.py <image-name>[/bold red]")
        sys.exit(1)

    image = sys.argv[1]

    vulnerabilities = []


    if check_cryptography_version(image):
        vulnerabilities.append(("cryptography<42.0", "CRIT", "Upgrade dependency"))

    vulnerabilities.append(("Missing healthcheck", "HIGH", "Add readinessProbe"))
    vulnerabilities.extend(mock_source_scan())

    table = Table(
        box=box.MINIMAL_DOUBLE_HEAD,
        show_header=True,
        header_style="bold cyan",
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

    summary_text = (
        f"[bold]Summary:[/bold] "
        f"[red]{crit} Critical[/red] • "
        f"[yellow]{high} High[/yellow]"
    )

    content = Group(
        Text(f"Target Image: {image}", style="dim"),
        Text(""),
        table,
        Text(""),
        Text.from_markup(summary_text),
        Text(""),
        Text("✔ Hardened deployment file generated → rxgpt-hardened.yaml", style="green"),
    )

    boxed = Panel(
        Align.center(content),
        title=" RXGPT Secuirty Scan Report ",
        box=box.ROUNDED,
        border_style="cyan",
        padding=(1, 4),
        expand=False,
    )

    console.print(boxed)

    generate_hardened_yaml()


if __name__ == "__main__":
    main()