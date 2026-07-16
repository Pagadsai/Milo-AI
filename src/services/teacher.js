const TEACH_KEYWORDS = [
  "teach",
  "learn",
  "course",
  "lesson",
  "study",
  "roadmap",
  "tutorial",
  "beginner",
  "start",
  "master",
];

export function isTeachingRequest(question) {
  const lower = question.toLowerCase();

  return TEACH_KEYWORDS.some(word =>
    lower.includes(word)
  );
}