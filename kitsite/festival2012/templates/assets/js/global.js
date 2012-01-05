/*
Project Name: LOCOG Festival
Project URI: http://festival.london2012.com/
Description: London 2012 Festival.
Author: Mart Gordon
Version: 1.0
Tags: bespoke, microformats,

global.js

*/
$(document).ready(function(){
  if($('link[href$="style.css"]').length) {
  runEverything();
  }
  if($('link[href$="dyslexia.css"]').length) {
  runEverything();
  }
});

//kicking off all our Javascript dependent on which CSS file is loaded
function runEverything() {
  jQuery('select#drop-down').yaselect();
  jQuery('select#event-drop-down').yaselect();
  // setUpCounter(9999); KIERAN
  sponsorsCarousel();
  setHomeCarousel();
  setDatePicker();
  galleryChoice();
  prepareGallery();
  prepareRecentEventsCarousel();
  prepareGalleryCarousel();
  recentRollover();
  eventRollover();
  eventFocusRollover()
  newsArchive();
  showHideSearchLabels();
  gridListSwitch();
  contentShowHide();
  focusOutCount();
  $.ajaxSetup ({
      cache: false
  });
  var ajax_load = "<img class='loading' src='../images/bg/ajax-loader.gif' alt='loading...' />";

  $('div#gallery-target').ajaxComplete(function(e, xhr, settings) {
      // Differentiate between different ajax calls,
      // this was triggered whenever the search-form loaded
      // a numbers preview
      if(settings.url != "/events/search.php?ajax=1") {
          $('div.the-player').css('display', 'none');
          $('div.the-player').fadeIn('slow');
          prepareGalleryCarousel();
          prepareGallery();
      }
  });

}

// Rollover of the recent items images to show description of item/event
function recentRollover() {
  $("a.recent-events-item").hover(function(){
      $("span.event-details", this).stop().animate({top:"0px"},{queue:false,duration:200});
  }, function() {
      $("span.event-details", this).stop().animate({top:"110px"},{queue:false,duration:200});
  });
}

// Event rollover to show more details of an event [on the events template page]
function eventRollover() {
  $("ul.events-grid li").hover(function(){
  $("div.item-text", this).stop().animate({top:"50px"},{queue:false,duration:200});
  $("div.item-text", this).addClass('item-hover');
  }, function() {
  $("div.item-text", this).stop().animate({top:"178px"},{queue:false,duration:200});
  $("div.item-text", this).removeClass('item-hover');
  });
}

function eventFocusRollover() {
  $("ul.events-grid li h2 a").focus(function(){
  $(this).closest("div.item-text").css('top','50px');
  });
  $("ul.events-grid li h2 a").blur(function(){
  $(this).closest("div.item-text").css('top','178px');
  });
}



// UK Funders sponsor logos turned into a carousel that progresses automatically or on mouse click
function sponsorsCarousel() {
  $('div#uk-funders').prepend('<a href="#" id="uk-prev"></a>');
  $('div#uk-funders').append('<a href="#" id="uk-next"></a>');
  $('div#uk-funders ul')
  .cycle({
     fx:     'curtainX',
  prev:   '#uk-prev',
  next:   '#uk-next',
  timeout: 8000,
  pause: true,
     speed:  '500'
  });
}

// Home Carousel for hero images at the top of the homepage content
function setHomeCarousel() {
    $('div.home-carousel .carousel-wrapper').append('<div id="car-nav"><a href="#" id="prev"></a><ul></ul><a href="#" id="next"></a><a href="#" class="not-paused" id="pause-button"></a></div>');
    $('div.carousel')
    .cycle({ 
        fx:     'fade',
        prev:   '#prev', 
        next:   '#next',
        timeout: 5000,
        speed:  500,
           pager:   '#car-nav ul',
        pause: 1,
        pagerAnchorBuilder: pagerFactory
    });
    function pagerFactory(idx, slide) {
        var s = idx > 2 ? ' ' : '';
        return '<li'+s+'><a href="#">'+(idx+1)+'</a></li>';
    };
    $('div.carousel').css('height', '33.2em');
    $('#pause-button').click(function() {
        if ($('#pause-button').is('.not-paused')) {
            $('div.carousel').cycle('pause');
            $('#pause-button').addClass("paused");
            $('#pause-button').removeClass("not-paused");
            return false;
         } else {
            $('div.carousel').cycle('resume');
            $('#pause-button').addClass("not-paused");
            $('#pause-button').removeClass("paused");
            return false;
        }
    });
}

// Recent events carousel to scroll and show more recent events, will scroll 6 at a time as a maximum, will scroll less if there is only a remainder [e.g. 3 items] to not show empty spaces
function prepareRecentEventsCarousel() {
  $('div.recent-events ul.recent-events-carousel').jcarousel({
  scroll: 6
  });
  $('ul.recent-events-carousel li').last().css('width', '145px');
}

//Gallery carousel like the recent events carousel but for the artist gallery and event detail pages
function prepareGalleryCarousel() {
  $('div.gallery-carousel ul').jcarousel({
  scroll: 4
  });
  $('div.gallery-carousel ul li').last().css('margin-right', '0');
}

// Date picker is really this easy, styling is via datePicker.css
function setDatePicker(){
  $('input.date-input').datepicker({ dateFormat: 'dd mm yy' });
}

// Event counter to show number of events found with this search criteria
function setUpCounter(eventNum){
  jQuery('div.search-events').append('<div class="events-counter"><div class="events-counter-content">' + eventNum + '</div><p class="events-counter-title">Events</p></div>');
  styleCounter();
}

function updateCounter(eventNum){
  jQuery('div.events-counter-content').text(eventNum);
  styleCounter();
}

function styleCounter(){
  $("div.search-events div.events-counter div.events-counter-content").children().andSelf().contents().each(function(){
     if (this.nodeType == 3) {
         var $this = $(this);
         $this.replaceWith($this.text().replace(/(\w)/g, "<span>$&</span>"));
     }
  });
}

// Following set of functions provide the functionality for choosing the gallery and changing images etc.
function removeSel() {
  $("ul#swap-gallery li a").each(function() {
  $(this).removeClass('selected');
  });
}

function showPic(whichpic) {
  var source = whichpic.getAttribute("href");
  var alt = whichpic.getAttribute("title")
  var placeholder = document.getElementById("placeholder");
  placeholder.setAttribute("src",source);
  placeholder.setAttribute("alt",alt);
}

function prepareGallery() {
  if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById("swap-gallery")) return false;  
  var gallery = document.getElementById("swap-gallery");
  var links = gallery.getElementsByTagName("a");
  for (var i=0; i < links.length; i++) {
  links[i].onclick = function() {
   showPic(this);
   removeSel();
   $(this).addClass('selected');
   return false;
  }
  }
}

function galleryChoice() {
  $('ul.gallery-items li a').click(function() {
    $('ul.gallery-items li').removeClass('selected-gallery');
    $(this).closest('li').addClass('selected-gallery');
    var elementClicked = '#festival-top';
    var destination = $(elementClicked).offset().top;
    $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination-20}, 500 );
    ajaxGalleryLoad(this);
    return false;
  });
}

function ajaxGalleryLoad(myPick) {
  var loadUrl = myPick.getAttribute("href");
  var type = myPick.getAttribute("class");

  $("div#gallery-target").load(loadUrl + " div#festival-top",function() {
      if (type.indexOf('video') != -1) {  
        var twoFourId = myPick.getAttribute("id");
        embedPlayer(twoFourId);
      }  
  });
  
}

/* LA */

function embedPlayer(programmeId, playersize) {
    var url = 'http://players.mediafreedom.twofourdigital.net/locog/script/config.js?id=' + programmeId;

    var flashvars = {
        config: url,
        autostart: "true"
    };
    
    var params = {
        allowscriptaccess: "always",
        allowFullscreen: "true",
        opacity: "transparent",
        wmode: "opaque",
        quality: "high",
        align: "middle"
    };
    
    var attributes = {
        id: 'flashPlayer',
        name: 'flashPlayer'
    };
          
    swfobject.embedSWF("http://players.mediafreedom.twofourdigital.net/swf/player.swf", "video", 444, 332, "10.0.42.34", "/swf/expressinstall.swf", flashvars, params, attributes);
}

// news archive accordian code
function newsArchive() {
  var o = $("div.news-aside-lists").length;
  if ( o > 0 ) {
  $('div.news-aside-lists').addClass('news-accord');
  $('div.aside div.news-accord:eq(0)> ul.news-list').hide();
  $('div.news-aside-lists h3').each(add_link);
  $('div.aside div.news-accord:eq(0)> h3').click(function() {
      $(this).next().slideToggle('fast');
   if($(this).hasClass("opened")) {
    $(this).removeClass("opened");
   }
   else {
    $(this).addClass("opened");
   }
    });
  $('div.aside div.news-accord:eq(0)> h3').mouseover(function() {
   $(this).addClass("onHover");
  });
  $('div.aside div.news-accord:eq(0)> h3').mouseout(function() {
   $(this).removeClass("onHover");
  });
  $("div.news-aside-lists").find("ul.news-list").eq(0).show();
  $("div.news-aside-lists").find("h3").eq(0).addClass("opened");
  }
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
      if ( $(this).val() == "From Date")
     $(this).val('');
  });
  $("form.search-events-form input#from-date").blur(function(){
      if ( $(this).val() == "")
      $(this).val('From Date');
  });
  $("form.search-events-form input#to-date").focus(function(){
      if ( $(this).val() == "To Date")
     $(this).val('');
  });
  $("form.search-events-form input#to-date").blur(function(){
      if ( $(this).val() == "")
      $(this).val('To Date');
  });  
}

// Grid List switch for SERPS
function gridListSwitch() {
  $('div.view-switch a.view-tile').click(function(){
  $('div.serps').addClass('serps-grid');
  $('div.view-switch a.view-list').removeClass('selected');
  $(this).addClass('selected');
  return false;
  })
  $('div.view-switch a.view-list').click(function(){
  $('div.serps').removeClass('serps-grid');
  $('div.view-switch a.view-tile').removeClass('selected');
  $(this).addClass('selected');
  return false;
  })
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

// ticket widget accordian, does not close as in a traditional accordian as users may wish to compare ticket types etc.
function contentShowHide(){
  var n = $("div.ticket-option").length;
  if ( n > 1 ) {
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
  $('h3.toggle:not(.expanded)').next('div.toggle').hide();
     $('h3.toggle').each(add_link);
     $('h3.toggle').click(toggle);
     $('h3.toggle a').mouseup(remove_focus);
  $("div.ticket-options").find("div.ticket-option").eq(0).show();
  $("div.ticket-options").find("h3").eq(0).addClass("expanded");
  $('div.ticket-options div:eq(0)> div.ticket-option').hide();
  }
};

function focusOutCount(){
  $("form#search-events-form").focusout(function() {
      populateEventCounter(); // KIERAN updateCounter(500);
  });
  
};​