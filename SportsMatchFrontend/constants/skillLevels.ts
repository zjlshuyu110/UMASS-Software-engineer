export const SKILL_LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
  { value: 4, label: "Expert" },
];

/**
 * Get the label for a skill level (1-4)
 * @param level - The skill level number (1-4)
 * @returns The label string or "Unknown" if invalid
 */
export const getSkillLevelLabel = (level: number): string => {
  const skill = SKILL_LEVELS.find(s => s.value === level);
  return skill ? skill.label : "Unknown";
};

