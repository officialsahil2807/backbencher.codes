export interface LanguageConfig {
  id: string;
  name: string;
  version: string;
  monacoLang: string;
  extension: string;
  iconColor: string;
  category: "browser" | "sql" | "backend";
  judge0Id?: number;
  pistonLang?: string;
  pistonVersion?: string;
  defaultCode: string;
  sampleInput?: string;
  description: string;
}

export const LANGUAGES: Record<string, LanguageConfig> = {
  python: {
    id: "python",
    name: "Python",
    version: "3.12",
    monacoLang: "python",
    extension: "py",
    iconColor: "#3776AB",
    category: "backend",
    judge0Id: 71,
    pistonLang: "python",
    pistonVersion: "3.12.0",
    description: "High-level, versatile programming language known for readability.",
    sampleInput: "Backbencher\n42",
    defaultCode: `# Python 3.12 on Backbencher.codes
import sys

def main():
    print("⚡ Welcome to Backbencher.codes Online Compiler!")
    
    # Check for stdin input
    lines = sys.stdin.read().splitlines()
    if lines:
        name = lines[0]
        number = lines[1] if len(lines) > 1 else "10"
        print(f"👋 Hello, {name}! Your lucky number squared is {int(number) ** 2}")
    else:
        print("💡 Tip: Enter text in the 'stdin' tab to test interactive input.")
        # Demonstration of list comprehension & formatting
        squares = [x**2 for x in range(1, 6)]
        print(f"Generated squares: {squares}")

if __name__ == "__main__":
    main()
`,
  },

  javascript: {
    id: "javascript",
    name: "JavaScript",
    version: "ES2024",
    monacoLang: "javascript",
    extension: "js",
    iconColor: "#F7DF1E",
    category: "browser",
    description: "The core language of the modern web with instant browser execution.",
    sampleInput: "",
    defaultCode: `// JavaScript Playground on Backbencher.codes
console.log("⚡ Welcome to Backbencher JavaScript Playground!");

function calculateStats(items) {
  const sum = items.reduce((acc, val) => acc + val, 0);
  const avg = sum / items.length;
  return { sum, avg, min: Math.min(...items), max: Math.max(...items) };
}

const numbers = [12, 45, 68, 23, 99, 14, 55];
console.log("Numbers array:", numbers);
console.log("Calculated stats:", calculateStats(numbers));

// Asynchronous simulation
async function runDemo() {
  console.log("⏳ Fetching simulation started...");
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log("✅ Execution completed successfully!");
}

runDemo();
`,
  },

  typescript: {
    id: "typescript",
    name: "TypeScript",
    version: "5.4",
    monacoLang: "typescript",
    extension: "ts",
    iconColor: "#3178C6",
    category: "browser",
    description: "Typed JavaScript with in-browser compilation & immediate execution.",
    sampleInput: "",
    defaultCode: `// TypeScript on Backbencher.codes
interface Developer {
  name: string;
  role: string;
  favoriteLanguages: string[];
  solvedProblems: number;
}

function printDeveloperSummary(dev: Developer): void {
  console.log(\`⚡ Developer Profile: \${dev.name}\`);
  console.log(\`Role: \${dev.role}\`);
  console.log(\`Stack: \${dev.favoriteLanguages.join(", ")}\`);
  console.log(\`Challenges Solved: \${dev.solvedProblems}\`);
}

const user: Developer = {
  name: "Alex Hunter",
  role: "Full Stack Engineer",
  favoriteLanguages: ["TypeScript", "Rust", "Python"],
  solvedProblems: 142,
};

printDeveloperSummary(user);
`,
  },

  html: {
    id: "html",
    name: "HTML / CSS",
    version: "HTML5",
    monacoLang: "html",
    extension: "html",
    iconColor: "#E34F26",
    category: "browser",
    description: "Live responsive browser preview for HTML, CSS, and interactive JavaScript.",
    sampleInput: "",
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Backbencher Live Preview</title>
  <!-- External CSS: Google Fonts & Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap">
  <style>
    body {
      margin: 0;
      padding: 32px;
      background: #0B0B0D;
      color: #F5F5F5;
      font-family: 'Outfit', -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }
    .card {
      background: #141416;
      border: 1px solid #292929;
      border-radius: 16px;
      padding: 36px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 121, 0, 0.15);
      color: #FF7900;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 121, 0, 0.3);
    }
    h1 {
      margin: 0 0 12px 0;
      font-size: 26px;
      color: #F5F5F5;
    }
    p {
      color: #A1A1AA;
      line-height: 1.6;
      font-size: 14px;
      margin-bottom: 24px;
    }
    button {
      background: #FF7900;
      color: #0B0B0D;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.1s, background 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 15px rgba(255, 121, 0, 0.3);
    }
    button:hover {
      background: #FF963D;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 121, 0, 0.4);
    }
    .counter {
      margin-top: 20px;
      font-weight: bold;
      color: #10B981;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <i class="fa-solid fa-bolt"></i> LIVE HTML / CSS / JS SANDBOX
    </div>
    <h1>Backbencher.codes</h1>
    <p>Supports external CSS (Bootstrap, Tailwind, FontAwesome, Google Fonts) & external JS libraries (jQuery, Confetti, Axios, React CDN).</p>
    <button id="clickBtn">
      <i class="fa-solid fa-wand-magic-sparkles"></i> Launch Confetti!
    </button>
    <div id="counter" class="counter">Interactive clicks: 0</div>
  </div>

  <!-- External JS: Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
  <script>
    let count = 0;
    const btn = document.getElementById('clickBtn');
    const counter = document.getElementById('counter');
    btn.addEventListener('click', () => {
      count++;
      counter.textContent = 'Interactive clicks: ' + count;
      if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    });
  </script>
</body>
</html>
`,
  },


  cpp: {
    id: "cpp",
    name: "C++",
    version: "GCC 12 (C++20)",
    monacoLang: "cpp",
    extension: "cpp",
    iconColor: "#00599C",
    category: "backend",
    judge0Id: 54,
    pistonLang: "c++",
    pistonVersion: "10.2.0",
    description: "High performance systems and competitive programming language.",
    sampleInput: "Backbencher\n7",
    defaultCode: `// C++20 on Backbencher.codes
#include <iostream>
#include <vector>
#include <string>
#include <numeric>

int main() {
    std::cout << "⚡ Backbencher.codes C++ Compiler Ready!\\n";

    std::string name;
    int multiplier = 5;

    // Check if input is available in stdin
    if (std::cin >> name) {
        if (std::cin >> multiplier) {
            std::cout << "Greetings, " << name << "! Multiplier is " << multiplier << "\\n";
        } else {
            std::cout << "Greetings, " << name << "!\\n";
        }
    } else {
        std::cout << "Running default algorithm:\\n";
    }

    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int total = std::accumulate(numbers.begin(), numbers.end(), 0);

    std::cout << "Sum of elements: " << total << "\\n";
    std::cout << "Scaled total: " << (total * multiplier) << "\\n";

    return 0;
}
`,
  },

  c: {
    id: "c",
    name: "C",
    version: "GCC 12",
    monacoLang: "c",
    extension: "c",
    iconColor: "#A8B9CC",
    category: "backend",
    judge0Id: 50,
    pistonLang: "c",
    pistonVersion: "10.2.0",
    description: "Low-level, foundational systems language with pointer arithmetic.",
    sampleInput: "Backbencher 10",
    defaultCode: `/* C (GCC) on Backbencher.codes */
#include <stdio.h>

int main() {
    printf("⚡ Backbencher.codes C Compiler\\n");

    char name[100];
    int score = 0;

    if (scanf("%99s %d", name, &score) == 2) {
        printf("Hello %s! Your initial score: %d\\n", name, score);
        printf("Bonus applied (2x): %d\\n", score * 2);
    } else {
        printf("Hello World! Enter '<Name> <Score>' in stdin tab to test user input.\\n");
        printf("Factorial of 5 = %d\\n", 5 * 4 * 3 * 2 * 1);
    }

    return 0;
}
`,
  },

  java: {
    id: "java",
    name: "Java",
    version: "OpenJDK 17",
    monacoLang: "java",
    extension: "java",
    iconColor: "#E76F00",
    category: "backend",
    judge0Id: 62,
    pistonLang: "java",
    pistonVersion: "15.0.2",
    description: "Robust object-oriented programming language with multi-platform JVM.",
    sampleInput: "Backbencher\n100",
    defaultCode: `// Java on Backbencher.codes
import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

class Main {
    public static void main(String[] args) {
        System.out.println("⚡ Welcome to Backbencher.codes Java Compiler!");

        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String name = scanner.next();
            int points = scanner.hasNextInt() ? scanner.nextInt() : 50;
            System.out.println("Student: " + name + " | XP: " + points);
        } else {
            System.out.println("Hello, Java Developer! Run with custom stdin anytime.");
        }

        List<String> topics = new ArrayList<>();
        topics.add("Object Oriented Design");
        topics.add("Concurrency");
        topics.add("JVM Optimizations");

        System.out.println("Learning Track: " + topics);
    }
}
`,
  },

  rust: {
    id: "rust",
    name: "Rust",
    version: "1.78",
    monacoLang: "rust",
    extension: "rs",
    iconColor: "#DEA584",
    category: "backend",
    judge0Id: 73,
    pistonLang: "rust",
    pistonVersion: "1.68.2",
    description: "Memory-safe, high-concurrency systems programming without garbage collection.",
    sampleInput: "",
    defaultCode: `// Rust on Backbencher.codes
fn main() {
    println!("⚡ Backbencher.codes Rust Compiler");
    
    let message = "Zero-cost abstractions & fearless concurrency.";
    println!("Core principle: {}", message);

    let numbers: Vec<i32> = (1..=6).collect();
    let sum: i32 = numbers.iter().sum();

    println!("Vector: {:?}", numbers);
    println!("Computed sum: {}", sum);
}
`,
  },

  sql: {
    id: "sql",
    name: "SQL",
    version: "SQLite 3",
    monacoLang: "sql",
    extension: "sql",
    iconColor: "#00BCF2",
    category: "sql",
    description: "In-memory database sandbox executing real CREATE, INSERT, and SELECT queries.",
    sampleInput: "",
    defaultCode: `-- SQL Playground on Backbencher.codes
-- Executes against an isolated in-memory SQLite sandbox

CREATE TABLE developers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    favorite_language TEXT NOT NULL,
    years_experience INTEGER,
    reputation INTEGER DEFAULT 100
);

INSERT INTO developers (name, favorite_language, years_experience, reputation) VALUES
    ('Ada Lovelace', 'C', 10, 9999),
    ('Alan Turing', 'Python', 8, 9500),
    ('Linus Torvalds', 'C', 15, 8800),
    ('Grace Hopper', 'Rust', 12, 9200),
    ('Guido van Rossum', 'Python', 9, 8700);

-- Query developers filtered by experience
SELECT 
    name, 
    favorite_language, 
    years_experience,
    reputation 
FROM developers 
WHERE years_experience >= 8
ORDER BY reputation DESC;
`,
  },

  dart: {
    id: "dart",
    name: "Dart",
    version: "3.2",
    monacoLang: "dart",
    extension: "dart",
    iconColor: "#0175C2",
    category: "backend",
    judge0Id: 90,
    pistonLang: "dart",
    pistonVersion: "2.19.6",
    description: "Client-optimized language for fast apps on any platform.",
    sampleInput: "",
    defaultCode: `// Dart on Backbencher.codes
void main() {
  print("⚡ Welcome to Backbencher Dart Compiler!");

  final technologies = ["Flutter", "Dart Server", "Wasm"];
  print("Ecosystem highlights: \${technologies.join(', ')}");

  final fibonacci = generateFibonacci(8);
  print("First 8 Fibonacci numbers: \$fibonacci");
}

List<int> generateFibonacci(int count) {
  if (count <= 0) return [];
  if (count == 1) return [0];
  List<int> seq = [0, 1];
  for (int i = 2; i < count; i++) {
    seq.add(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}
`,
  },

  php: {
    id: "php",
    name: "PHP",
    version: "8.3",
    monacoLang: "php",
    extension: "php",
    iconColor: "#777BB4",
    category: "backend",
    judge0Id: 68,
    pistonLang: "php",
    pistonVersion: "8.2.3",
    description: "Widely-used server-side scripting language powering web backends.",
    sampleInput: "",
    defaultCode: `<?php
// PHP on Backbencher.codes
echo "⚡ Backbencher.codes PHP 8.3 Runner\\n";

$frameworks = ["Laravel", "Symfony", "WordPress", "Slim"];
echo "Popular Ecosystems:\\n";
foreach ($frameworks as $index => $item) {
    echo ($index + 1) . ". " . $item . "\\n";
}

$data = [
    "status" => "online",
    "timestamp" => date("Y-m-d H:i:s"),
    "memory_usage" => round(memory_get_usage() / 1024, 2) . " KB"
];

echo "\\nTelemetry Payload:\\n";
echo json_encode($data, JSON_PRETTY_PRINT) . "\\n";
`,
  },

  swift: {
    id: "swift",
    name: "Swift",
    version: "5.9",
    monacoLang: "swift",
    extension: "swift",
    iconColor: "#F05138",
    category: "backend",
    judge0Id: 83,
    pistonLang: "swift",
    pistonVersion: "5.3.3",
    description: "Fast, modern, and type-safe language developed by Apple.",
    sampleInput: "",
    defaultCode: `// Swift on Backbencher.codes
import Foundation

print("⚡ Backbencher.codes Swift Compiler")

struct Challenge {
    let title: String
    let points: Int
    let completed: Bool
}

let quests = [
    Challenge(title: "Variables and Constants", points: 10, completed: true),
    Challenge(title: "Optionals & Unwrapping", points: 20, completed: true),
    Challenge(title: "Concurrency with async/await", points: 40, completed: false)
]

let totalPoints = quests.filter { $0.completed }.reduce(0) { $0 + $1.points }
print("Total Earned Points: \\(totalPoints)")
`,
  },

  kotlin: {
    id: "kotlin",
    name: "Kotlin",
    version: "1.9",
    monacoLang: "kotlin",
    extension: "kt",
    iconColor: "#7F52FF",
    category: "backend",
    judge0Id: 78,
    pistonLang: "kotlin",
    pistonVersion: "1.8.20",
    description: "Modern, concise programming language for JVM and Android.",
    sampleInput: "",
    defaultCode: `// Kotlin on Backbencher.codes
fun main() {
    println("⚡ Backbencher.codes Kotlin Runner")

    val languages = listOf("Kotlin", "Java", "Scala", "Clojure")
    println("JVM Family: \${languages.joinToString(\", \")}")

    val result = (1..10)
        .filter { it % 2 == 0 }
        .map { it * it }

    println("Even squares (1..10): \$result")
}
`,
  },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);
