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
