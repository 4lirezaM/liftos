import { useEffect, useMemo, useState } from "react";

import { Check, Loader2, AlertTriangle } from "lucide-react";

import { useAuth } from "@/features/auth/contexts/AuthContext";
import { getExercises } from "../../api/exercises.api";
import { useExerciseMutations } from "../../hooks/useExerciseMutations";
import {
  BODY_REGIONS,
  PRIMARY_MUSCLES,
  SECONDARY_MUSCLES,
  EQUIPMENT,
} from "../../constants/exerciseTaxonomy";
import { MultiSelectionGroup } from "./MultiSelectionGroup";
import { SelectionGroup } from "./SelectionGroup";

const INITIAL_FORM = {
  name: "",
  description: "",
  bodyRegion: "",
  primaryMuscle: "",
  secondaryMuscles: [],
  equipment: "",
};

const ExerciseForm = ({
  mode = "create",
  exercise = null,
  onSuccess,
  notify,
}) => {
  const isEditMode = mode === "edit";

  const { user } = useAuth();

  const { createExerciseAsync, updateExerciseAsync, isCreating, isUpdating } =
    useExerciseMutations();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [duplicateExercise, setDuplicateExercise] = useState(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const isSubmitting = isCreating || isUpdating;

  /*
   * --------------------------------------------------
   * Load form when editing
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!isEditMode || !exercise) {
      setForm(INITIAL_FORM);
      return;
    }

    setForm({
      name: exercise.name ?? "",
      description: exercise.description ?? "",
      bodyRegion: exercise.body_region ?? "",
      primaryMuscle: exercise.primary_muscle ?? "",
      secondaryMuscles: exercise.secondary_muscles ?? [],
      equipment: exercise.equipment ?? "",
    });

    setErrors({});
    setDuplicateExercise(null);
  }, [isEditMode, exercise]);

  /*
   * --------------------------------------------------
   * Options
   * --------------------------------------------------
   */

  const primaryMuscleOptions = useMemo(() => PRIMARY_MUSCLES, []);

  const secondaryMuscleOptions = useMemo(() => SECONDARY_MUSCLES, []);

  const bodyRegionOptions = useMemo(() => BODY_REGIONS, []);

  const equipmentOptions = useMemo(() => EQUIPMENT, []);

  /*
   * --------------------------------------------------
   * Helpers
   * --------------------------------------------------
   */

  const formatOptionLabel = (value) => {
    if (!value) return "";

    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const clearFieldError = (field) => {
    setErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];

      return next;
    });
  };

  /*
   * --------------------------------------------------
   * Field changes
   * --------------------------------------------------
   */

  const handleTextChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    clearFieldError(name);

    if (name === "name") {
      setDuplicateExercise(null);
    }
  };

  const handleSingleSelect = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field] === value ? "" : value,
    }));

    clearFieldError(field);
  };

  const handleSecondaryMuscleToggle = (value) => {
    setForm((current) => {
      const exists = current.secondaryMuscles.includes(value);

      return {
        ...current,
        secondaryMuscles: exists
          ? current.secondaryMuscles.filter((item) => item !== value)
          : [...current.secondaryMuscles, value],
      };
    });

    clearFieldError("secondaryMuscles");
  };

  /*
   * --------------------------------------------------
   * Validation
   * --------------------------------------------------
   */

  const validate = () => {
    const nextErrors = {};

    const name = form.name.trim();

    if (!name) {
      nextErrors.name = "Exercise name is required.";
    }

    if (!form.primaryMuscle) {
      nextErrors.primaryMuscle = "Primary muscle is required.";
    } else if (!primaryMuscleOptions.includes(form.primaryMuscle)) {
      nextErrors.primaryMuscle = "Invalid primary muscle.";
    }

    if (form.bodyRegion && !bodyRegionOptions.includes(form.bodyRegion)) {
      nextErrors.bodyRegion = "Invalid body region.";
    }

    const invalidSecondaryMuscle = form.secondaryMuscles.some(
      (muscle) => !secondaryMuscleOptions.includes(muscle)
    );

    if (invalidSecondaryMuscle) {
      nextErrors.secondaryMuscles =
        "One or more secondary muscles are invalid.";
    }

    if (form.equipment && !equipmentOptions.includes(form.equipment)) {
      nextErrors.equipment = "Invalid equipment.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /*
   * --------------------------------------------------
   * Duplicate check
   * --------------------------------------------------
   *
   * This is a warning only.
   *
   * It never blocks creation/update.
   * --------------------------------------------------
   */

  const checkForDuplicate = async () => {
    const name = form.name.trim();

    if (!name || !user?.id) {
      setDuplicateExercise(null);
      return;
    }

    setIsCheckingDuplicate(true);

    try {
      const result = await getExercises({
        search: name,
        source: "my",
        userId: user.id,
        archived: false,
        sort: "name_asc",
        page: 1,
        limit: 20,
      });

      const normalizedName = name.toLowerCase();

      const duplicate = result.data?.find((item) => {
        if (isEditMode && item.id === exercise?.id) {
          return false;
        }

        return item.name.trim().toLowerCase() === normalizedName;
      });

      setDuplicateExercise(duplicate ?? null);
    } catch {
      /*
       * Duplicate detection is intentionally non-critical.
       *
       * If it fails, the user can still create/update the exercise.
       */
      setDuplicateExercise(null);
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  /*
   * --------------------------------------------------
   * Payload
   * --------------------------------------------------
   */

  const buildPayload = () => {
    return {
      name: form.name.trim(),

      description: form.description.trim() || null,

      bodyRegion: form.bodyRegion || null,

      primaryMuscle: form.primaryMuscle,

      secondaryMuscles:
        form.secondaryMuscles.length > 0 ? form.secondaryMuscles : null,

      equipment: form.equipment || null,
    };
  };

  /*
   * --------------------------------------------------
   * Notifications
   * --------------------------------------------------
   */

  const showSuccessNotification = () => {
    if (!notify) return;

    notify({
      type: "success",
      title: isEditMode ? "Exercise updated" : "Exercise created",
      message: isEditMode
        ? "The exercise was updated successfully."
        : "The exercise was created successfully.",
    });
  };

  const showErrorNotification = (error) => {
    if (!notify) return;

    notify({
      type: "error",
      title: isEditMode ? "Update failed" : "Creation failed",
      message: error?.message || "Something went wrong. Please try again.",
    });
  };

  /*
   * --------------------------------------------------
   * Submit
   * --------------------------------------------------
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const isValid = validate();

    if (!isValid) {
      return;
    }

    /*
     * Duplicate detection is deliberately performed
     * after validation and before mutation.
     *
     * It is only a warning.
     */
    await checkForDuplicate();

    const payload = buildPayload();

    try {
      if (isEditMode) {
        await updateExerciseAsync({
          id: exercise.id,
          ...payload,
        });
      } else {
        await createExerciseAsync(payload);
      }

      showSuccessNotification();

      onSuccess?.();
    } catch (error) {
      showErrorNotification(error);
    }
  };

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      {/* =========================
          Scrollable content
          ========================= */}

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-custom">
        <div className="space-y-6 pb-4">
          {/* Name */}

          <FormField label="Exercise name" required error={errors.name}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleTextChange}
              placeholder="e.g. Barbell Bench Press"
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.name))}
            />
          </FormField>

          {/* Duplicate warning */}

          {duplicateExercise && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  A similar exercise already exists
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {duplicateExercise.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You can still {isEditMode ? "save" : "create"} this exercise.
                </p>
              </div>
            </div>
          )}

          {isCheckingDuplicate && (
            <p className="text-xs text-muted-foreground">
              Checking for similar exercises…
            </p>
          )}

          {/* Description */}

          <FormField label="Description" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleTextChange}
              placeholder="Describe the exercise..."
              rows={4}
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.description))}
            />
          </FormField>

          {/* Body Region */}

          <SelectionGroup
            label="Body Region"
            options={bodyRegionOptions}
            value={form.bodyRegion}
            onChange={(value) => handleSingleSelect("bodyRegion", value)}
            disabled={isSubmitting}
            error={errors.bodyRegion}
          />

          {/* Primary Muscle */}

          <SelectionGroup
            label="Primary Muscle"
            required
            options={primaryMuscleOptions}
            value={form.primaryMuscle}
            onChange={(value) => handleSingleSelect("primaryMuscle", value)}
            disabled={isSubmitting}
            error={errors.primaryMuscle}
          />

          {/* Secondary Muscles */}

          <MultiSelectionGroup
            label="Secondary Muscles"
            options={secondaryMuscleOptions}
            values={form.secondaryMuscles}
            onChange={handleSecondaryMuscleToggle}
            disabled={isSubmitting}
            error={errors.secondaryMuscles}
          />

          {/* Equipment */}

          <SelectionGroup
            label="Equipment"
            options={equipmentOptions}
            value={form.equipment}
            onChange={(value) => handleSingleSelect("equipment", value)}
            disabled={isSubmitting}
            error={errors.equipment}
          />
        </div>
      </div>

      {/* =========================
          Fixed footer
          ========================= */}

      <div className="shrink-0 border-t border-border pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-4
            text-sm
            font-semibold
            text-primary-foreground
            transition
            hover:opacity-90
            active:scale-[0.99]
            disabled:cursor-not-allowed
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

              {isEditMode ? "Save Changes" : "Create Exercise"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/*
 * ==================================================
 * FormField
 * ==================================================
 */

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

/*
 * ==================================================
 * Input styles
 * ==================================================
 */

const inputClassName = (hasError = false) => {
  return `
    w-full
    rounded-xl
    border
    bg-background
    px-3
    py-3
    text-sm
    text-foreground
    outline-none
    placeholder:text-muted-foreground
    transition
    focus:border-primary
    focus:ring-1
    focus:ring-primary
    disabled:cursor-not-allowed
    disabled:opacity-60
    ${hasError ? "border-destructive" : "border-border"}
  `;
};

/*
 * ==================================================
 * Label formatter
 * ==================================================
 */

export const formatLabel = (value) => {
  if (!value) return "";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default ExerciseForm;
