from fastapi import FastAPI, Request, Body
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse, FileResponse
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import random


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


class GaussianExp(BaseModel):
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
            "name": "beta_binomial_inter_consistencydhdhd",
            "owner_name": "string",
            "type": "binary",
            "was_updated": False
        },
        {
        "experiment_type": "gaussian",
        "id_consistency": False,
        "interventions": [
            {
                "intervention_name": "a",
                "mean": 2.475,
                "std": 0.33447720400649056,
                "sum_x": 9.9,
                "sum_x_squared": 24.95,
                "trials": 6
            },
            {
                "intervention_name": "b",
                "mean": 1.58,
                "std": 0.36,
                "sum_x": 7.9,
                "sum_x_squared": 13.15,
                "trials": 5
            },
            {
                "intervention_name": "c",
                "mean": 0,
                "std": 1,
                "sum_x": 0,
                "sum_x_squared": 0,
                "trials": 0
            }
        ],
        "key": "5jr2zht5cght",
        "name": "gaussian_test",
        "owner_name": "string",
        "type": "gaussian",
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
    list = [{
        "experiment_type": "beta_binomial",
        "id_consistency": False,
        "interventions": [
            {
                "intervention_name": "a",
                "num_played": 22,
                "num_successes": 46
            },
            {
                "intervention_name": "b",
                "num_played": 4,
                "num_successes": 12
            },
            {
                "intervention_name": "c",
                "num_played": 5,
                "num_successes": 7
            }
        ],
        "key": "f88ydslgfxru",
        "name": "beta_binomial_inter_consistencydhdhd",
        "owner_name": "string",
        "type": "binary",
        "was_updated": False
    }, {
        "experiment_type": "gaussian",
        "id_consistency": True,
        "interventions": [
            {
                "intervention_name": "a",
                "mean": 2.475,
                "std": 0.33447720400649056,
                "sum_x": 9.9,
                "sum_x_squared": 24.95,
                "trials": 6
            },
            {
                "intervention_name": "b",
                "mean": 1.58,
                "std": 0.36,
                "sum_x": 7.9,
                "sum_x_squared": 13.15,
                "trials": 5
            },
            {
                "intervention_name": "c",
                "mean": 0,
                "std": 1,
                "sum_x": 0,
                "sum_x_squared": 0,
                "trials": 0
            }
        ],
        "key": "5jr2zht5cght",
        "name": "gaussian_test",
        "owner_name": "string",
        "type": "gaussian",
        "was_updated": False
    }]
    return random.choice(list)


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


@app.post("/private/experiment/gaussian")
def create_gaussian(request: Request, exp: GaussianExp):
    print(exp)
    return {
        "experiment_type": "gaussian",
        "id_consistency": False,
        "interventions": [
            {
                "intervention_name": "a",
                "mean": 2.475,
                "std": 0.33447720400649056,
                "sum_x": 9.9,
                "sum_x_squared": 24.95,
                "trials": 4
            },
            {
                "intervention_name": "b",
                "mean": 1.58,
                "std": 0.3655133376499406,
                "sum_x": 7.9,
                "sum_x_squared": 13.15,
                "trials": 5
            },
            {
                "intervention_name": "c",
                "mean": 0,
                "std": 1,
                "sum_x": 0,
                "sum_x_squared": 0,
                "trials": 0
            }
        ],
        "key": "5jr2zht5cght",
        "name": "gaussian_test",
        "owner_name": "string",
        "type": "gaussian",
        "was_updated": False
    }



@app.get("/public/experiments/{key}/get_intervention")
def get_intervention(key: str):
    return "blue"


@app.get("/{full_path:path}")
def render_svelte(request: Request, full_path: str):
    return FileResponse("svelte/public/index.html")


@app.delete("/private/experiment/delete")
def delete_exp(key: str):
    return key


@app.delete("/private/consistent_intervention/delete")
def delete_consistency(experiment_name: str, user_id: str):
    return experiment_name, user_id
