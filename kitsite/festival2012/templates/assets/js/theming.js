/*
Project Name: LOCOG Festival
Project URI: http://festival.london2012.com/
Description: London 2012 Festival.
Author: Mart Gordon
Version: 1.0
Tags: bespoke, microformats, 

theming.js

*/
$(document).ready(function(){
	if($('link[href$="main.css"]').length) {
		runEverything();
	}
});

//kicking off all our Javascript dependent on which CSS file is loaded
function runEverything() {
	setUpCounter();
	$('select#event-drop-down').yaselect();
	setDatePicker();
	recentEventsShowHide();
	showHideSearchLabels();
	contentShowHide();
	removeLastBorder();
	$('div.serps ul.events-list li').last().addClass('end-event-list');
	$('#search-events-form input').click(function(){
		$(this).val("");
	});
}

// Event counter to show number of events found with this search criteria
function setUpCounter(){
	$('div.search-events').append('<div class="events-counter"><div class="events-counter-content">10000</div><p class="events-counter-title">Events</p></div>');
	$("div.search-events div.events-counter div.events-counter-content").children().andSelf().contents().each(function(){
	    if (this.nodeType == 3) {
	        var $this = $(this);
	        $this.replaceWith($this.text().replace(/(\w)/g, "<span>$&</span>"));
	    }
	});
	$("div.search-events div.events-counter div.events-counter-content span:last").addClass('last-span');
}

// Date picker is really this easy, styling is via datePicker.css
function setDatePicker(){
	$('input.date-input').datepicker({ dateFormat: 'dd/mm/yy' });
}

// Recent Events show and hide
function recentEventsShowHide(){
	$('ul.recent-events-carousel li').addClass('hide-event');
	$('ul.recent-events-carousel li:nth-child(1)').removeClass('hide-event');
	$('ul.recent-events-carousel li:nth-child(2)').removeClass('hide-event');
	$('ul.recent-events-carousel li:nth-child(3)').removeClass('hide-event');
	$('ul.recent-events-carousel li.hide-event').hide();
	$('div.recent-events').append('<a href="#" id="show-recents">Show all</a>');
	$('div.recent-events a#show-recents').click(function(){
		$('ul.recent-events-carousel li.hide-event').show();
		$(this).css('display', 'none');
		return false;
	});
}

// Search input content show/hide events 
function showHideSearchLabels() {
	$("form.search-events-form input#keyword-artist-venue").focus(function(){
	     if ( $(this).val() == "Keyword, Artist, Venue")
	    $(this).val('');
	 });
	 $("form.search-events-form input#keyword-artist-venue").blur(function(){
	     if ( $(this).val() == "")
	     $(this).val('Keyword, Artist, Venue');
	 });
	$("form.search-events-form input#town-postcode").focus(function(){
	     if ( $(this).val() == "Town or Postcode")
	    $(this).val('');
	 });
	 $("form.search-events-form input#town-postcode").blur(function(){
	     if ( $(this).val() == "")
	     $(this).val('Town or Postcode');
	 });
	$("form.search-events-form input#from-date").focus(function(){
	     if ( $(this).val() == "dd/mm/yy")
	    $(this).val('');
	 });
	 $("form.search-events-form input#from-date").blur(function(){
	     if ( $(this).val() == "")
	     $(this).val('dd/mm/yy');
	 });
	$("form.search-events-form input#to-date").focus(function(){
	     if ( $(this).val() == "dd/mm/yy")
	    $(this).val('');
	 });
	 $("form.search-events-form input#to-date").blur(function(){
	     if ( $(this).val() == "")
	     $(this).val('dd/mm/yy');
	 });	
}

function create_name(text) {
    var name = text.toLowerCase();
    name = name.replace(/^\s+|\s+$|[^a-z0-9&\s-]/g, '');
    name = name.replace(/&/g, 'and');
    name = name.replace(/\s/g, '-');
    name = name.replace(/(-)+\1/g, "$1");
    return name;
};

function add_link() {
    var name = create_name($(this).text());
    $(this).next('div.toggle').attr('name', name);
    $(this).html(
        '<a href="#' + name + '" title="Reveal ' +
        $(this).text() + ' content">' +
        $(this).html() + '</a>');
};

function toggle(event) {
    event.preventDefault();
    $(this).
        toggleClass('expanded').
        next('div.toggle').slideToggle('fast');
    var path = window.location.pathname;
};

function remove_focus() {
    $(this).blur();
};

function contentShowHide(){
    $('._toggle').
        removeClass('_toggle').
        addClass('toggle');
    $('._expanded').
        removeClass('_expanded').
        addClass('expanded');
    $('h2.toggle:not(.expanded)').next('div.toggle').hide();
    $('h2.toggle').each(add_link);
    $('h2.toggle').click(toggle);
    $('h2.toggle a').mouseup(remove_focus);
	$('h4.toggle:not(.expanded)').next('div.toggle').hide();
    $('h4.toggle').each(add_link);
    $('h4.toggle').click(toggle);
    $('h4.toggle a').mouseup(remove_focus);
};

function removeLastBorder() {
	$('div.mobile-desktop ul li').last().addClass('last');
};