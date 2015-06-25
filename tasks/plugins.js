#!/usr/bin/env node

//This script will add or remove all plugins listed in package.json

//usage: node plugins.js [ add | remove ]

var command = process.argv[2] || 'add';

var packageJson = require('../package.json');

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function createAddRemoveStatement(plugin) {
    var pluginCmd = 'cordova plugin ' + command + ' ';
    if(typeof plugin === 'string') {
        pluginCmd += plugin;
    } else {
        if(command === 'add') {
            pluginCmd += plugin.locator + ' ';
            if(plugin.variables) {
                Object.keys(plugin.variables).forEach(function(variable){
                    pluginCmd += '--variable ' + variable + '="' + plugin.variables[variable] + '" ';
                });
            }
        } else {
            pluginCmd += plugin.id;
        }
    }

    return pluginCmd;
}

function processPlugin(index, field) {
    if(index >= packageJson[field].length)
        return;

    var plugin = packageJson[field][index];
    var pluginCommand = createAddRemoveStatement(plugin);
    console.log(pluginCommand);
    exec(pluginCommand, function(){
        processPlugin(index + 1, field);
    });
}

processPlugin(0, 'plugins');
processPlugin(0, 'cordovaPlugins');
