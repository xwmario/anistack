var React = require('react/addons');
window.React = React;

var ListApp = require('./components/list.jsx');
var Settings = require('./components/settings.jsx');
var ForgotForm = require('./components/forgot.jsx');
var LoginForm = require('./components/login.jsx');
var RegisterForm = require('./components/register.jsx');
var SearchApp = require('./components/search.jsx');
var PickerButton = require('./components/pickerbutton.jsx');
var SeriesRatingGraph = require('./components/series/rating-graph.jsx');
var SimilarSeries = require('./components/series/similar.jsx');
var RelatedSeries = require('./components/series/related.jsx');

// List page
var listNode = document.getElementById('list-left');
if (listNode) {
	React.renderComponent(<ListApp />, listNode);
}

// Settings page
var settingsNode = document.getElementById('settings');
if (settingsNode) {
	React.renderComponent(<Settings />, settingsNode);
}

// Regisger page
var registerNode = document.getElementById('register-form-wrap');
if (registerNode) {
	React.renderComponent(<RegisterForm />, registerNode);
}

// Login page
var loginNode = document.getElementById('login-form-wrap');
if (loginNode) {
	React.renderComponent(<LoginForm />, loginNode);
}

// Reset password page
var forgotNode = document.getElementById('forgot-form-wrap');
if (forgotNode) {
	React.renderComponent(<ForgotForm />, forgotNode);
}

// Search page
var searchNode = document.getElementById('search-page-wrap');
if (searchNode) {
	React.renderComponent(<SearchApp />, searchNode);
}

// Series page, with cover
var seriesActionsNode = document.getElementById('series-cover-actions');
if (seriesActionsNode) {
	var seriesData = $(seriesActionsNode);
	React.renderComponent(<PickerButton _id={seriesData.data('id')} collection={seriesData.data('collection')} classPrefix='series' />, seriesActionsNode);
}

// Series page, without cover
var infoActionsNode = document.getElementById('series-info-actions');
if (infoActionsNode) {
	var seriesData = $(infoActionsNode);
	React.renderComponent(<PickerButton _id={seriesData.data('id')} collection={seriesData.data('collection')} classPrefix='info' />, infoActionsNode);
}

// Series page
var seriesRatingGraphNode = document.getElementById('series-rating-graph-wrap');
if (seriesRatingGraphNode) {
	var seriesData = $(seriesRatingGraphNode);
	React.renderComponent(<SeriesRatingGraph _id={seriesData.data('id')} collection={seriesData.data('collection')} />, seriesRatingGraphNode);
}

// Series page, similar seriesRatingGraphNode
var similarSeriesNode = document.getElementById('series-info-similar-wrap');
if (similarSeriesNode) {
	var seriesData = $(similarSeriesNode);
	React.renderComponent(<SimilarSeries _id={seriesData.data('id')} collection={seriesData.data('collection')} similargenres={seriesData.data('similargenres')} />, similarSeriesNode);
}

// Series page, related
var relatedSeriesNode = document.getElementById('series-info-related-wrap');
if (relatedSeriesNode) {
	var seriesData = $(relatedSeriesNode);
	React.renderComponent(<RelatedSeries _id={seriesData.data('id')} collection={seriesData.data('collection')} />, relatedSeriesNode);
}