var format = require('sf');
var request = require('request');
var util = require('util');
var winston = require('winston');

/**
 * @constructs
 * @param {object} options
 * @param {String} options.token Typetalk bot authentication token
 * @param {String} options.topicId Typetalk topic id
 */
var Typetalk = exports.Typetalk = function (options) {
    options = options || {};
    if (!options.token || !options.topicId) {
        throw new Error("winston-typetalk requires 'token' and 'topicId'");
    }
    if (options.formatMessage && typeof options.formatMessage !== 'function') {
        throw new Error("winston-typetalk 'formatMessage' should be function");
    }

    this.token = options.token;
    this.topicId = options.topicId;
    this.level = options.level || 'info';
    this.handleException = options.handleException || false;
    this.unique = options.unique || false;
    this.silent = options.silent || false;
    this.disableNotification = options.disableNotification || false;
    this.name = options.name || this.name;
    this.template = options.template || '[{level}] {message}';
    this.formatMessage = options.formatMessage;
    this.batchingDelay = options.batchingDelay || 0;
    this.batchingSeparator = options.batchingSeparator || "\n\n";

    this.batchedMessages = [];
    this.batchingTimeout = 0;
};

/**
 * @extends winston.Transport
 */
util.inherits(Typetalk, winston.Transport);

/**
 * Define a getter so that `winston.transports.Typetalk`
 * is available and thus backwards compatible.
 */
winston.transports.Typetalk = Typetalk;

/**
 * Expose the name of this Transport on the prototype
 */
Typetalk.prototype.name = 'typetalk';

/**
 * Core logging method exposed to Winston.
 * @function log
 * @member Typetalk
 * @param {string} level Level at which to log the message
 * @param {string} msg Message to log
 * @param {Object} meta **Optional** Additional metadata to attach
 * @param {function} callback Continuation to respond to when complete
 */
Typetalk.prototype.log = function (level, msg, meta, callback) {
    var self = this;
    if (this.silent) return callback(null, true);
    if (this.unique && this.level != level) return callback(null, true);

    var messageText = null;
    var formatOptions = {level: level, message: msg, metadata: meta};

    if (this.formatMessage) {
        messageText = this.formatMessage(formatOptions);
    } else {
        messageText = format(this.template, formatOptions);
    }

    if (this.batchingDelay) {
        this.batchedMessages.push(messageText);

        if (!this.batchingTimeout) {
            this.batchingTimeout = setTimeout(function () {
                var combinedMessages = self.batchedMessages.join(self.batchingSeparator);
                self.send(combinedMessages);

                self.batchedMessages = [];
                self.batchingTimeout = 0;
            }, this.batchingDelay);
        }
    } else {
        self.send(messageText);
    }

    callback(null, true);
}

/**
 * Actual method that sends the given message to Typetalk
 * @function send
 * @member Typetalk
 * @param {string} messageText Formatted text to log
 */
Typetalk.prototype.send = function (messageText) {
    var self = this;

    // Typetalk API doc: https://developer.nulab-inc.com/docs/typetalk/api/1/post-message/
    request({
        url: 'aaa',
        method: 'POST',
        headers: {
          'X-Typetalk-Token': this.token  
        },
        json: {
            message: messageText
        }
    }, function (error, response) {
        if (error) {
            self.emit('error', error);
        }
        if (response && response.statusCode != 200) {
            self.emit('error', response.statusCode)
        }
        self.emit('logged');
    });
}