# @typescript-auth/server-adapter 🌉

[![npm version](https://badge.fury.io/js/@typescript-auth%2Fserver-adapter.svg)](https://badge.fury.io/js/@typescript-auth%2Fserver-adapter)
[![main](https://github.com/Tada5hi/typescript-auth/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/typescript-auth/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Tada5hi/typescript-auth/branch/master/graph/badge.svg?token=FHE347R1NW)](https://codecov.io/gh/Tada5hi/typescript-auth)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/typescript-auth/badge.svg)](https://snyk.io/test/github/Tada5hi/typescript-auth)

The main propose of this package, is to provide middlewares for microservices, which are based on a http (express) or (web-) socket (socket.io) server.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [HTTP](#http)
  - [Socket](#socket)
## Installation

```bash
npm install @typescript-auth/server-adapter --save
```

## Usage

### HTTP

```typescript
import express from 'express';
import { setupHTTPMiddleware } from "@typescript-auth/server-adapter";
import { setConfig, useClient } from "redis-extension";
import axios from 'axios';

// setup express server
const server = expres();

// setup redis connection
setConfig('default', {connectionString: 'redis://127.0.0.1'});

// retrieve redis instance
const redis = useClient('default');

// set bearer token or achieve it on another way e.g. response interceptor ;)
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

// setup socket middleware for socket server
server.use(setupHTTPMiddleware({
    redis,
    redisPrefix: 'token',
    axios
}));
```

### Socket

```typescript
import { Server } from 'socket.io';
import { setupSocketMiddleware } from "@typescript-auth/server-adapter";
import { setConfig, useClient } from "redis-extension";
import axios from 'axios';

// setup socket.io server
const server = new Server();

// setup redis connection
setConfig('default', {connectionString: 'redis://127.0.0.1'});

// retrieve redis instance
const redis = useClient('default');

// set bearer token or achieve it on another way e.g. response interceptor ;)
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

// setup socket middleware for socket server
server.use(setupSocketMiddleware({
    redis,
    redisPrefix: 'token',
    axios
}));
```