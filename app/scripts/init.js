require.config({

    baseUrl: "/scripts",

    /* starting point for application */
    deps: ['backbone.marionette', 'bootstrap', 'marionette.handlebars', 'main'],


    shim: {
        handlebars: {
            exports: 'Handlebars'
        },

        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        mapael: ['raphael']
    },

    paths: {
        jquery: '../components/jquery/jquery',
        backbone: '../components/backbone-amd/backbone',
        underscore: '../components/underscore-amd/underscore',

        /* alias all marionette libs */
        'backbone.marionette': '../components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../components/backbone.babysitter/lib/amd/backbone.babysitter',

        raphael: 'vendor/jquery-mapael/js/raphael/raphael-min',
        mapael: 'vendor/jquery-mapael/js/jquery.mapael',
        mapdata: 'vendor/jquery-mapael/js/maps/usa_states',

        /* alias the bootstrap js lib */
        bootstrap: 'vendor/bootstrap',

        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: '../components/requirejs-text/text',
        tmpl: "../templates",
        tweetparse: 'vendor/tweet-parse/tweet-parse',

        /* handlebars from the require handlerbars plugin below */
        handlebars: '../components/require-handlebars-plugin/Handlebars',

        /* require handlebars plugin - Alex Sexton */
        i18nprecompile: '../components/require-handlebars-plugin/hbs/i18nprecompile',
        json2: '../components/require-handlebars-plugin/hbs/json2',
        hbs: '../components/require-handlebars-plugin/hbs',

        /* marionette and handlebars plugin */
        'marionette.handlebars': '../components/backbone.marionette.handlebars/backbone.marionette.handlebars'
    },

    hbs: {
        disableI18n: true
    }
});
