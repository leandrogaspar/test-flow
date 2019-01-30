[![Build Status](https://travis-ci.org/leandrogaspar/test-flow.svg?branch=master)](https://travis-ci.org/leandrogaspar/test-flow)
[![dependencies Status](https://david-dm.org/leandrogaspar/test-flow/status.svg)](https://david-dm.org/leandrogaspar/test-flow)
[![devDependencies Status](https://david-dm.org/leandrogaspar/test-flow/dev-status.svg)](https://david-dm.org/leandrogaspar/test-flow?type=dev) [![Greenkeeper badge](https://badges.greenkeeper.io/leandrogaspar/test-flow.svg)](https://greenkeeper.io/)

# Test Flow
> Flow-based test framework

## Getting Started

### Installing
Download and install the latest LTS version of [node](https://nodejs.org/en/download/), open a shell and run: 

```shell
>npm install
>npm run build
```

### Running the examples

```shell
>npm run example

Ws server listening on port 3001!
Rest server listening on port 3000!
Main server listening on port 4000
Worker server listening on port 4001
```

After everything is up and running you can start the examples:

* [http://localhost:4000/selenium](http://localhost:4000/selenium) - Will run examples/flows/selenium-flow.json
* [http://localhost:4000/ws](http://localhost:4000/ws) - Will run examples/flows/ws-flow.json
* [http://localhost:4000/rest](http://localhost:4000/rest) - Will run examples/flows/rest-flow.json
