# winston-typetalk
Typetalk integration for Winston inspired by [meerkats/winston-slacker](https://github.com/meerkats/winston-slacker)

## Install

```
$ npm install winston-typetalk
```

## Usage

```javascript
var winston = require('windton');

var winstonTypetalk = require('winston-typetalk');
var options = {
    topic: 12345,
    token: "XXXXXX"
};
winston.add(winstonTypetalk, options);
```