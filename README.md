# Peaks UI Handoff Guide

To run the project locally, run the following command from `svelte` directory.
```shell
npm i
npm run build
```
And run the following command from the root directory.
```shell
uvicorn main:app
```

To deploy app to deta, run the following command from `svelte` directory.
```shell
npm run build
```
And run the following command from the root directory
```shell
deta new --python
```

## API Guide
Request URL -
`/private/experiment_list`
Response - 
```
[
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
    ...
  ]
]
```

Request URL - `/private/experiment/test` 
Response - 
```
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
  "suggested_arm": "blue",
  "type": "binary",
  "key": "test",
  "owner_name": "thomas"
}
```

Request URL - `public/experiments/sponge/viz`

Response - Image

Request URL - `/private/experiment/beta_binomial` `POST` (Create New Experiment)
Request Modal -
```
{
  "key": "string",
  "owner_name": "string",
  "type": "string",
  "interventions": [
    {}
  ]
}
```
