export const PROGRAM_SORT_OPTIONS = [
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "recently_added", label: "Recently Added" },
  { value: "recently_updated", label: "Recently Updated" },
];

export const DEFAULT_PROGRAM_SORT = "name_asc";
export const PROGRAM_TYPE_FILTER_OPTIONS = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "push_pull_legs", label: "Push / Pull / Legs" },
  { value: "bro_split", label: "Bro Split" },
  { value: "arnold_split", label: "Arnold Split" },
  { value: "custom", label: "Custom" },
];

export const PROGRAM_GOAL_FILTER_OPTIONS = [
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "strength", label: "Strength" },
  { value: "fat_loss", label: "Fat Loss" },
  { value: "general_fitness", label: "General Fitness" },
];

export const PROGRAM_DIFFICULTY_FILTER_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const DEFAULT_PROGRAM_FILTERS = {
  programType: [],
  goal: [],
  difficulty: [],
};
