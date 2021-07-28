export const validateCreate = (newExperiment) => {
  if (newExperiment.key === "") {
    return false;
  }
  for (const option of newExperiment.interventions) {
    if (option.intervention_name === "") {
      return false;
    }
  }
  return true;
};
