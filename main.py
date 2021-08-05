from fastapi import FastAPI, Request, Body
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse, FileResponse
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List



app = FastAPI()

app.mount("/svelte", StaticFiles(directory="svelte/public", html=True), name="build")

class NewExp(BaseModel):
    key: str
    owner_name: str
    type: str
    interventions: List[dict]

exps = [
    [
        {
            "interventions": [
                {
                    "intervention_name": "1234",
                    "num_played": 1,
                    "num_successes": 0
                },
                {
                    "intervention_name": "1234",
                    "num_played": 1,
                    "num_successes": 0
                }
            ],
            "key": "1234",
            "owner_name": "thomas"
        },
        {
            "interventions": [
                {
                    "intervention_name": "1234",
                    "num_played": 1,
                    "num_successes": 0
                },
                {
                    "intervention_name": "1234",
                    "num_played": 1,
                    "num_successes": 0
                }
            ],
            "key": "12365",
            "owner_name": "thomas"
        },
        {
            "interventions": [
                {
                    "intervention_name": "string",
                    "num_played": 0,
                    "num_successes": 0
                }
            ],
            "key": "sponge",
            "owner_name": "string"
        },
        {
            "interventions": [
                {
                    "intervention_name": "sponge",
                    "num_played": 0,
                    "num_successes": 0
                }
            ],
            "key": "string",
            "owner_name": "d"
        },
        {
            "interventions": [
                {
                    "intervention_name": "blue",
                    "num_played": 1,
                    "num_successes": 0
                },
                {
                    "intervention_name": "red",
                    "num_played": 1,
                    "num_successes": 0
                }
            ],
            "key": "test",
            "owner_name": "thomas"
        }
    ]
]

@app.get("/sponge")
def sponge():
    return "sponge"

@app.get("/private/experiment_list")
def get_experiments():
    return exps

@app.get("/private/experiment/{key}")
def get_exp(key: str):
    return {
            "interventions": [
                {
                    "intervention_name": "blue",
                    "num_played": 1,
                    "num_successes": 0
                },
                {
                    "intervention_name": "red",
                    "num_played": 1,
                    "num_successes": 0
                }
            ],
            "suggested_arm": "blue",
            "type": "binary",
            "key": "test",
            "owner_name": "thomas"
        }

@app.get("/public/experiments/{name}/viz")
def get_viz(name: str):
    def iterfile():  
        with open("./fig.png", mode="rb") as file_like:  
            yield from file_like  
    return StreamingResponse(iterfile(), media_type="image/png")

@app.post("/private/experiment/beta_binomial")
def create_exp(request: Request, exp: NewExp):
    exps[0].append(exp.dict())
    print(exp)

@app.get("/{full_path:path}")
def render_svelte(request: Request, full_path: str):
    return FileResponse("svelte/public/index.html")

