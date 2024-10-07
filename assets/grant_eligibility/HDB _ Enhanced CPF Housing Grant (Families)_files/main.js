//http://www20.hdb.gov.sg/fi10/fi10297p.nsf/fi10/infoweb/common/js/main.js

$(function(){

	// Call Foundation 5 scripts
	$(document).foundation({
	    equalizer: {
	        equalize_on_stack: true
	    }
	});

	//IE9 placeholder polyfill
	if (!Modernizr.input.placeholder) {
		$('input[placeholder], textarea[placeholder]').placeholder();
	}


	$.fn.animateRotate = function(startangle, angle, duration, easing, complete) {
		return this.each(function() {
			var $elem = $(this);

			$({deg: startangle}).animate({deg: angle}, {
				duration: duration,
				easing: easing,
				step: function(now) {
					$elem.css({
						transform: 'rotate(' + now + 'deg)'
					});
				},
				complete: complete || $.noop
			});
		});
	};


	$('.dark-site-updates-content .js-show-updates').on('click',function(e){
		e.preventDefault();

		var $this = $(this),
			$list = $this.parent().find('.list'),
			$hidden_items = $list.find('.is-hidden'),
			$btn_text = $this.find('.btn-text');

		if($list.hasClass('is-expanded')){
			$hidden_items.fadeOut();
			$btn_text.html('View more');
			$list.removeClass('is-expanded');
		}else{

			$hidden_items.fadeIn();
			$btn_text.html('View less');
			$list.addClass('is-expanded');
		}

	});

	$('.myhdb-info .js-myhdb-info-expand').on('click',function(e){
		var $this = $(this),
			$myhdb_summary = $this.parent();

		if ($myhdb_summary.hasClass('is-expanded')){
			$myhdb_summary.removeClass('is-expanded');
			$myhdb_summary.find('.is-hidden').fadeOut();
			$this.find('.cta-text').text('View all');
		}else{
			$myhdb_summary.addClass('is-expanded');
			$myhdb_summary.find('.is-hidden').fadeIn();
			$this.find('.cta-text').text('Less');
		}
	});


	// Facebook, Twitter tab toggle
	$('.social-feeds .js-tab-toggle').on('click',function(e){
		var $this = $(this),
			$active_control_tab = $('.social-feed-control-tab.active'),
			$social_feeds_tab = $('.social-feeds-tab'),
			$active_feed_tab = $('.social-feeds-tab.active');

		if(!$this.hasClass('active')){
			$active_control_tab.removeClass('active');
			$this.addClass('active');

			$active_feed_tab.hide();
			$active_feed_tab.removeClass('active');

			$social_feeds_tab.eq($this.index()).stop().fadeIn(function(){
				$(this).addClass('active');
			});
		}
	});


	$('.listing-sort .js-sort-link').on('click',function(e){
		$this = $(this);

		if($this.hasClass('active')){
			$this.toggleClass('asc');
		}else{
			$('.listing-sort .js-sort-link.active').removeClass('active');
			$this.addClass('active');
		}
	});



	$('#main .accordion-navigation > a').on('click',function(e){
		var $this = $(this);

		// Set timeout so Foundation 5 event listener will be triggered first
		setTimeout(
			function(){
				$('html,body').animate({
		            scrollTop: $this.offset().top
		        });
			}
		,300);
	});


	// Event listener for Accordions
	$('.accordion').on('toggled', function (event, accordion) {
		var $accordionGallery = $('.accordion-navigation'),
			$accordion = $(accordion[0]),
			$recentAccordionArr = $('.accordion-navigation.active');

		//for multiple accordions
		if ($recentAccordionArr.length > 1) {

			//close recently opened accordions
			$recentAccordionArr.each(function (index) {
				var $currentAccordion = $(this);
				var $currentAccordionID = $currentAccordion.find('div.content.active').attr('id');

				if ($accordion.attr('id') !== $currentAccordionID) {
					$currentAccordion.find('div.content.active').removeClass('active');
					$currentAccordion.removeClass('active');
				}
			});
		}

		$accordionGallery.each(function (){
			// var _this = $( $(this).find('.content') );

			rr.articleCarousel.destroy( this );
		});

		if ( $accordion.parent().hasClass('active') ) {
			rr.articleCarousel.init( $accordion );
		}
	});


	// Event Listener for printing
	$('.page-tool.print').on('click', 'a.link', function (e){
		e.preventDefault();
		window.print();
	});

	// Date picker in listing pages
	var pickerFrom = new Pikaday({
		field: document.getElementById('fromDate'),
		onSelect: function(date) {
			pickerTo.setMinDate(date);
		}
	});


	var pickerTo = new Pikaday({
		field: document.getElementById('toDate'),
		onSelect: function(date){
			pickerFrom.setMaxDate(date);
		}
	});


	// Media queries specific JS
	var queries = [
	{
		context: ['mobile'],
		match: function() {
			rr.homepageFeaturesTab.mobile();
			rr.footerCarousel.mobile();
			rr.mobileMenu.mobile();
			rr.composer.mobile_composer();
			rr.tableScrollbar.wrap();

			if($('.alphabetical-listing-page').length>0){
				rr.alphabeticalPagination.mobile_scrolling();
			}
		}, unmatch:function(){
			rr.homepageFeaturesTab.feature_tab_unbind(true);
			rr.alphabeticalPagination.unbind_scrolling();
			rr.tableScrollbar.unwrap();
		}
	},
	{
		context: 'small',
		match: function() {
			rr.homepageFeaturesTab.small();
			rr.footerCarousel.small();
			rr.mobileMenu.mobile();
			rr.composer.mobile_composer();
			rr.tableScrollbar.wrap();

			if($('.alphabetical-listing-page').length>0){
				rr.alphabeticalPagination.mobile_scrolling();
			}


		}, unmatch:function(){
			rr.homepageFeaturesTab.feature_tab_unbind();
			rr.alphabeticalPagination.unbind_scrolling();
			rr.tableScrollbar.unwrap();
		}
	},
	{
		context: ['tablet'],
		match: function() {

			rr.homepageFeaturesTab.tablet();
			rr.footerCarousel.tablet();
			rr.mobileMenu.mobile();

			rr.composer.tablet_composer();
			rr.myhdb.initialLoad();
			rr.tableScrollbar.wrap();


			if($('.alphabetical-listing-page').length>0){
				rr.alphabeticalPagination.mobile_scrolling();
			}

		},
		unmatch: function(){
			rr.homepageFeaturesTab.feature_tab_unbind();
			rr.alphabeticalPagination.unbind_scrolling();
			rr.tableScrollbar.unwrap();
		}
	},
	{
		context: 'desktop',
		match: function() {
			rr.homepageFeaturesTab.desktop();
			rr.footerCarousel.desktop();
			rr.megaMenu.desktop();


			rr.composer.desktop_composer();
			rr.myhdb.initialLoad();
			rr.tableScrollbar.wrap();


			if($('.alphabetical-listing-page').length>0){
				rr.alphabeticalPagination.desktop_scrolling();
			}


			$('.video-banner .js-video-lightbox').fancybox({
				helpers : {
					media : {},
					overlay: {
				      locked: false
				    }
				},
				padding:0
			});


		},
		unmatch:function(){
			rr.homepageFeaturesTab.feature_tab_unbind();
			$('.video-banner').unbind('click.fb-start');
			rr.alphabeticalPagination.unbind_scrolling();
			rr.tableScrollbar.unwrap();
		}
	},
	{
		context: 'extralarge',
		match: function() {
			rr.homepageFeaturesTab.desktop();
			rr.footerCarousel.desktop();
			rr.megaMenu.desktop();

			rr.myhdb.initialLoad();
			rr.composer.desktop_composer();
			rr.tableScrollbar.wrap();


			if($('.alphabetical-listing-page').length>0){
				rr.alphabeticalPagination.desktop_scrolling();
			}

			$('.video-banner .js-video-lightbox').fancybox({
				helpers : {
					media : {},
					overlay: {
				      locked: false
				    }
				},
				padding:0
			});



		},unmatch: function(){
			rr.homepageFeaturesTab.feature_tab_unbind();
			$('.video-banner').unbind('click.fb-start');
			rr.alphabeticalPagination.unbind_scrolling();
			rr.tableScrollbar.unwrap();
		}
	}
	];

	MQ.init(queries);


});

/*
 * jQuery.appear
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*/
$(function(){
(function($){$.fn.appear=function(f,o){var s=$.extend({one:true},o);return this.each(function(){var t=$(this);t.appeared=false;if(!f){t.trigger('appear',s.data);return;}var w=$(window);var c=function(){if(!t.is(':visible')){t.appeared=false;return;}var a=w.scrollLeft();var b=w.scrollTop();var o=t.offset();var x=o.left;var y=o.top;if(y+t.height()>=b&&y<=b+w.height()&&x+t.width()>=a&&x<=a+w.width()){if(!t.appeared)t.trigger('appear',s.data);}else{t.appeared=false;}};var m=function(){t.appeared=true;if(s.one){w.unbind('scroll',c);var i=$.inArray(c,$.fn.appear.checks);if(i>=0)$.fn.appear.checks.splice(i,1);}f.apply(this,arguments);};if(s.one)t.one('appear',s.data,m);else t.bind('appear',s.data,m);w.scroll(c);$.fn.appear.checks.push(c);(c)();});};$.extend($.fn.appear,{checks:[],timeout:null,checkAll:function(){var l=$.fn.appear.checks.length;if(l>0)while(l--)($.fn.appear.checks[l])();},run:function(){if($.fn.appear.timeout)clearTimeout($.fn.appear.timeout);$.fn.appear.timeout=setTimeout($.fn.appear.checkAll,20);}});$.each(['append','prepend','after','before','attr','removeAttr','addClass','removeClass','toggleClass','remove','css','show','hide'],function(i,n){var u=$.fn[n];if(u){$.fn[n]=function(){var r=u.apply(this,arguments);$.fn.appear.run();return r;}}});})(jQuery);
});

$(document).ready(function(){
   $(".account-login").on("click touchend",function(e){
	window.location = $(this).attr("href");
   });
});

//init login button
$(function(){
	
	var show = function(){
	    var $this = $(this);
	    $this.addClass('account-link-tapped')
	    		 
	         .find('.account-login-box')
	         .stop().show().fadeIn(200);
	}
	
	var hide = function(){
		    var $this = $(this);
		    if ($this.hasClass('active')) return;
		    $this.removeClass('account-link-tapped')
		    		 
		         .find('.account-login-box')
		         .stop().hide().fadeOut(100);
		}
	
	
	$('.nav-bar .account')
	.on('click',function(e){	
		var $this = $(this);
		$this.toggleClass('account-link-tapped');
		if (!$this.hasClass('active')) {
			$this.addClass('active');
			show.call($this)
		} else {
			$this.removeClass('active');
			hide.call($this)
		}
		
	}).hoverIntent({
		    over: show,
		    out: hide,
		    timeout: 300 
		});
})

// Get all anchor links on the page
const anchorLinks = document.querySelectorAll('a');
// Loop through each anchor link
anchorLinks.forEach((link) => {
    // Check if the link has the target="_blank" attribute
    if (link.getAttribute('target') === '_blank') {
        // Add the rel="noopener" attribute to the link
        link.setAttribute('rel', 'noopener noreferrer');
    }
});