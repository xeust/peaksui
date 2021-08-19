from fastapi import FastAPI, Request, Body
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse, FileResponse
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List



app = FastAPI()

app.mount("/svelte", StaticFiles(directory="svelte/public", html=True), name="build")

class NewExp(BaseModel):
    name: str
    owner_name: str
    id_consistency: bool
    type: str
    was_updated: bool
    experiment_type: str
    interventions: List[dict]

exps = [
  [
    {
      "experiment_type": "beta_binomial",
      "id_consistency": False,
      "interventions": [
        {
          "intervention_name": "string",
          "num_played": 0,
          "num_successes": 0
        }
      ],
      "key": "2m85jguxj2qg",
      "name": "string",
      "owner_name": "string",
      "type": "binary",
      "was_updated": False
    },
    {
      "experiment_type": "beta_binomial",
      "id_consistency": False,
      "interventions": [
        {
          "intervention_name": "a",
          "num_played": 4,
          "num_successes": 3
        },
        {
          "intervention_name": "b",
          "num_played": 4,
          "num_successes": 1
        },
        {
          "intervention_name": "c",
          "num_played": 3,
          "num_successes": 3
        }
      ],
      "key": "9roqxa7ew51a",
      "name": "test experiment 1",
      "owner_name": "",
      "type": "BINARY",
      "was_updated": False
    },
    {
      "experiment_type": "beta_binomial",
      "id_consistency": True,
      "interventions": [
        {
          "intervention_name": "a",
          "num_played": 0,
          "num_successes": 0
        },
        {
          "intervention_name": "b",
          "num_played": 0,
          "num_successes": 0
        },
        {
          "intervention_name": "c",
          "num_played": 0,
          "num_successes": 0
        }
      ],
      "key": "bbgxzfxbjyk4",
      "name": "string",
      "owner_name": "string",
      "type": "binary",
      "was_updated": False
    },
    {
      "experiment_type": "beta_binomial",
      "id_consistency": False,
      "interventions": [
        {
          "intervention_name": "a",
          "num_played": 0,
          "num_successes": 0
        },
        {
          "intervention_name": "b",
          "num_played": 0,
          "num_successes": 0
        },
        {
          "intervention_name": "c",
          "num_played": 0,
          "num_successes": 0
        }
      ],
      "key": "f88ydslgfxru",
      "name": "string",
      "owner_name": "string",
      "type": "binary",
      "was_updated": False
    }
  ]
]

@app.get("/sponge")
def sponge():
    return "sponge"

@app.get("/private/experiment_list")
def get_experiments():
    return exps

@app.get("/private/experiments/{key}")
def get_exp(key: str):
    return {
      "experiment_type": "beta_binomial",
      "id_consistency": True,
      "interventions": [
        {
          "intervention_name": "string",
          "num_played":100,
          "num_successes": 20
        },
                {
          "intervention_name": "red",
          "num_played":100,
          "num_successes": 30
        }
      ],
      "key": "2m85jguxj2qg",
      "name": "string",
      "owner_name": "string",
      "type": "binary",
      "was_updated": False
    }

@app.get("/private/experiments/{name}/viz")
def get_viz(name: str):
    def iterfile():  
        with open("./fig.png", mode="rb") as file_like:  
            yield from file_like  
    return StreamingResponse(iterfile(), media_type="image/png")

@app.post("/private/experiment/beta_binomial")
def create_exp(request: Request, exp: NewExp):
    exps[0].append(exp.dict())
    return {
      "experiment_type": "beta_binomial",
      "id_consistency": True,
      "interventions": [
        {
          "intervention_name": "string",
          "num_played": 0,
          "num_successes": 0
        }
      ],
      "key": "2m85jguxj2qg",
      "name": "string",
      "owner_name": "string",
      "type": "binary",
      "was_updated": False
    }

@app.get("/public/experiments/{key}/get_intervention")
def get_intervention(key: str):
    return "blue"

@app.get("/{full_path:path}")
def render_svelte(request: Request, full_path: str):
    return FileResponse("svelte/public/index.html")

