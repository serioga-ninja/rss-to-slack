import express = require('express');
import * as core from '../../core';
import requestLogger = require('../../libs/logger');
import router = require('./router');

export = class SlackController extends core.Controlles.MiddlewareController {
    path = '/slack';
    router = router;
}