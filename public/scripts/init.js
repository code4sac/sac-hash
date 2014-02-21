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

    'jqueryui/autocomplete': {
      deps: ['jquery','jqueryui/core','jqueryui/widget','jqueryui/position','jqueryui/menu']
    },

    isotope: {
      deps: ['jquery']
    }
  },

  paths: {
    jquery: '../components/jquery/jquery',
    'jqueryui/core': '../components/jquery-ui/ui/minified/jquery.ui.core.min',
    'jqueryui/widget': '../components/jquery-ui/ui/minified/jquery.ui.widget.min',
    'jqueryui/position': '../components/jquery-ui/ui/minified/jquery.ui.position.min',
    'jqueryui/autocomplete': '../components/jquery-ui/ui/minified/jquery.ui.autocomplete.min',
    'jqueryui/menu': '../components/jquery-ui/ui/minified/jquery.ui.menu.min',
    backbone: '../components/backbone-amd/backbone',
    underscore: '../components/underscore-amd/underscore',

    /* alias all marionette libs */
    'backbone.marionette': '../components/backbone.marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr': '../components/backbone.wreqr/lib/amd/backbone.wreqr',
    'backbone.babysitter': '../components/backbone.babysitter/lib/amd/backbone.babysitter',

    infobox: '../vendor/infobox/infobox-min',
    polygonContains: '../vendor/polygon-contains/polygon-contains',
    geolocation: '../components/geolocation/geo',
    isotope: '../components/isotope/jquery.isotope',
    geostats: '../components/geostats/lib/geostats.min',

    /* Alias text.js for template loading and shortcut the templates dir to tmpl */
    text: '../components/requirejs-text/text',
    tmpl: "../templates",
    'twitter-entities' : '../components/twitter-entities/twitter-entities',

    /* handlebars from the require handlerbars plugin below */
    handlebars: '../components/require-handlebars-plugin/Handlebars',
    store: '../components/store.js/store.min',

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