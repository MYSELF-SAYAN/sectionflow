/** Levenshtein distance between two strings */
function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}
/** Return up to `limit` closest matches from `candidates` to `input` */
export function fuzzyMatch(input, candidates, limit = 4) {
    return candidates
        .map((c) => ({ name: c, dist: levenshtein(input.toLowerCase(), c.toLowerCase()) }))
        .filter(({ dist }) => dist <= 5)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, limit)
        .map(({ name }) => name);
}
//# sourceMappingURL=fuzzy-match.js.map