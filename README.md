winston-typetalk
===

[![npm version](https://badge.fury.io/js/winston-typetalk.svg)][npm]

[npm]: https://badge.fury.io/js/winston-typetalk

A Typetalk transport for winston inspired by [ivanmarban/winston-telegram](https://github.com/ivanmarban/winston-telegram).

## Install

```
$ npm install winston-typetalk
```

## Usage

```javascript
const logger = require('winston');
const typetalkLogger = require('winston-typetalk');

logger.add(new typetalkLogger({token: YOUR_TYPETALK_ACCESS_TOKEN, topicId: TOPID_ID}));

logger.info('Hello, world!');
```
