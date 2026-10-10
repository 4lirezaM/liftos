import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Loader2 } from "lucide-react";

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
    control,
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
      duration_weeks:
        values.duration_weeks === "" || values.duration_weeks == null
          ? null
          : Number(values.duration_weeks),
      days_per_week: Number(values.days_per_week),
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
      console.error("Program submission failed:", error);
      showErrorNotification(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Scrollable content */}
      <div className="min-h-0 flex-1  overflow-visible scrollbar-custom">
        <div className="space-y-6 pb-4">
          {/* Program name */}
          <FormField label="Program name" required error={errors.name?.message}>
            <input
              {...register("name")}
              id="program-name"
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
              id="program-description"
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

          {/* Training goal */}
          <FormField
            label="Training goal"
            required
            error={errors.goal?.message}
          >
            <Controller
              name="goal"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  id="program-goal"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={PROGRAM_GOAL_OPTIONS}
                  placeholder="Select a goal"
                  disabled={isSubmitting}
                  hasError={Boolean(errors.goal)}
                />
              )}
            />
          </FormField>

          {/* Difficulty */}
          <FormField
            label="Difficulty"
            required
            error={errors.difficulty?.message}
          >
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  id="program-difficulty"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={PROGRAM_DIFFICULTY_OPTIONS}
                  placeholder="Select difficulty"
                  disabled={isSubmitting}
                  hasError={Boolean(errors.difficulty)}
                />
              )}
            />
          </FormField>

          {/* Program split */}
          <FormField
            label="Program split"
            required
            error={errors.program_type?.message}
          >
            <Controller
              name="program_type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  id="program-type"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={PROGRAM_TYPE_OPTIONS}
                  placeholder="Select a program type"
                  disabled={isSubmitting}
                  hasError={Boolean(errors.program_type)}
                />
              )}
            />
          </FormField>

          {/* Duration and days per week */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Duration (weeks)"
              error={errors.duration_weeks?.message}
            >
              <input
                {...register("duration_weeks")}
                id="program-duration"
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
                id="program-days-per-week"
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
          className={[
            "flex h-12 w-full items-center justify-center gap-2",
            "rounded-xl bg-primary px-4 text-sm font-semibold",
            "text-primary-foreground transition hover:opacity-90",
            "active:scale-[0.99] disabled:cursor-not-allowed",
            "disabled:opacity-60",
          ].join(" ")}
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

/* Custom select menu */
const CustomSelect = ({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled = false,
  hasError = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
        onBlur?.();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onBlur]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-invalid={hasError}
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex min-h-12 w-full items-center justify-between gap-3",
          "rounded-xl border bg-background px-3 py-3",
          "text-left text-sm text-foreground",
          "transition-colors hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary/50",
          "disabled:cursor-not-allowed disabled:opacity-60",
          hasError ? "border-destructive" : "border-border",
          open ? "border-primary" : "",
        ].join(" ")}
      >
        <span
          className={
            selectedOption ? "truncate" : "truncate text-muted-foreground"
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={[
            "size-4 shrink-0 text-muted-foreground",
            "transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={id}
          className={[
            "absolute inset-x-0 top-full z-popover mt-2",
            "max-h-60 overflow-y-auto scrollbar-custom",
            "rounded-xl border border-border",
            "bg-background p-1.5 shadow-lg",
          ].join(" ")}
        >
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  onBlur?.();
                  setOpen(false);
                }}
                className={[
                  "flex min-h-10 w-full items-center",
                  "justify-between gap-3 rounded-lg px-3 py-2",
                  "text-left text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-primary/50",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
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

const inputClassName = (hasError = false) =>
  [
    "w-full rounded-xl border bg-background px-3 py-3",
    "text-sm text-foreground outline-none",
    "placeholder:text-muted-foreground transition",
    "focus:border-primary focus:ring-1 focus:ring-primary",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError ? "border-destructive" : "border-border",
  ].join(" ");

export default ProgramForm;
