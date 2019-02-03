winston-typetalk
===

[![Build Status](https://travis-ci.org/is2ei/winston-typetalk.svg?branch=master)][travis]
[![Coverage Status](https://coveralls.io/repos/github/is2ei/winston-typetalk/badge.svg?branch=master)][coveralls]
[![npm version](https://badge.fury.io/js/winston-typetalk.svg)][npm]
[![Join the chat at https://gitter.im/is2ei/winston-typetalk](https://badges.gitter.im/is2ei/winston-typetalk.svg)][gitter]

[travis]: https://travis-ci.org/is2ei/winston-typetalk
[coveralls]: https://coveralls.io/github/is2ei/winston-typetalk?branch=master
[npm]: https://badge.fury.io/js/winston-typetalk
[gitter]: https://gitter.im/is2ei/winston-typetalk

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
