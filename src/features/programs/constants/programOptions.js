export const PROGRAM_TYPES = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "push_pull_legs", label: "Push / Pull / Legs" },
  { value: "bro_split", label: "Bro Split" },
  { value: "arnold_split", label: "Arnold Split" },
  { value: "custom", label: "Custom" },
];

export const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const PROGRAM_GOALS = [
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "strength", label: "Strength" },
  { value: "fat_loss", label: "Fat Loss" },
  { value: "general_fitness", label: "General Fitness" },
];

export const PROGRAM_LIMITS = {
  name: {
    minLength: 1,
    maxLength: 100,
  },
  description: {
    maxLength: 1000,
  },
  durationWeeks: {
    min: 1,
    max: 52,
  },
  daysPerWeek: {
    min: 1,
    max: 7,
  },
};
