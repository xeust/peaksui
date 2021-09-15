const sumTrials = (interventions) => {
  return interventions.reduce((a, b) => ({
    num_played: a.num_played + b.num_played,
  })).num_played;
};
const sumTrialsGaussian = (interventions) => {
  return interventions.reduce((a, b) => ({
    trials: a.trials + b.trials
  })).trials
}

const sumSuccesses = (interventions) => {
  return interventions.reduce((a, b) => ({
    num_successes: a.num_successes + b.num_successes,
  })).num_successes;
};

export const armProbability = (interventions, intervention_name) => {
  for (const intervention of interventions) {
    if (intervention_name === intervention.intervention_name) {
      if (intervention.num_played >= 100) {
        return (intervention.num_successes / intervention.num_played) * 100;
      }
      return null;
    }
  }
};
export const getNumPlayed = (interventions, intervention_name) => {
  for (const intervention of interventions) {
    if (intervention_name === intervention.intervention_name) {

      return intervention.num_played
    }
  }
};
export const getNumSuccesses = (interventions, intervention_name) => {
  for (const intervention of interventions) {
    if (intervention_name === intervention.intervention_name) {

      return intervention.num_successes
    }
  }
};

export const getInterventionMean = (interventions, intervention_name) => {
  for (const intervention of interventions) {
    if (intervention_name === intervention.intervention_name) {
      return intervention.mean
    }
  }
}
export const getInterventionStd = (interventions, intervention_name) => {
  for (const intervention of interventions) {
    if (intervention_name === intervention.intervention_name) {
      return intervention.std
    }
  }
}

export const list = async () => {
  const res = await fetch(`../private/experiment_list`);
  let data = await res.json();
  if (res.status === 200) {
    data = data[0];
    for (const exp of data) {
      exp.trials = exp.experiment_type === "beta_binomial" ? sumTrials(exp.interventions) : sumTrialsGaussian(exp.interventions)
      if (isNaN(exp.trials) || exp.trials === undefined) {
        exp.trials = 0
      }
      exp.arms = exp.interventions.length;
    }
    return data;
  }
  return new Error("Failed to fetch experiment list.");
};

export const createBetaBinomial = async (exp) => {
  const res = await fetch(`../private/experiment/beta_binomial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exp),
  });
  return res;
};

export const createGaussian = async (exp) => {
  const res = await fetch(`../private/experiment/gaussian`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exp),
  });
  return res;
};

export const get = async (key) => {
  const res = await fetch(`../private/experiments/${key}`);
  if (res.status == 200) {
    const exp = await res.json();
    exp.trials = exp.experiment_type === "beta_binomial" ? sumTrials(exp.interventions) : sumTrialsGaussian(exp.interventions)
    exp.successes = sumSuccesses(exp.interventions);
    exp.arms = exp.interventions.length;
    return exp;
  }
  throw new Error("Failed to fetch experiment. Please try again.");
};

export const del = async (key) => {
  const res = await fetch(`../private/experiment/delete?key=${key}`, {
    method: "DELETE"
  })
  if (res.status == 200) {
    return key;
  }
  throw new Error("Failed to delete experiment. Please try again.")
}
export const updateConsistency = async (name, user) => {
  const res = await fetch(`../private/consistent_intervention/delete?experiment_name=${name}&user_id=${user}`, {
    method: "DELETE"
  })
  if (res.status == 200) {
    return user;
  }
  throw new Error("Failed to update experiment. Please try again.")
}

export const gaussian = () => {
  return {
    owner_name: "",
    name: "",
    id_consistency: false,
    type: "gaussian",
    was_updated: false,
    interventions: [
      {
        intervention_name: "",
        mean: 0,
        std: 1,
        trials: 0,
        sum_x: 0,
        sum_x_squared: 0,
      },
    ],
    experiment_type: "gaussian",
  };
};
export const betaBinomial = () => {
  return {
    owner_name: "",
    name: "",
    id_consistency: false,
    type: "beta_binomial",
    was_updated: false,
    interventions: [
      {
        intervention_name: "",
        num_played: 0,
        num_successes: 0,
      },
    ],
    experiment_type: "beta_binomial",
  };
};

export const sample = async (key, user = null) => {
  const url = user
    ? `../public/experiments/${key}/get_intervention?user_id=${user}`
    : `../public/experiments/${key}/get_intervention`;
  const res = await fetch(url);
  if (res.status == 200) {
    const body = await res.json();
    return body;
  }
  throw new Error("Failed to sample option. Please try again.");
};

export const codeSnippet = (key, arm, language) => {
  const jsSnippet = `fetch("${window.location.origin}/public/experiments/update", {
    method: "POST",
    body: JSON.stringify({
      key: "${key}",
      arm_name: "${arm}",
      outcome: 1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
});`;

  const pySnippet = `import requests as r
import json

req = r.post('${window.location.origin}/public/experiments/update',
    body=json.loads({
    'key': '${key}',
    'arm_name': '${arm}',
    'outcome': 1
    }),
    headers={'Content-Type': 'application/json'}) 
`;
  if (language == "JS") {
    return jsSnippet;
  }
  return pySnippet;
};

export const convertExperiment = (exp) => {
  let res;
  if (exp.experiment_type === "beta_binomial") {
    res = betaBinomial();
    res.interventions = exp.interventions;
    res.name = exp.name;
    res.experiment_type = exp.experiment_type;
    res.id_consistency = exp.id_consistency;
  } else if (exp.experiment_type === "gaussian") {
    res = gaussian();
    res.interventions = [];
    for (const intervention of exp.interventions) {
      res.interventions.push({
        intervention_name: intervention.intervention_name,
        mean: 0,
        std: 1,
        trials: 0,
        sum_x: 0,
        sum_x_squared: 0,
      });
    }
    res.name = exp.name;
    res.experiment_type = exp.experiment_type;
    res.id_consistency = exp.id_consistency;
  }
  return res;
};

