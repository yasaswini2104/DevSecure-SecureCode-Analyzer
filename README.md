# SecureCode Analyzer

An AI-powered source code vulnerability scanner that detects OWASP Top 10 security issues in real time. Paste any code snippet, click **AI Scan**, and get an instant security report with severity ratings, detailed descriptions, and suggested fixes — all powered by Google Gemini.

---

## Problem Statement

Modern software teams ship code fast, but security reviews are slow, expensive, and often skipped entirely. Developers frequently introduce vulnerabilities such as SQL injection, hardcoded secrets, and command injection without realizing it — leaving applications exposed until a breach occurs or a manual audit catches it.

Existing tools like SonarQube require heavy setup and CI/CD integration, while online linters only catch syntax errors. There is no lightweight, instant, AI-driven tool that a developer can open in a browser, paste code into, and immediately understand the security posture of that code.

**SecureCode Analyzer solves this** by combining a Monaco-powered code editor with a Spring Boot backend that proxies requests to Google Gemini. In seconds, the AI returns a structured JSON report of vulnerabilities — each with a type, line number, severity level, and a concrete fix recommendation. A security score from 0–100 summarizes the overall risk at a glance.

---

## Features

- **AI Vulnerability Detection** — Powered by Google Gemini, detects SQL/NoSQL Injection, XSS, Command Injection, Hardcoded Secrets, Weak Cryptography, Path Traversal, SSRF, and Broken Auth
- **Security Score (0–100)** — Weighted scoring that reflects real risk: meaningful spread across the scale, not just 0 or 100
- **Severity Badges** — Each finding is labelled CRITICAL, HIGH, MEDIUM, or LOW with color-coded cards
- **Suggested Fixes** — Every vulnerability comes with an actionable fix recommendation
- **Multi-language Support** — Java, Python, JavaScript, TypeScript, PHP, C#
- **Scan History** — Last 5 scans are stored in-session and can be restored
- **Export to JSON** — Download full scan reports for audit trails
- **Rate Limiting** — Per-IP rate limiting (configurable) to prevent API abuse
- **Monaco Editor** — Full syntax highlighting, line numbers, and language-aware editing

---

## Architecture
![App Screenshot](images/img.png)

---

## Technologies Used

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Primary language |
| Spring Boot | REST API framework |
| Spring WebFlux (WebClient) | Non-blocking HTTP calls to Gemini API |
| Spring Validation | Request body validation (`@NotBlank`, `@Size`) |
| Bucket4j | Per-IP rate limiting |
| Jackson | JSON serialization / Gemini response parsing |
| Maven | Build and dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool and dev server |
| Monaco Editor | Code editor with syntax highlighting |
| Axios | HTTP client for API calls |
| DOMPurify | XSS sanitization |

### AI / External
| Technology | Purpose |
|---|---|
| Google Gemini (`gemini-3.1-flash-lite-preview`) | AI vulnerability analysis |

---

## Installation

### Prerequisites

Make sure you have the following installed:

- **Java 17+** — [Download](https://www.oracle.com/in/java/technologies/downloads/)
- **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **A Google Gemini API key** — [Get one free](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/securecode-analyzer.git
cd securecode-analyzer
```

---

### 2. Configure the Backend

Open `server/src/main/resources/application.properties` and set your Gemini API key:

```properties
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
```

Other configurable values (defaults shown):

```properties
server.port=8080
scanner.rate-limit.requests-per-minute=5
scanner.cors.allowed-origins=http://localhost:3000
scanner.max-code-length=50000
```

---

### 3. Install Backend Dependencies

```bash
cd server
mvn clean install
```

---

### 4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Usage

### Start the Backend

```bash
cd server
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`. You can verify it is running:

```bash
curl http://localhost:8080/api/health
```

### Start the Frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Open your browser at **http://localhost:3000**.

---

### Using the App

1. **Paste your code** into the Monaco editor (or click **Load Sample** to try the built-in example)
2. **Select the language** from the dropdown (Java, Python, JavaScript, TypeScript, PHP, C#)
3. Click **✨ AI Scan**
4. Review results:
   - The **Security Score** gauge shows overall risk (0–100)
   - Each vulnerability card shows type, line number, severity, description, and a suggested fix
   - Use the **Filter** buttons to focus on a specific severity level
5. Click **⬇ Export JSON** to download the full report

---

### API Usage (Direct)

You can also call the backend directly without the UI:

```bash
curl -X POST http://localhost:8080/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "code": "String q = \"SELECT * FROM users WHERE id=\" + userId;",
    "language": "java"
  }'
```

**Example response:**

```json
{
  "totalIssues": 1,
  "status": "VULNERABILITIES_FOUND",
  "securityScore": 75,
  "scannedAt": "2025-04-08T10:30:00Z",
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "lineNumber": 1,
      "severity": "HIGH",
      "description": "User input is concatenated directly into a SQL query string.",
      "suggestedFix": "Use PreparedStatement with parameterized queries instead."
    }
  ]
}
```

---

## Security Scoring

The score starts at **100** and deductions are applied per finding:

| Severity | Deduction |
|---|---|
| CRITICAL | −25 points |
| HIGH | −15 points |
| MEDIUM | −8 points |
| LOW | −3 points |

The score is floored at **0** and never goes below it. This means a realistic mix of issues produces a meaningful score between 0–100 rather than immediately bottoming out.

| Score Range | Label |
|---|---|
| 80–100 | ✅ Secure |
| 60–79 | 🟡 Moderate Risk |
| 40–59 | 🟠 High Risk |
| 0–39 | 🔴 Critical Risk |

---

## Rate Limiting

The backend enforces per-IP rate limiting on `/api/scan`. The default is **5 requests per minute**, configurable in `application.properties`:

```properties
scanner.rate-limit.requests-per-minute=5
```

Exceeding the limit returns HTTP `429 Too Many Requests`.

---

## Troubleshooting

**"Cannot connect to backend"**
→ Make sure the Spring Boot server is running on port 8080 (`mvn spring-boot:run`)

**"AI service failed. Check API key"**
→ Verify `gemini.api.key` is set correctly in `application.properties` and the key has Gemini API access enabled

**Score always shows 0**
→ You are running an old version of `ScanResponse.java` with aggressive deduction weights. Replace it with the latest version where CRITICAL=25, HIGH=15, MEDIUM=8, LOW=3

**Too many requests error**
→ Wait 60 seconds or increase `scanner.rate-limit.requests-per-minute` in `application.properties`

**Monaco editor not loading**
→ Run `npm install` in the `client/` directory and ensure Node.js 18+ is installed
