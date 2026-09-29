import {
    PRIMARY_MUSCLES,
    SECONDARY_MUSCLES,
    EQUIPMENT,
  } from "./exerciseTaxonomy";
  
  export const DEFAULT_EXERCISE_FILTERS = {
    source: "all",
    primaryMuscle: [],
    secondaryMuscles: [],
    equipment: [],
    archived: false,
  };
  
  export const DEFAULT_EXERCISE_SORT = "name_asc";
  
  const formatFilterLabel = (value) =>
    value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  
  export const SOURCE_FILTER_OPTIONS = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "system",
      label: "System",
    },
    {
      value: "my",
      label: "My Exercises",
    },
  ];
  
  export const ARCHIVED_FILTER_OPTIONS = [
    {
      value: null,
      label: "All",
    },
    {
      value: false,
      label: "Active",
    },
    {
      value: true,
      label: "Archived",
    },
  ];
  
  export const PRIMARY_MUSCLE_FILTER_OPTIONS = PRIMARY_MUSCLES.map((value) => ({
    value,
    label: formatFilterLabel(value),
  }));
  
  export const SECONDARY_MUSCLE_FILTER_OPTIONS = SECONDARY_MUSCLES.map(
    (value) => ({
      value,
      label: formatFilterLabel(value),
    })
  );
  
  export const EQUIPMENT_FILTER_OPTIONS = EQUIPMENT.map((value) => ({
    value,
    label: formatFilterLabel(value),
  }));
  