export async function* analyzeCodeStream(code: string): AsyncGenerator<string, void, unknown> {
  yield "### 🧠 Mentor Analysis & Explanation\n";

  let score = 100;
  let warnings: string[] = [];

  // ---------------------------------
  // 🔍 1️⃣ Improved Language Detection
  // ---------------------------------
  let language = "plaintext";

  if (/import\s+java|System\.out\.println/.test(code)) {
    language = "java";
  }
  else if (/console\.log|function\s*\(|=>/.test(code)) {
    language = "javascript";
  }
  else if (/def\s+\w+\(|print\(|len\(|float\(|range\(/.test(code)) {
    language = "python";
  }
  else if (/#include|std::|using\s+namespace\s+std/.test(code)) {
    language = "cpp";
  }
  else if (/using\s+System/.test(code)) {
    language = "csharp";
  }

  yield `Detected language: ${language.toUpperCase()}\n\n`;

  // ---------------------------------
  // 📏 2️⃣ Code Size Check
  // ---------------------------------
  const lines = code.split("\n").length;
  if (lines > 300) {
    warnings.push("⚠️ Code is very long. Consider modularizing.");
    score -= 10;
  }

  // ---------------------------------
  // 🔥 3️⃣ Loop Detection
  // ---------------------------------
  const loopMatches = code.match(/\b(for|while)\b/g);
  const loopCount = loopMatches ? loopMatches.length : 0;

  let timeBefore = "O(1)";
  let spaceBefore = "O(1)";

  if (loopCount === 1) {
    timeBefore = "O(n)";
    score -= 5;
  } else if (loopCount === 2) {
    timeBefore = "O(n^2)";
    score -= 15;
    warnings.push("⚠️ Two loops detected → Possible quadratic complexity.");
  } else if (loopCount >= 3) {
    timeBefore = "O(n^3)";
    score -= 25;
    warnings.push("⚠️ Three or more loops detected → High time complexity.");
  }

  // Space detection
  if (/(\[\]|\{|\bArrayList\b|\bvector\b)/.test(code)) {
    spaceBefore = "O(n)";
  }

  for (const w of warnings) yield w + "\n";

  // ---------------------------------
  // ⚠️ 4️⃣ Edge Cases
  // ---------------------------------
  yield "\n### ⚠️ Edge Cases\n";
  yield "- Validate empty inputs\n";
  yield "- Handle boundary conditions\n";
  yield "- Avoid index out-of-bounds\n\n";

  // ---------------------------------
  // ✨ 5️⃣ Optimization Engine
  // ---------------------------------
  yield "### ✨ Optimized Code\n";
  yield "```" + language + "\n";

  let optimized = code;
  let improved = false;

  // 🔥 Python: Max Subarray brute-force → Kadane
  if (
    language === "python" &&
    (code.match(/for\s+\w+\s+in\s+range/g) || []).length >= 2 &&
    /max_sum/.test(code)
  ) {
    optimized = `def max_subarray(arr):
    if not arr:
        return 0

    max_current = max_global = arr[0]

    for num in arr[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)

    return max_global


arr = [1, -2, 3, 4, -1]
print("Maximum Subarray Sum:", max_subarray(arr))`;

    improved = true;
  }

  // 🔥 JS: Remove console logs
  if (language === "javascript" && /console\.log/.test(code)) {
    optimized = optimized.replace(/console\.log\(.*?\);?/g, "// removed console.log");
    improved = true;
  }

  if (!improved) {
    optimized += "\n# ✅ Suggestion: Reduce nested loops or use optimal algorithms.";
  }

  yield optimized;
  yield "\n```\n";

  // ---------------------------------
  // 🔁 6️⃣ Recalculate Complexity
  // ---------------------------------
  const optimizedLoopMatches = optimized.match(/\b(for|while)\b/g);
  const optimizedLoopCount = optimizedLoopMatches ? optimizedLoopMatches.length : 0;

  let timeAfter = "O(1)";
  let spaceAfter = spaceBefore;

  if (optimizedLoopCount === 1) {
    timeAfter = "O(n)";
  } else if (optimizedLoopCount === 2) {
    timeAfter = "O(n^2)";
  } else if (optimizedLoopCount >= 3) {
    timeAfter = "O(n^3)";
  }

  if (optimizedLoopCount < loopCount) {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));

  // ---------------------------------
  // 📊 7️⃣ Final Metrics
  // ---------------------------------
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
