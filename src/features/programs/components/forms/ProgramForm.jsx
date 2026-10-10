import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";

import { useCreateProgram } from "../../hooks/programs/useCreateProgram";
import { useUpdateProgram } from "../../hooks/programs/useUpdateProgram";

import { programSchema } from "../../schemas/programSchema";

import {
  PROGRAM_TYPE_OPTIONS,
  PROGRAM_DIFFICULTY_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
  PROGRAM_LIMITS,
} from "../../constants/programOptions";

const EMPTY_FORM = {
  name: "",
  description: "",
  goal: "",
  difficulty: "",
  program_type: "",
  duration_weeks: "",
  days_per_week: "",
};

const ProgramForm = ({
  mode = "create",
  program = null,
  onSuccess,
  notify,
}) => {
  const isEditMode = mode === "edit";

  const createMutation = useCreateProgram();
  const updateMutation = useUpdateProgram();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (isEditMode && program) {
      reset({
        name: program.name ?? "",
        description: program.description ?? "",
        goal: program.goal ?? "",
        difficulty: program.difficulty ?? "",
        program_type: program.program_type ?? "",
        duration_weeks: program.duration_weeks ?? "",
        days_per_week: program.days_per_week ?? "",
      });
    } else {
      reset(EMPTY_FORM);
    }
  }, [isEditMode, program, reset]);

  const showErrorNotification = (error) => {
    notify?.({
      type: "error",
      title: isEditMode ? "Update failed" : "Creation failed",
      message: error?.message || "Something went wrong. Please try again.",
    });
  };

  const handleFormSubmit = async (values) => {
    if (isSubmitting) return;

    if (isEditMode && !program?.id) {
      showErrorNotification(new Error("Program ID is missing."));
      return;
    }

    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
      goal: values.goal,
      difficulty: values.difficulty,
      program_type: values.program_type,
      duration_weeks: values.duration_weeks ?? null,
      days_per_week: values.days_per_week,
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          programId: program.id,
          updates: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      notify?.({
        type: "success",
        title: isEditMode ? "Program updated" : "Program created",
        message: isEditMode
          ? "The program was updated successfully."
          : "The program was created successfully.",
      });

      onSuccess?.();
    } catch (error) {
      showErrorNotification(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-custom">
        <div className="space-y-6 pb-4">
          {/* Program name */}
          <FormField label="Program name" required error={errors.name?.message}>
            <input
              {...register("name")}
              type="text"
              maxLength={PROGRAM_LIMITS.name.maxLength}
              placeholder="e.g. Upper Lower Hypertrophy"
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.name))}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={4}
              maxLength={PROGRAM_LIMITS.description.maxLength}
              placeholder="Describe your training program..."
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.description))}
            />

            <p className="text-right text-xs text-muted-foreground">
              Maximum {PROGRAM_LIMITS.description.maxLength} characters
            </p>
          </FormField>

          {/* Goal */}
          <FormField
            label="Training goal"
            required
            error={errors.goal?.message}
          >
            <select
              {...register("goal")}
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.goal))}
            >
              <option value="">Select a goal</option>

              {PROGRAM_GOAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Difficulty */}
          <FormField
            label="Difficulty"
            required
            error={errors.difficulty?.message}
          >
            <select
              {...register("difficulty")}
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.difficulty))}
            >
              <option value="">Select difficulty</option>

              {PROGRAM_DIFFICULTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Program type */}
          <FormField
            required
            label="Program split"
            error={errors.program_type?.message}
          >
            <select
              {...register("program_type")}
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.program_type))}
            >
              <option value="">Select a program type</option>

              {PROGRAM_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Duration and days per week */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Duration (weeks)"
              error={errors.duration_weeks?.message}
            >
              <input
                {...register("duration_weeks")}
                type="number"
                min={PROGRAM_LIMITS.durationWeeks.min}
                max={PROGRAM_LIMITS.durationWeeks.max}
                step={1}
                placeholder="e.g. 12"
                disabled={isSubmitting}
                className={inputClassName(Boolean(errors.duration_weeks))}
              />
            </FormField>

            <FormField
              label="Days per week"
              required
              error={errors.days_per_week?.message}
            >
              <input
                {...register("days_per_week")}
                type="number"
                min={PROGRAM_LIMITS.daysPerWeek.min}
                max={PROGRAM_LIMITS.daysPerWeek.max}
                step={1}
                placeholder="e.g. 4"
                disabled={isSubmitting}
                className={inputClassName(Boolean(errors.days_per_week))}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="shrink-0 border-t border-border pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            flex h-12 w-full items-center justify-center gap-2
            rounded-xl bg-primary px-4 text-sm font-semibold
            text-primary-foreground transition hover:opacity-90
            active:scale-[0.99] disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {isEditMode ? "Saving..." : "Creating..."}
            </>
          ) : (
            <>
              <Check size={18} />
              {isEditMode ? "Save Changes" : "Create Program"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const FormField = ({ label, required = false, error, children }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}

        {required && <span className="ml-1 text-primary">*</span>}
      </label>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

const inputClassName = (hasError = false) => `
  w-full rounded-xl border bg-background px-3 py-3
  text-sm text-foreground outline-none
  placeholder:text-muted-foreground transition
  focus:border-primary focus:ring-1 focus:ring-primary
  disabled:cursor-not-allowed disabled:opacity-60
  ${hasError ? "border-destructive" : "border-border"}
`;

export default ProgramForm;
