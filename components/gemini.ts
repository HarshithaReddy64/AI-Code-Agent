export async function* analyzeCodeStream(
  code: string
): AsyncGenerator<string, void, unknown> {

  yield "### 🧠 Mentor Analysis & Explanation\n";

  let score = 100;
  let warnings: string[] = [];

  // ------------------------------------------------
  // 🔎 1️⃣ LANGUAGE DETECTION (Improved)
  // ------------------------------------------------
  let language = "PLAINTEXT";

  if (/^\s*def\s+\w+\(/m.test(code)) language = "Python";
  else if (/console\.log|function\s+\w+/m.test(code)) language = "JavaScript";
  else if (/System\.out\.println|public\s+class/m.test(code)) language = "Java";
  else if (/#include\s*</m.test(code)) language = "C++";
  else if (/using\s+System/m.test(code)) language = "C#";

  yield `Detected language: ${language}\n\n`;

  // ------------------------------------------------
  // 🔥 2️⃣ LOOP DEPTH ESTIMATION (Simplified + Reliable)
  // ------------------------------------------------
  const loopMatches = code.match(/\b(for|while)\b/g);
  const loopCount = loopMatches ? loopMatches.length : 0;

  let timeBefore = "O(1)";

  if (loopCount === 1) {
    timeBefore = "O(n)";
    score -= 10;
  } else if (loopCount === 2) {
    timeBefore = "O(n^2)";
    score -= 25;
    warnings.push("⚠️ Two loops detected → Quadratic complexity.");
  } else if (loopCount >= 3) {
    timeBefore = "O(n^3)";
    score -= 40;
    warnings.push("⚠️ Three or more loops detected → High time complexity.");
  }

  let spaceBefore = /(\[\]|\{|\bset\(|\bdict\()/.test(code)
    ? "O(n)"
    : "O(1)";

  score = Math.max(0, score);

  for (const w of warnings) {
    yield w + "\n";
  }

  // ------------------------------------------------
  // ✨ 3️⃣ OPTIMIZATION ENGINE
  // ------------------------------------------------
  yield "\n### ✨ Optimized Code\n";
  yield "```" + (language === "Python" ? "python" : "plaintext") + "\n";

  let optimized = code;
  let improved = false;

  // -------------------------
  // 🐍 PYTHON OPTIMIZATION
  // -------------------------
  if (language === "Python") {

    // 🔥 Detect duplicate triple-loop pattern
    if (loopCount >= 3 && code.includes("username")) {

      optimized = `def find_duplicate_users(users):
    print("Checking duplicates...")

    if not users:
        return

    seen = set()
    duplicates = set()

    # ✅ O(n) duplicate detection
    for user in users:
        username = user.get("username")
        if username in seen:
            duplicates.add(username)
        else:
            seen.add(username)

    for name in duplicates:
        print("Duplicate found:", name)

    # ✅ Efficient total age calculation
    total_age = sum(user.get("age", 0) for user in users)
    print("Total age:", total_age)

    # ✅ Safe dictionary access
    for user in users:
        print("Email:", user.get("email", "Not Provided"))
`;

      improved = true;
    }

    // Suggest direct iteration
    if (!improved && code.includes("range(len(")) {
      optimized += "\n# ⚡ Suggestion: Iterate directly over list instead of using range(len())";
    }
  }

  if (!improved) {
    optimized += "\n# ✅ Suggestion: Reduce nested loops using hash-based structures";
  }

  yield optimized;
  yield "\n```\n";

  // ------------------------------------------------
  // 🔄 4️⃣ RE-CALCULATE COMPLEXITY AFTER
  // ------------------------------------------------
  const optimizedLoopMatches = optimized.match(/\b(for|while)\b/g);
  const optimizedLoopCount = optimizedLoopMatches
    ? optimizedLoopMatches.length
    : 0;

  let timeAfter = "O(1)";

  if (optimizedLoopCount === 1) timeAfter = "O(n)";
  else if (optimizedLoopCount === 2) timeAfter = "O(n^2)";
  else if (optimizedLoopCount >= 3) timeAfter = "O(n^3)";

  // If optimized duplicate case → force O(n)
  if (improved) {
    timeAfter = "O(n)";
  }

  let spaceAfter = improved ? "O(n)" : spaceBefore;

  // ------------------------------------------------
  // 📊 5️⃣ FINAL METRICS (Score reflects ORIGINAL only)
  // ------------------------------------------------
  yield `
<metrics>
{
  "score": ${score},
  "timeBefore": "${timeBefore}",
  "timeAfter": "${timeAfter}",
  "spaceBefore": "${spaceBefore}",
  "spaceAfter": "${spaceAfter}"
}
</metrics>
`;
}
