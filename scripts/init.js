require.config({

    baseUrl: "/scripts",

    /* starting point for application */
    deps: ['backbone.marionette','marionette.handlebars','main'],


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
        jqueryui: {
            deps: ['jquery']
        }
    },

    paths: {
        jquery: '../components/jquery/jquery',
        jqueryui: '../components/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min',
        backbone: '../components/backbone-amd/backbone',
        underscore: '../components/underscore-amd/underscore',
        pace: '../components/pace/pace.min',

        /* alias all marionette libs */
        'backbone.marionette': '../components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../components/backbone.babysitter/lib/amd/backbone.babysitter',

        infobox: '../components/infobox/infobox-min',

        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: '../components/requirejs-text/text',
        tmpl: "../templates",
        tweetparse: '../components/tweet-parse/tweet-parse',

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
