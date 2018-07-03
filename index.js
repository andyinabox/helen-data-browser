// fetch polyfill
require('whatwg-fetch');

var qs = require('querystring');
// var throttle = require('lodash.throttle');
var throttle = require('throttle-debounce/throttle');


var entryTpl = require('./entry.hbs');

// var COUCHDB = 'http://localhost:5984/'
// var COUCHDB = 'https://amdayton.cloudant.com/'
var COUCHDB = '//206.81.12.50:5984/';

var opts = {
	limit: 20,
	skip: 0
}


// create container
var container = document.createElement('div');
container.id = 'entry-container';
document.body.appendChild(container);

// initial load

function load(initial) {
	var url = COUCHDB + 'helendb/_design/main/_view/has_description?' + qs.stringify(opts);
	fetch(url)
		.then(function(response) { return response.json(); })
		.then((initial ? render : update));	
}

function render(json) {
	console.log('render');

	update(json);

	document.body.onscroll = throttle(300, onScroll);
}

function update(json) {
	console.log('update');
	var rows = json.rows;
	var html = rows.map(function(r) { return entryTpl(r.value); });
	container.innerHTML = container.innerHTML+html.join('');
}

function onScroll(e) {
	var wheight = getWindowHeight();
	var scrollPosition = document.body.scrollTop
	var offsetBodyHeight = (document.body.offsetHeight - (wheight*1.5));

	// console.log('onScroll', scrollPosition, offsetBodyHeight);

	if(document.body.scrollTop >= offsetBodyHeight) {
		opts.skip = opts.skip + opts.limit;
		load();
	}	
}

function getWindowHeight() {
	return "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight; 
}

load(true);