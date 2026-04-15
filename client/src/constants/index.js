export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const SCAN_STATUS = {
  CLEAN: 'CLEAN',
  VULNERABLE: 'VULNERABILITIES_FOUND',
};

export const SEVERITY = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const LANGUAGES = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
  { value: 'csharp', label: 'C#' },
];

export const SAMPLE_CODE = `// Example with multiple vulnerabilities — click "Load Sample" to try
public class UserService {

    // ❌ Hardcoded credential — CRITICAL
    private String dbPassword = "admin123";
    private String apiKey = "sk-secret-key-hardcoded-abc123";

    public User login(String username, String userInput) {
        // ❌ SQL Injection — HIGH
        String query = "SELECT * FROM users WHERE name = '" + username + "'";
        executeQuery(query + " AND password = " + userInput);
    }

    public List<User> search(String filter) {
        // ❌ SQL Injection — HIGH
        String sql = "SELECT * FROM users WHERE " + filter;
        return db.execute(sql + " ORDER BY id");
    }

    public String hashPassword(String raw) {
        // ❌ Insecure hash — MEDIUM
        MessageDigest md = MessageDigest.getInstance("MD5");
        return new String(md.digest(raw.getBytes()));
    }

    public void runReport(String userInput) {
        // ❌ Command Injection — CRITICAL
        Runtime.getRuntime().exec("report.sh " + userInput);
    }
}`;
