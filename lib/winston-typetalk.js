const format = require('sf');
const request = require('request');
const Transport = require('winston-transport');

/**
 * @constructs
 * @param {object} options
 * @param {String} options.token Typetalk bot authentication token
 * @param {String} options.topicId Typetalk topic id
 */
module.exports = class Typetalk extends Transport {
    constructor(opts) {
        super(opts);

        opts = opts || {};
        if (!opts.token || !opts.topicId) {
            throw new Error("winston-typetalk requires 'token' and 'topicId'");
        }
        if (opts.formatMessage && typeof opts.formatMessage !== 'function') {
            throw new Error("winston-typetalk 'formatMessage' should be function");
        }

        this.token = opts.token;
        this.topicId = opts.topicId;
        this.level = opts.level || 'info';
        this.handleException = opts.handleException || false;
        this.unique = opts.unique || false;
        this.silent = opts.silent || false;
        this.disableNotification = opts.disableNotification || false;
        this.name = opts.name || 'typetalk';
        this.template = opts.template || '[{level}] {message}';
        this.formatMessage = opts.formatMessage;
        this.batchingDelay = opts.batchingDelay || 0;
        this.batchingSeparator = opts.batchingSeparator || "\n\n";

        this.batchedMessages = [];
        this.batchingTimeout = 0;
    }

    /**
     * Core logging method exposed to Winston.
     * @param {Object} info 
     * @param {function} callback 
     */
    log(info, callback) {

        let self = this;
        if (this.silent) return callback(null, true);
        if (this.unique && this.level != info.level) return callback(null, true);

        let messageText = null;
        let formatOptions = {level: info.level, message: info.message, metadata: info.metadata};

        if (this.formatMessage) {
            messageText = this.formatMessage(formatOptions);
        } else {
            messageText = format(this.template, formatOptions);
        }

        if (this.batchingDelay) {
            this.batchedMessages.push(messageText);

            if (!this.batchingTimeout) {
                this.batchingTimeout = setTimeout(function() {
                    var combinedMessages =self.batchedMessages.join(self.batchingSeparator);
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
     * @param {string} messageText Formatted text to log
     */
    send(messageText) {
        var self = this;

        // Typetalk API doc: https://developer.nulab-inc.com/docs/typetalk/api/1/post-message/
        request({
            url: 'https://typetalk.com/api/v1/topics/'+this.topicId,
            method: 'POST',
            headers: {
                'X-Typetalk-Token': this.token
            },
            json: {
                message: messageText
            }
        }, function(error, response) {
            if (error) {
                self.emit('error', error);
            }
            if (response && response.statusCode != 200) {
                self.emit('error', response.statusCode);
            }
            self.emit('logged');
        });
    }
}
