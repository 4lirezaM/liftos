import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";

import { useCreateProgramDay } from "../../hooks/programDays/useCreateProgramDay";
import { useUpdateProgramDay } from "../../hooks/programDays/useUpdateProgramDay";
import { useProgramDays } from "../../hooks/programDays/useProgramDays";
import { programDaySchema } from "../../schemas/programDaySchema";

const EMPTY_FORM = {
  name: "",
  description: "",
};

const ProgramDayForm = ({
  programId,
  programDay = null,
  onSuccess,
  notify,
}) => {
  const isEditMode = Boolean(programDay?.id);

  const createMutation = useCreateProgramDay();
  const updateMutation = useUpdateProgramDay();

  const {
    data: programDays = [],
    isPending: isLoadingDays,
    isError: isDaysError,
    refetch: refetchDays,
  } = useProgramDays(programId);

  const activeMutation = isEditMode ? updateMutation : createMutation;
  const isSubmitting = activeMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(programDaySchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (isEditMode) {
      reset({
        name: programDay.name ?? "",
        description: programDay.description ?? "",
      });
      return;
    }

    reset(EMPTY_FORM);
  }, [isEditMode, programDay, reset]);

  const showErrorNotification = (error) => {
    notify?.({
      type: "error",
      title: isEditMode ? "Update failed" : "Creation failed",
      message: error?.message || "Something went wrong. Please try again.",
    });
  };

  const handleFormSubmit = async (values) => {
    if (isSubmitting) return;

    if (!programId) {
      showErrorNotification(new Error("Program ID is missing."));
      return;
    }

    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
    };

    if (isEditMode) {
      if (!isDirty) return;

      try {
        await updateMutation.mutateAsync({
          programDayId: programDay.id,
          updates: payload,
        });

        notify?.({
          type: "success",
          title: "Program day updated",
          message: "The program day was updated successfully.",
        });

        onSuccess?.();
      } catch (error) {
        console.error("Program day update failed:", error);
        showErrorNotification(error);
      }

      return;
    }

    if (isLoadingDays || isDaysError) {
      showErrorNotification(
        new Error("Could not determine the next program day position.")
      );
      return;
    }

    const nextPosition =
      Math.max(0, ...programDays.map((day) => Number(day.position) || 0)) + 1;

    try {
      await createMutation.mutateAsync({
        ...payload,
        program_id: programId,
        position: nextPosition,
      });

      notify?.({
        type: "success",
        title: "Program day created",
        message: "The program day was created successfully.",
      });

      reset(EMPTY_FORM);
      onSuccess?.();
    } catch (error) {
      console.error("Program day creation failed:", error);
      showErrorNotification(error);
    }
  };

  const isSubmitDisabled =
    isSubmitting ||
    (!isEditMode && (isLoadingDays || isDaysError)) ||
    (isEditMode && !isDirty);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-visible scrollbar-custom">
        <div className="space-y-6 pb-4">
          <FormField
            label="Program day name"
            htmlFor="program-day-name"
            required
            error={errors.name?.message}
          >
            <input
              {...register("name")}
              id="program-day-name"
              type="text"
              placeholder="e.g. Day 1 - Push"
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.name))}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="program-day-description"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              id="program-day-description"
              rows={4}
              placeholder="Describe the focus of this training day..."
              disabled={isSubmitting}
              className={inputClassName(Boolean(errors.description))}
            />
          </FormField>

          {!isEditMode && isDaysError && (
            <div className="space-y-2 rounded-xl border border-destructive/30 p-3">
              <p className="text-sm text-destructive">
                Couldn’t load program days to determine the next position.
              </p>

              <button
                type="button"
                onClick={() => refetchDays()}
                disabled={isLoadingDays}
                className="text-sm font-medium text-primary hover:underline disabled:opacity-60"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border pt-4">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={[
            "flex h-12 w-full items-center justify-center gap-2",
            "rounded-xl bg-primary px-4 text-sm font-semibold",
            "text-primary-foreground transition hover:opacity-90",
            "active:scale-[0.99] disabled:cursor-not-allowed",
            "disabled:opacity-60",
          ].join(" ")}
        >
          {isSubmitting || (!isEditMode && isLoadingDays) ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : "Loading..."}
            </>
          ) : (
            <>
              <Check size={18} />
              {isEditMode ? "Save Changes" : "Create Program Day"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const FormField = ({ label, htmlFor, required = false, error, children }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
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

export default ProgramDayForm;
