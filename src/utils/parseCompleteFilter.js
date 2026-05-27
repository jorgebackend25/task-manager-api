export const parseCompleteFilter = (complete) => {
  if (complete === undefined) {
    return {
      hasFilter: false,
      completeValue: undefined,
    };
  }

  if (complete !== "true" && complete !== "false") {
    return {
      error: "complete debe ser true o false",
    };
  }

  return {
    hasFilter: true,
    completeValue: complete === "true",
  };
};
