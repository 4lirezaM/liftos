import { z } from "zod";

import {
  PROGRAM_TYPE_OPTIONS,
  PROGRAM_DIFFICULTY_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
  PROGRAM_LIMITS,
} from "../constants/programOptions";

const programTypeValues = PROGRAM_TYPE_OPTIONS.map((option) => option.value);

const difficultyValues = PROGRAM_DIFFICULTY_OPTIONS.map(
  (option) => option.value
);

const goalValues = PROGRAM_GOAL_OPTIONS.map((option) => option.value);

const optionalNumber = (min, max, label) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "string") {
        return Number(value);
      }

      return value;
    },
    z
      .number({
        error: `${label} must be a number.`,
      })
      .int(`${label} must be a whole number.`)
      .min(min, `${label} must be at least ${min}.`)
      .max(max, `${label} must be at most ${max}.`)
      .optional()
  );

export const programSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Program name is required.")
    .max(
      PROGRAM_LIMITS.name.maxLength,
      `Program name must be at most ${PROGRAM_LIMITS.name.maxLength} characters.`
    ),

  description: z
    .string()
    .max(
      PROGRAM_LIMITS.description.maxLength,
      `Description must be at most ${PROGRAM_LIMITS.description.maxLength} characters.`
    )
    .optional()
    .default(""),

  goal: z.enum(goalValues, {
    error: "Please select a training goal.",
  }),

  difficulty: z.enum(difficultyValues, {
    error: "Please select a difficulty level.",
  }),

  program_type: z.enum(programTypeValues, {
    error: "Please select a program split.",
  }),

  duration_weeks: optionalNumber(
    PROGRAM_LIMITS.durationWeeks.min,
    PROGRAM_LIMITS.durationWeeks.max,
    "Duration"
  ),

  days_per_week: z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim() !== "") {
        return Number(value);
      }

      return value;
    },
    z
      .number({
        error: "Days per week is required.",
      })
      .int("Days per week must be a whole number.")
      .min(
        PROGRAM_LIMITS.daysPerWeek.min,
        `Days per week must be at least ${PROGRAM_LIMITS.daysPerWeek.min}.`
      )
      .max(
        PROGRAM_LIMITS.daysPerWeek.max,
        `Days per week must be at most ${PROGRAM_LIMITS.daysPerWeek.max}.`
      )
  ),
});
