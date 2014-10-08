var metalsmith = require('metalsmith');
var markdown  = require('metalsmith-markdown');
var highlight = require('highlight.js');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var define = require('metalsmith-define');
var handlebars = require('handlebars');
var moment = require('moment');

handlebars.registerHelper('eq', function () {
  var opts = arguments[arguments.length - 1];
  var args = Array.prototype.slice.call(arguments, 0, -1);

  for (var i = 1; i < args.length; i++) {
    if (args[i - 1] !== args[i]) {
      return false;
    }
  }

  return true;
});

handlebars.registerHelper('dateFormat', function (date, format) {
  return moment(date).format(format);
});
    
metalsmith(__dirname)
  .source('src')

  .use(define({
    blog: {
      url: 'http://roxanneravago.com',
      title: 'Connect the Dots',
      description: ''
    },
    owner: {
      url: 'http://roxanneravago.com',
      name: 'Roxanne Ravago'
    }
  }))

  .use(collections({
    posts: {
      pattern: 'posts/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))

  .use(markdown({
    gfm: true,
    tables: true,
    highlight: function (code, lang) {
      if (lang) {
        return highlight.highlight(lang, code).value;
      }

      return code;
    }
  }))

  .use(permalinks())

  .use(function (files, metalsmith) {
    files['index.html'] = metalsmith.metadata().collections.posts[0];
  })

  .use(function (file, metalsmith) {
    var metadata = metalsmith.metadata();

    metadata.latest = metadata.collections.posts.slice(0, 5);
  })

  .use(function (files, metalsmith) {
    var metadata = metalsmith.metadata();
    var archive  = metadata.archive = {};

    metadata.collections.posts.forEach(function (post) {
      var date  = moment(post.date);
      var year  = date.format('YYYY');
      var month = date.format('MMMM');

      archive[year] = archive[year] || {};
      archive[year][month] = archive[year][month] || [];

      archive[year][month].push(post);
    });    
  })
  
  .use(templates({
    engine: 'handlebars',
    directory: 'templates'
  }))

  .destination('build')
  .build(function (err) {
    if (err) throw err; 
  });
