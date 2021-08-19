const sumTrials = (interventions) => {
  return interventions.reduce((a, b) => ({
    num_played: a.num_played + b.num_played,
  })).num_played;
};

const sumSuccesses = (interventions) => {
  return interventions.reduce((a, b) => ({
    num_successes: a.num_successes + b.num_successes,
  })).num_successes;
}

export const armProbability = (interventions, intervention_name) => {
  for (const intervention of interventions) {
    if (intervention_name === intervention.intervention_name) {
      if (intervention.num_played >= 100) {
        return (intervention.num_successes/ intervention.num_played)*100;
      }
      return null;
    }
  }
}
export const expList = async () => {
  const res = await fetch(`../private/experiment_list`);
  let data = await res.json();
  if (res.status === 200) {
    data = data[0];
    for (const exp of data) {
      exp.trials = sumTrials(exp.interventions);
      exp.arms = exp.interventions.length;
    }
    return data;
  }
  return new Error("Failed to fetch experiment list.");
};

export const createExp = async (exp) => {
  const res = await fetch(`../private/experiment/beta_binomial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exp),
  });
  return res;
};

export const getExperiment = async (expName) => {
  const res = await fetch(`../private/experiments/${expName}`);
  console.log(res.body);
  if (res.status === 200) {
    const exp = await res.json();
    console.log(exp);
    exp.trials = sumTrials(exp.interventions);
    exp.successes = sumSuccesses(exp.interventions);
    exp.arms = exp.interventions.length;
    return exp;
  }
  throw new Error("Failed to fetch experiment. Please try again.");
};



export const codeSnippet = (expName, armName) => {
  const snippet = 
  `fetch("${window.location.origin}/public/experiments/update", {
    method: "POST",
    body: JSON.stringify({
      key: "${expName}",
      arm_name: "${armName}",
      outcome: 1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
});`;
  return snippet;
};

export const defaultExp = () => {
  return {
    type: "BINARY",
    id_consistency: false,
    experiment_type: "beta_binomial",
    owner_name: "",
    was_updated: false,
    interventions: [
      { intervention_name: "", num_played: 0, num_successes: 0 },
      { intervention_name: "", num_played: 0, num_successes: 0 },
    ],
  };
};

export const getSampling = async (key, user_id=null) => {
  const url = user_id ? `../public/experiments/${key}/get_intervention?user_id=${user_id}` : `../public/experiments/${key}/get_intervention`
  console.log(url);
  const res = await fetch(url);
  if (res.status == 200) {
    const sampledValue = await res.json();
    return sampledValue;
  }
  throw new Error("Failed to sample option. Please try again.");
}