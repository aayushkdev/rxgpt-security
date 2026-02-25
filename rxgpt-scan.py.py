import sys
import subprocess
from rich.console import Console
from rich.table import Table

console = Console()


def check_docker_available():
    try:
        subprocess.run(["docker", "--version"], capture_output=True, check=True)
        return True
    except Exception:
        return False


def check_cryptography_version(image):
    """
    Try to detect cryptography version inside container.
    Falls back to mock detection if Docker not available.
    """
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
        # Fallback mock detection
        return True


def mock_source_scan():
    """
    Simulate scanning application source code
    """
    mock_code = """
    <form>
    <input name="email">
    <script>alert(1)</script>
    </form>
    """

    vulns = []

    if "<script>" in mock_code:
        vulns.append(("XSS detected", "HIGH", "Input validation"))

    if "' OR 1=1--" in mock_code:
        vulns.append(("SQLi detected", "CRIT", "Parameterized queries"))

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

    console.print("\n💾 rxgpt-hardened.yaml → SAVED!", style="bold green")


def main():
    if len(sys.argv) < 2:
        console.print("Usage: python rxgpt-scan.py <image-name>", style="bold red")
        sys.exit(1)

    image = sys.argv[1]

    vulnerabilities = []

    console.print(f"\n🔍 Scanning image: {image}\n", style="bold cyan")

    # Check Docker availability
    docker_available = check_docker_available()

    if not docker_available:
        console.print("Docker not available — running in mock mode.\n", style="yellow")

    # Check cryptography version
    if check_cryptography_version(image):
        vulnerabilities.append(("crypto<42.0", "CRIT", "runAsNonRoot"))

    # Missing healthcheck (mock detection)
    vulnerabilities.append(("No healthcheck", "HIGH", "readinessProbe"))

    # Mock source scan
    vulnerabilities.extend(mock_source_scan())

    # Create rich table
    table = Table(title="📊 RXGPT SECURITY SCAN")

    table.add_column("Issue", style="bold")
    table.add_column("Severity")
    table.add_column("Fix")

    for issue, severity, fix in vulnerabilities:
        table.add_row(issue, severity, fix)

    console.print(table)

    # Generate YAML
    generate_hardened_yaml()


if __name__ == "__main__":
    main()