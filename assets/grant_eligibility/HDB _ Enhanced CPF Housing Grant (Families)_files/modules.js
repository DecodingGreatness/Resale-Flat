/**
 *  RR UTILS - Accordion Carousel
 */
var rr = (function (parent, $) {
    var $accordionCarousel,
        $accordionCarousel_prev,
        $accordionCarousel_next,
        $js_accordion_carousel_nav,
        $internal_carousel,
        $clonedList;

    var add_carousel_index = function (idx, length) {
        if (idx == length - 1) {
            $js_accordion_carousel_nav.eq(0).addClass('active');
        } else {
            $js_accordion_carousel_nav.eq(idx + 1).addClass('active');
        }
    };

    var reduce_carousel_index = function (idx, length) {
        if (idx < 1) {
            $js_accordion_carousel_nav.eq(length - 1).addClass('active');
        } else {
            $js_accordion_carousel_nav.eq(idx - 1).addClass('active');
        }
    };

    var setup = function (el) {
        $accordionCarousel = el.find('.carousel-accordion'),
            $accordionCarousel_prev = $('.js-carousel-prev', $accordionCarousel),
            $accordionCarousel_next = $('.js-carousel-next', $accordionCarousel),
            $js_accordion_carousel_nav = $(el.find('.js-carousel-nav'), $accordionCarousel),
            $clonedList = el.find('.list').clone();

        $internal_carousel = $('.wrapper', $accordionCarousel).swiper({
            mode: 'horizontal',
            wrapperClass: 'list',
            slideClass: 'carousel-item',
            slidesPerView: 1,
            loop: true,
            calculateHeight: true,
            onSlideNext: function () {
                var idx = $(el.find('.js-carousel-nav.active')).index(),
                    length = $js_accordion_carousel_nav.length;
                $js_accordion_carousel_nav.removeClass('active');
                add_carousel_index(idx, length);
            },
            onSlidePrev: function () {
                var idx = $(el.find('.js-carousel-nav.active')).index(),
                    length = $js_accordion_carousel_nav.length;
                $js_accordion_carousel_nav.removeClass('active');
                reduce_carousel_index(idx, length);
            }
        });

        $accordionCarousel_prev.on('click', function (e) {
            e.preventDefault();
            $internal_carousel.swipePrev();
        });

        $accordionCarousel_next.on('click', function (e) {
            e.preventDefault();
            $internal_carousel.swipeNext();
        });

        $js_accordion_carousel_nav.on('click', function (e) {
            var $this = $(this),
                idx = $this.index();

            $('.js-carousel-nav.active').removeClass('active');
            e.preventDefault();
            $internal_carousel.swipeTo(idx);
            $this.addClass('active');
        });
    };

    var destroy = function (el) {
        if (el.find('.swiper-slide-active').length) {
            $accordionCarousel_prev.off();
            $accordionCarousel_next.off();
            $js_accordion_carousel_nav.off();

            $internal_carousel.destroy();
            $(el).find('.list').remove().end().find('.wrapper').append($clonedList);
            $(el).find('.js-carousel-nav.active').removeClass('active');
            $(el).find('.js-carousel-nav').eq(0).addClass('active');
        }
    };


    /**
     * Export module method
     */
    parent.accordionCarousel = {
        setup: setup,
        destroy: destroy
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    // rr.accordionCarousel.setup();
});/**
 *  RR UTILS - Set cookie for alert bar
 */
var rr = (function (parent, $) {
    var $header = $('.header'),
        $alert_bar = $('.alert-bar', $header),
        $alert_toggle = $('.js-toggle-alert-bar', $header),
        $mobile_search = $('.mobile-site-search-form');

    var get_cookie = function (sKey) {
        if (!sKey) { return null; }
        //return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        return $.cookie(sKey);
    }

    var set_cookie = function (cname, cvalue, exdays) {
        //var d = new Date();
        //d.setTime(d.getTime() + (exdays*24*60*60*1000));
        //var expires = "expires="+d.toUTCString();        
        var d = made_write_conn = 1295214458;
        $.cookie(cname, cvalue, { expires: d, path: "/", domain: location.host.slice(location.host.indexOf(".")) });
    }

    parent.fill_alerts = function (data) {
        var newflag = false;

        if (!data || !data.length) {
            return;
        } else {
            $alert_toggle.parent().animate({ width: "toggle" }, 350);
        }

        for (i in data) {
            //loop for all msgs ignoring type for now
            var info = data[i];
            if (get_cookie("info-msg-" + info.id) != "true") {
                newflag = true;
                console.log("getcookie");
                add_alert(info, i, data.length);
                set_cookie("info-msg-" + info.id, "true", "");
            }

        }

        if (newflag) {
            $alert_toggle.parent().addClass("active");
            $alert_bar.slideDown();
        }

        $(".header .js-toggle-alert-bar").on("click", function (e) {
            e.preventDefault();
            $(".alert-bar").toggle();
            for (i in data) {
                //loop for all msgs ignoring type for now
                var info = data[i];
                add_alert(info, i, data.length);
            }
        });

    }; // end fill_alerts



    var add_alert = function (info, index, datalength) {
        var tpl = [
            '                       <div class="wrapperr">',
            '                       <div class="myslide">',
            '                       <h2 class="alert-bar-title"><span class="icon icon-warning"></span>{TYPE}</h2>',
            '                       <p class="alert-bar-text">{MESSAGE}</p>',
            '                       <p class="pagenumber">{NUMBER} of {PAGENUMBER}</p>',
            '                       <a href="#" class="icon-bar-left">',
            '                       <span class="icon icon-chevron-left"></span>',
            '                                <span class="visuallyhidden">Left Move</span>',
            '                       </a>',
            '                       <a href="#" class="icon-bar-right">',
            '                       <span class="icon icon-chevron-right"></span>',
            '                                <span class="visuallyhidden">Right Move</span>',
            '                       </a>',
            "{CLOSE}",
            '                       </div>',
            "                        </div>",
        ];

        var tpl_close = [
            '                            <a href="#" class="alert-bar-close js-alert-bar-close">',
            '                                <span class="icon icon-cross"></span>',
            '                                <span class="visuallyhidden">Close alert bar</span>',
            "                            </a>",
        ];
        var pagenumber = 1;
        var html = tpl.join("");
        html = html.replace("{MESSAGE}", info.msg);
        html = html.replace("{TYPE}", info.type);
        html = html.replace("{PAGENUMBER}", datalength);
        html = html.replace("{NUMBER}", parseInt(index) + parseInt(pagenumber));
        html = html.replace("{CLOSE}", index > datalength ? "" : tpl_close.join(""));

        $alert_bar.append(html);

        var slideindex = 1;
        showslides(slideindex);

        $(".alert-bar").on("click", ".icon-bar-left", function (e) {
            e.preventDefault();
            showslides(slideindex += -1);
        });

        $(".alert-bar").on("click", ".icon-bar-right", function (e) {
            e.preventDefault();
            showslides(slideindex += 1);
        });

        // slide jQuery function

        function showslides(n) {
            var i;
            var slides = $(".myslide");

            if (n > slides.length) { slideindex = 1 }
            if (n < 1) { slideindex = slides.length }
            for (i = 0; i < slides.length; i++) {
                $(slides[i]).hide();
            }
            $(slides[slideindex - 1]).show();
        }

    };


    var setup = function () {
        $(".header .js-toggle-alert-bar").on("click", function (e) {
            e.preventDefault();
            $mobile_search.hide();
            //$(".site-search, .search_content .sgds-icon-cross").hide();
            $(".search_content .sgds-icon-search").show();
            $(".mobile-nav").removeClass("show-menu");
            $(".navbar-toggle").removeClass("open").addClass("menu");
            console.log("click");
            $parent = $(this).parent();
            if ($alert_bar.is(":visible")) {
                $alert_bar.slideDown(function () {
                    $parent.removeClass("active");
                });
            } else {
                $alert_bar.slideUp();
                $parent.addClass("active");
                $alert_bar.empty();
            }
        });

        $(".alert-bar").on("click", ".js-alert-bar-close", function (e) {
            e.preventDefault();
            if ($alert_bar.is(":visible")) {
                $alert_bar.slideUp(function () {
                    $(".alert.active").removeClass("active");
                });
            }
        });

        var u = "//www20.hdb.gov.sg";

        $.ajax({
            url:"https://assets.hdb.gov.sg/maintenance/MaintenanceMsgOnServer.json",
            type: "GET",
            data: {},
            dataType: "json",
            cache: false,
            success: function(data){
                rr.fill_alerts(data);
            }
        });

    };

    var px = $(window).width();
    if (px <= 1440 && px > 1024) {
        var less = (1440 - px) / 2;
        $(".alert-bar").css({
            marginRight: 240 - less,
        })
    }

    if (px <= 3560 && px > 1440) {
        var less = (3560 - px) / 2;
        $(".alert-bar").css({
            marginRight: 1159 - less,
        })
    }

    const identify = document.getElementById("sgds-masthead-identify");
    const identifyIcon = document.getElementById("sgds-masthead-identify-icon");
    const mastheadContent = document.getElementById("sgds-masthead-content");
    const mastheadDivider = document.getElementById("sgds-masthead-divider");

    identify.setAttribute("aria-expanded", false);
    identify.addEventListener("click", () => {
        const ariaExpanded = identify.getAttribute("aria-expanded");
        if (ariaExpanded === "true") {

            identify.setAttribute("aria-expanded", false);
        }
        else {
            identify.setAttribute("aria-expanded", true);
        }
        identifyIcon.classList.toggle("sgds-icon-chevron-up");
        mastheadContent.classList.toggle("is-hidden");
        mastheadDivider.classList.toggle("is-hidden");

    });



    /**
     * Export module method
     */
    parent.alertBar = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.alertBar.setup();
});

$(window).resize(function () {
    var px = $(window).width();
    if (px <= 1440 && px > 1024) {
        var less = (1440 - px) / 2;
        $(".alert-bar").css({
            marginRight: 240 - less,
        })
    }

    if (px <= 3560 && px > 1440) {
        var less = (3560 - px) / 2;
        $(".alert-bar").css({
            marginRight: 1159 - less,
        })
    }

});

/**
 *  RR UTILS - Alphabetical Pagination Scrolling
 */
var rr = (function (parent, $) {
    var $alphabetical_listing = $('.alphabetical-listing '),
        $result_list = $('.result-list', $alphabetical_listing),
        $pagination = $('.alphabetical-pagination', $alphabetical_listing);

    var set_absolute = function ($result_list, $scroll_top, $pagination, window_height) {
        if ($result_list.offset().top > $scroll_top && $pagination.hasClass('is-fixed')) {
            // Pagination scrolled to the top
            // Use absolute positioning

            $pagination.removeClass('is-fixed');
            $pagination.css('top', 10);
        }

        if ($scroll_top < ($result_list.offset().top + $result_list.outerHeight() - window_height)) {

            // If windows is not scrolled at the bottom of the page
            $pagination.removeClass('is-absolute-bottom');
        }
    }

    var set_fixed = function ($result_list, $scroll_top, $pagination, window_height) {

        if ($result_list.offset().top < $scroll_top && !$pagination.hasClass('is-fixed')) {

            // If the page is scrolled after the top position of the result list
            $pagination.addClass('is-fixed');

        }

        if ($scroll_top > ($result_list.offset().top + $result_list.outerHeight() - window_height)) {

            // If the page is scrolled at the bottom of the page
            $pagination.addClass('is-absolute-bottom');
        }
    }

    var mobile_scrolling = function () {

        // Handles the positioning update of the alphabets while the page is being scrolled.
        var temp = $(window).scrollTop();

        if ($(window).height() > 800) {

            $('.alphabetical-pagination-item-link', $pagination).css('padding', '6px 4px');

        } else if ($(window).height() > 625) {

            $('.alphabetical-pagination-item-link', $pagination).css('padding', '4px');

        } else if ($(window).height() >= 460) {

            $('.alphabetical-pagination-item-link', $pagination).css('padding', '1px 4px');

        }

        $(window).on('scroll', function () {

            var $window = $(window),
                window_height = $window.height(),
                $scroll_top = $window.scrollTop(),
                height_offset = $pagination.outerHeight() - window_height;



            if (temp > $scroll_top) {

                set_absolute($result_list, $scroll_top, $pagination, window_height);

            } else {

                set_fixed($result_list, $scroll_top, $pagination, window_height);

            }

            temp = $scroll_top;

        });

    };

    var desktop_scrolling = function () {

        // Handles the positioning update of the alphabets while the page is being scrolled.
        var temp = temp = $(window).scrollTop();

        $(window).on('scroll', function () {

            var $window = $(window),
                window_height = $window.height(),
                $scroll_top = $window.scrollTop(),
                height_offset = $pagination.outerHeight() - window_height;

            if (temp > $scroll_top) {

                if ($pagination.hasClass('is-fixed') && ($pagination.outerHeight() > window_height)) {
                    // Scroll up the alphabets, while the page is scrolled up                    

                    if ($pagination.position().top < 0 && ($pagination.position().top + 150) < 0) {

                        // If the top of the alphabets not visible, add the top position
                        $pagination.css('top', $pagination.position().top + 150);

                    } else {

                        // Else set the top position to 0
                        if (!$pagination.hasClass('is-absolute-bottom')) {
                            $pagination.css('top', 0);
                        }
                    }
                }

                set_absolute($result_list, $scroll_top, $pagination, window_height);

            } else if (temp < $scroll_top) {

                if ($pagination.hasClass('is-fixed') && ($pagination.outerHeight() > window_height)) {
                    // Scroll down the alphabets, while the page is scrolled down

                    if (Math.abs($pagination.position().top) < height_offset && Math.abs($pagination.position().top) + 150 < height_offset) {

                        // If the bottom of the alphabets not visible, substract the top position
                        $pagination.css('top', $pagination.position().top - 150);

                    } else {

                        // Else set the top position to the bottom of the alphabet
                        $pagination.css('top', -height_offset - 20);
                    }
                }

                set_fixed($result_list, $scroll_top, $pagination, window_height);

            }

            temp = $scroll_top;

        });

    };

    var unbind_scrolling = function () {
        $(window).off('scroll');
    };

    var setup = function () {

        $('.js-alphabetical-scroll', $pagination).on('click', function (e) {
            e.preventDefault();

            if ($($(this).attr('href')).length > 0) {
                $('html, body').stop().animate({
                    'scrollTop': $($(this).attr('href')).offset().top
                }, 700);
            }
        });
    };


    /**
     * Export module method
     */
    parent.alphabeticalPagination = {
        setup: setup,
        mobile_scrolling: mobile_scrolling,
        desktop_scrolling: desktop_scrolling,
        unbind_scrolling: unbind_scrolling
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.alphabeticalPagination.setup();
});/**
 *  RR UTILS - Article Carousel
 */
var rr = (function (parent, $) {
    var $carousel = $('.carousel'),
        $carousel_prev,
        $carousel_next,
        $js_carousel_nav,
        $accordion_carousel,
        $arrayCarousel,
        $arrayAccordianCarousel;

    var add_carousel_index = function (idx, length, el) {
        if (el === undefined) {
            if (idx > length) {
                $js_carousel_nav.eq(0).addClass('active');
            } else {
                $js_carousel_nav.eq(idx - 1).addClass('active');
            }
        } else {
            if (idx > length) {
                el.eq(0).addClass('active');
            } else {
                el.eq(idx - 1).addClass('active');
            }
        }
    };

    var reduce_carousel_index = function (idx, length, el) {
        if (el === undefined) {
            if (idx < 1) {
                $js_carousel_nav.eq(length - 1).addClass('active');
            } else {
                $js_carousel_nav.eq(idx - 1).addClass('active');
            }
        } else {
            if (idx < 1) {
                el.eq(length - 1).addClass('active');
            } else {
                el.eq(idx - 1).addClass('active');
            }
        }
    };

    var setup = function () {
        //var $internal_carousel = $('.wrapper', $carousel).swiper({
        $arrayCarousel = [];
        $('.wrapper', $carousel).each(function (idx) {
            var _this = $(this),
                $carousel_prev = _this.next().find('.js-carousel-prev'),
                $carousel_next = _this.next().find('.js-carousel-next '),
                $js_carousel_nav = _this.next().next().find('.js-carousel-nav');
            if (!_this.parent().parent().parent().hasClass('accordion-navigation')) {

                $arrayCarousel[idx] = _this.swiper({
                    mode: 'horizontal',
                    wrapperClass: 'list',
                    slideClass: 'carousel-item',
                    slidesPerView: 1,
                    loop: true,
                    calculateHeight: true,
                    onSlideNext: function () {
                        /*var slide_idx = _this.next().next().find('.js-carousel-nav.active').index(),
                        length = $js_carousel_nav.length;
                        $js_carousel_nav.removeClass('active');
                        add_carousel_index(slide_idx, length, $js_carousel_nav);*/
                    },
                    onSlidePrev: function () {
                        /*var slide_idx = _this.next().next().find('.js-carousel-nav.active').index(),
                        length = $js_carousel_nav.length;
                        $js_carousel_nav.removeClass('active');
                        reduce_carousel_index(slide_idx, length, $js_carousel_nav);*/
                    }
                });



                /*$carousel_prev = $('.js-carousel-prev', _this),
                $carousel_next = $('.js-carousel-next', _this),
                $js_carousel_nav = $('.js-carousel-nav', _this);*/
                $carousel_prev.on('click', function (e) {
                    e.preventDefault();
                    $arrayCarousel[idx].swipePrev();
                    var slide_idx = $arrayCarousel[idx].activeIndex, length = $js_carousel_nav.length;
                    $js_carousel_nav.removeClass('active');
                    reduce_carousel_index(slide_idx, length, $js_carousel_nav);

                });

                $carousel_next.on('click', function (e) {
                    e.preventDefault();
                    $arrayCarousel[idx].swipeNext();
                    var slide_idx = $arrayCarousel[idx].activeIndex, length = $js_carousel_nav.length;
                    $js_carousel_nav.removeClass('active');
                    add_carousel_index(slide_idx, length, $js_carousel_nav);
                });

                $js_carousel_nav.on('click', function (e) {
                    var $this = $(this),
                        slide_idx = $this.index();

                    $this.parent().find('.js-carousel-nav.active').removeClass('active');
                    e.preventDefault();
                    $arrayCarousel[idx].swipeTo(slide_idx);
                    $this.addClass('active');
                });
            }
        });
    };

    var init = function (el) {
        console.log("init")
        $accordionCarousel = el.find('.carousel');
        // $accordionCarousel_prev = el.find('.js-carousel-prev'),
        // $accordionCarousel_next = el.find('.js-carousel-next'),
        // $js_accordion_carousel_nav = el.find('.js-carousel-nav'),
        // $clonedList = el.find('.list').clone();

        $arrayAccordianCarousel = [],
            $arrayClonedList = [];
        $('.wrapper', $accordionCarousel).each(function (idx) {
            var $this = $(this),
                $accordionCarousel_prev = $this.next().find('.js-carousel-prev'),
                $accordionCarousel_next = $this.next().find('.js-carousel-next'),
                $js_accordion_carousel_nav = $this.next().next().find('.js-carousel-nav');

            $arrayClonedList[idx] = el.find('.list').clone();

            $arrayAccordianCarousel[idx] = $this.swiper({
                mode: 'horizontal',
                wrapperClass: 'list',
                slideClass: 'carousel-item',
                slidesPerView: 1,
                loop: true,
                calculateHeight: true,
                onSlideNext: function () {
                    /*var slide_idx = $this.next().next().find('.js-carousel-nav.active').index(),
                    length = $js_accordion_carousel_nav.length;
                    $js_accordion_carousel_nav.removeClass('active');
                    add_carousel_index(slide_idx, length, $js_accordion_carousel_nav);*/
                },
                onSlidePrev: function () {
                    /*var slide_idx = $this.next().next().find('.js-carousel-nav.active').index(),
                    length = $js_accordion_carousel_nav.length;
                    $js_accordion_carousel_nav.removeClass('active');
                    reduce_carousel_index(slide_idx, length, $js_accordion_carousel_nav);*/
                }
            });

            $accordionCarousel_prev.on('click', function (e) {
                e.preventDefault();
                $arrayAccordianCarousel[idx].swipePrev();
                var slide_idx = $arrayAccordianCarousel[idx].activeIndex,
                    length = $js_accordion_carousel_nav.length;
                $js_accordion_carousel_nav.removeClass('active');
                reduce_carousel_index(slide_idx, length, $js_accordion_carousel_nav);
            });

            $accordionCarousel_next.on('click', function (e) {
                e.preventDefault();
                $arrayAccordianCarousel[idx].swipeNext();
                var slide_idx = $arrayAccordianCarousel[idx].activeIndex,
                    length = $js_accordion_carousel_nav.length;
                $js_accordion_carousel_nav.removeClass('active');
                add_carousel_index(slide_idx, length, $js_accordion_carousel_nav);
            });

            $js_accordion_carousel_nav.on('click', function (e) {
                e.preventDefault();
                var $this = $(this),
                    slide_idx = $this.index();

                $this.parent().find('.js-carousel-nav.active').removeClass('active');
                $arrayAccordianCarousel[idx].swipeTo(slide_idx);
                $this.addClass('active');
            });
        });
    };

    var destroy = function (el) {
        console.log('destroy')

        var $el = $(el),
            $carousel = $el.find('.carousel');

        if ($el.find('.swiper-slide-active').length) {

            $carousel.each(function (i) {
                var $this = $(this);
                $arrayAccordianCarousel[i].destroy();

                $this.find('.js-carousel-prev').off();
                $this.find('.js-carousel-next').off();
                $this.find('.js-carousel-nav').off();

                $this.find('.js-carousel-nav.active').removeClass('active');
                $this.find('.js-carousel-nav').eq(0).addClass('active');
                $this.find('.wrapper').empty().append($arrayClonedList[0][i]);

            });
        }
    };


    /**
     * Export module method
     */
    parent.articleCarousel = {
        setup: setup,
        init: init,
        destroy: destroy,
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.articleCarousel.setup();
});/**
 *  RR Back to top 
 */

var rr = (function (parent, $) {

    var setup = function () {

        var $window = $(window),
            $back_to_top = $('.back-to-top'),
            $back_to_top_btn = $('.js-back-to-top', $back_to_top);

        $back_to_top_btn.on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            });
        });

        $window.on('scroll', function () {
            if ($window.scrollTop() > 0 && !$back_to_top.hasClass('is-visible')) {
                $back_to_top.addClass('is-visible');
            } else if ($window.scrollTop() === 0 && $back_to_top.hasClass('is-visible')) {
                $back_to_top.removeClass('is-visible');
            }

        });
    };


    /**
     * Export module method
     */
    parent.backToTop = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.backToTop.setup();
});/**
 *  RR UTILS - Banner Image Positioning
 *  Used to centre banner images horizontally.
 *
 *  Create a new Image() to get the actual width of the banner, the apply margin according to the width
 *
 */
var rr = (function (parent, $) {

    var align_images = function (image, $obj, window_width) {
        if ($obj.length > 0) {
            image.src = $obj.attr('src');

            image.onload = function () {

                // Only apply margin if the image is smaller than the viewport
                if (image.naturalWidth > window_width) {
                    $obj.css('margin-left', image.naturalWidth * -0.5);
                    $obj.css('left', '50%');
                } else {

                    // Reset
                    $obj.css('margin-left', 0);
                    $obj.css('left', 0);
                }
            }
        }
    }


    var setup = function () {
        var $featured_article = $('.featured-article'),
            $featured_images = $('.img', $featured_article),
            $header_banner = $('.header-banner > .img'),
            $window = $(window),
            image = null;

        // Initial process on load
        $featured_images.each(function (idx) {
            var $this = $(this),
                image = new Image();

            align_images(image, $this, $window.width());
        });

        // Initial process on load
        var image_banner = new Image();
        align_images(image_banner, $header_banner, $window.width());

        //On resize adjust image alignment
        $window.on('resize', Foundation.utils.throttle(function (e) {
            var window_width = $(this).width();

            $featured_images.each(function (idx) {
                var $this = $(this),
                    image = new Image();

                align_images(image, $this, window_width);
            });

            var image_banner = new Image();
            align_images(image_banner, $header_banner, window_width);

        }, 500));
    };


    /**
     * Export module method
     */
    parent.bannerImagePositioning = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.bannerImagePositioning.setup();
});/**
 *  RR UTILS - JS workaround for IE9 bg transition
 */
var rr = (function (parent, $) {
    var $main = $('#main'),
        hdb_red = '#cc0001',
        hdb_teal = '#0c8188',
        dark_red = '#a00a19',
        white = '#ffffff',
        bg_pos_y;

    var setup = function () {

        if ($('.lt-ie10').length > 0) {
            $('.btn').not('.faq-btn, .subscribe-btn')
                .on('mouseenter', function () {

                    $(this).animate(
                        { backgroundColor: dark_red }, 100
                    );
                })
                .on('mouseleave', function () {

                    $(this).animate(
                        { backgroundColor: hdb_red }, 100
                    );
                });

            $('.btn-white').on('mouseenter', function () {

                $(this).animate(
                    { backgroundColor: hdb_red }, 200
                );
            }).on('mouseleave', function () {

                $(this).animate(
                    { backgroundColor: white }, 200
                );
            });

            $('.video-banner-link').on('mouseenter', function () {

                $('.btn-white', this).animate(
                    { backgroundColor: hdb_red }, 200
                );
            }).on('mouseleave', function () {

                $('.btn-white', this).animate(
                    { backgroundColor: white }, 200
                );
            });

            $('.faq-btn').on('mouseenter', function () {

                $(this).animate(
                    { backgroundColor: white }, 300
                );
            }).on('mouseleave', function () {

                $(this).animate(
                    { backgroundColor: hdb_teal }, 200
                );
            });

            $('.subscribe-btn').on('mouseenter', function () {

                $(this).animate(
                    { backgroundColor: dark_red }, 300
                );
            }).on('mouseleave', function () {

                $(this).animate(
                    { backgroundColor: white }, 150
                );
            });

            $('.feature-tab-control-link').on('mouseenter', function () {


                $this = $(this);
                $icon = $(this).find('.feature-tab-control-icon');

                $icon.stop().animate(
                    {
                        backgroundColor: hdb_teal
                    }, 300
                );
            }).on('mouseleave', function () {


                $this = $(this);
                $icon = $(this).find('.feature-tab-control-icon');

                $icon.stop().animate(
                    {
                        backgroundColor: '#ffffff'
                    }, 300
                );
            });
        }


    };


    /**
     * Export module method
     */
    parent.bgTransitionIE = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.bgTransitionIE.setup();
});/**
 *  RR UTILS - Composer
 *  Used to update components layout based on media queries
 */
var rr = (function (parent, $) {


    var mobile_composer = function () {
        var $side_listing = $('.side-listing'),
            $services_search = $('.full-screen-search'),
            $services_listing = $('.services-listing'),
            $interest_links = $('.interest-links'),
            $content_section = $('.content-section');


        $side_listing.detach();
        $content_section.append($side_listing);

        $services_search.detach();
        $('.page-header').append($services_search);

        $interest_links.detach();
        $content_section.append($interest_links);

        $('.service-desc', $services_listing).addClass('is-stacked');
        $('.service-col', $services_listing).addClass('is-stacked');

    };

    var tablet_composer = function () {


        var $secondary_nav = $('.secondary-nav'),
            $side_listing = $('.side-listing'),
            $services_search = $('.full-screen-search'),
            $services_listing = $('.services-listing'),
            $interest_links = $('.interest-links'),
            $content_section = $('.content-section');

        $secondary_nav.detach();
        $('.page-header').prepend($secondary_nav);

        $side_listing.detach();
        $content_section.append($side_listing);

        $services_search.detach();
        $('.page-header').append($services_search);

        $interest_links.detach();
        $content_section.append($interest_links);

        $('.service-desc', $services_listing).addClass('is-stacked');
        $('.service-col', $services_listing).addClass('is-stacked');
    };

    var desktop_composer = function () {
        var $secondary_nav = $('.secondary-nav'),
            $side_listing = $('.side-listing'),
            $services_search = $('.full-screen-search'),
            $services_listing = $('.services-listing'),
            $interest_links = $('.interest-links');

        $secondary_nav.detach();
        $('.aside ').prepend($secondary_nav);

        $side_listing.detach();
        $('.aside').append($side_listing);

        $services_search.detach();
        $('.header-banner .wrapper').append($services_search);

        $interest_links.detach();
        $('.main-content').append($interest_links);

        $('.service-desc', $services_listing).removeClass('is-stacked');
        $('.service-col', $services_listing).removeClass('is-stacked');
    };

    var setup = function () {

    };


    /**
     * Export module method
     */
    parent.composer = {
        setup: setup,
        mobile_composer: mobile_composer,
        tablet_composer: tablet_composer,
        desktop_composer: desktop_composer
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.composer.setup();
});/**
 *  RR UTILS - eServices scripts
 */
var rr = (function (parent, $) {
    var $services_listing = $('.services-listing');


    var setup = function () {
        $('.js-bookmark').on('click', function (e) {
            e.preventDefault();
            var $list_item = $(this).closest('.list-item'),
                $bookmark_icons = $list_item.find('.icon-bookmark');

            $bookmark_icons.toggleClass('is-bookmarked');
        });

        $('.js-service-expand', $services_listing).on('click', function (e) {
            e.preventDefault();

            var $this = $(this),
                $list_item = $this.parent().parent();

            if ($list_item.hasClass('is-expanded')) {
                $list_item.removeClass('is-expanded');
            } else {
                $('.list-item.is-expanded', $services_listing).removeClass('is-expanded');
                $list_item.addClass('is-expanded');
                $('html,body').animate({
                    scrollTop: $list_item.offset().top
                });
            }
        });
    };


    /**
     * Export module method
     */
    parent.eservices = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.eservices.setup();
});/**
 *  RR UTILS - Footer Carousel
 */
var rr = (function (parent, $) {
    var footer_carousel_instance,
        $footer_carousel = $('#main .multi-item-carousel');

    var setup = function () {
        $('.js-carousel-prev', $footer_carousel).on('click', function (e) {
            e.preventDefault();
            footer_carousel_instance.swipePrev();
        });

        $('.js-carousel-next', $footer_carousel).on('click', function (e) {
            e.preventDefault();
            footer_carousel_instance.swipeNext();
        });
    };

    var mobile = function () {
        footer_carousel_instance = null;

        if ($footer_carousel.length > 0) {
            footer_carousel_instance = $('.wrapper', $footer_carousel).swiper({
                mode: 'horizontal',
                wrapperClass: 'list',
                slideClass: 'multi-item-carousel-item',
                loop: true,
                calculateHeight: true
            });
        }
    };

    var small = function () {
        footer_carousel_instance = null;

        if ($footer_carousel.length > 0) {
            footer_carousel_instance = $('.wrapper', $footer_carousel).swiper({
                mode: 'horizontal',
                wrapperClass: 'list',
                slideClass: 'multi-item-carousel-item',
                slidesPerView: 2,
                slidesPerGroup: 1,
                loop: true,
                calculateHeight: true
            });
        }
    };

    var tablet = function () {
        footer_carousel_instance = null;

        if ($footer_carousel.length > 0) {
            footer_carousel_instance = $('.wrapper', $footer_carousel).swiper({
                mode: 'horizontal',
                wrapperClass: 'list',
                slideClass: 'multi-item-carousel-item',
                slidesPerView: 4,
                slidesPerGroup: 1,
                loop: true,
                calculateHeight: true
            });
        }

    };

    var desktop = function () {
        footer_carousel_instance = null;

        if ($footer_carousel.length > 0) {
            footer_carousel_instance = $('.wrapper', $footer_carousel).swiper({
                mode: 'horizontal',
                wrapperClass: 'list',
                slideClass: 'multi-item-carousel-item',
                slidesPerView: 6,
                loop: true,
                slidesPerGroup: 1,
                calculateHeight: true
            });
        }
    };


    /**
     * Export module method
     */
    parent.footerCarousel = {
        setup: setup,
        mobile: mobile,
        small: small,
        tablet: tablet,
        desktop: desktop
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.footerCarousel.setup();
});/**
 *  RR UTILS - Fullscreen Search module
 *  Used in eServices Listing page
 */
var rr = (function (parent, $) {

    var $search_overlay = $('#main .search-overlay'),
        $search_listing = $('.search-overlay-listing', $search_overlay),
        $full_screen_search = $('#main .full-screen-search'),
        $inner_wrap = $('.inner-wrap'),
        $input_search = $('.js-input-search', $full_screen_search),
        $overlay_input_search = $('.js-input-search', $search_overlay);

    // Get search result json file, and parse it into handlebars template
    var getSearchResult = function (json_input) {
        var source = null,
            template = null,
            html = null;

        if ($search_overlay.length > 0) {

            source = $('#handlebar-search-overlay-template').html();

            //Compile the actual Template file
            template = Handlebars.compile(source);

            $.getJSON(json_input, function (data) {

                html = template({
                    searchResult: data.data,
                    resultPerPage: data.resultPerPage,
                    resultsCount: data.resultsCount
                });

                $('.search-overlay-content', $search_overlay)
                    .html(html)
                    .highlight($overlay_input_search.val());

            });
        }
    };

    var setup = function () {

        $('.js-search-overlay-close', $search_overlay).on('click', function (e) {
            $search_overlay.stop().fadeOut();
            $input_search.val('');
            $overlay_input_search.val('');
            $inner_wrap.removeClass('is-overflown');
            $search_listing.removeHighlight();

            $('html,body').animate({
                scrollTop: 0
            });
        });

        $input_search.on('keyup', Foundation.utils.debounce(function (e) {
            $overlay_input_search.val($input_search.val());
            getSearchResult('/search-overlay-data.json');

            $('html,body').animate({
                scrollTop: 0
            });

            $inner_wrap.addClass('is-overflown');
            $search_overlay.stop().fadeIn();


            if ($overlay_input_search.val()) {
                $overlay_input_search.next('.full-screen-search-clear-btn').show();
            }
        }, 300, false));

        $overlay_input_search.on('keyup', Foundation.utils.debounce(function (e) {

            $('.search-overlay-content', $search_overlay)
                .removeHighlight()
                .highlight($(this).val());

        }, 300, false));


    };


    /**
     * Export module method
     */
    parent.fullScreenSearch = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.fullScreenSearch.setup();
});/**
 * Heartland Neighbourhood Landing Page
 */

var rr = (function (parent, $) {

    parent.heartland = parent.heartland || {};

    var $pins = $('.pins a', '.neighbourhood-map');

    /**
     * Bind Tap event to Pins
     */
    var bindMouseTapToPins = function () {
        if (!$pins.length) return;

        $pins.each(function () {
            var $this = $(this);

            $this.on('touchend, click', function (e) {
                if ($('.pin-label', $this).css('display') === 'none') {
                    $pins.find('.pin-label').hide();
                    $('.pin-label', $this).show();
                    e.preventDefault();
                } else {
                    window.location.href = $this.attr('href');
                }
            });

            $this.on('mouseover', function () {
                $('.pin-label', $this).show();
            });

            $this.on('mouseout', function () {
                $('.pin-label', $this).hide();
            });
        });
    };


    /**
     * Unbind Tap event to Pins
     */
    var unbindMouseTapToPins = function () {
        if (!$pins.length) return;

        $pins.off();

        $('.pin-label', $pins).attr('style', '');
    };


    /**
     * Export module method
     */
    parent.heartland.neighbourhoodMap = {
        bindMouseTapToPins: bindMouseTapToPins,
        unbindMouseTapToPins: unbindMouseTapToPins
    };

    return parent;

}(rr || {}, jQuery));
/**
 *  RR UTILS - Homepage Features Tab
 *
 *  Plugin used for carousel: http://www.idangero.us/sliders/swiper/
 *
 *  Carousel only initialized in mobile viewport. Tablet and desktop do not initialize carousel.
 *
 */

var rr = (function (parent, $) {
    var feature_tab_carousel_option,
        $feature_tab_carousel,
        $feature_tab_toggle = $('.feature-tab .js-toggle-tab'),
        hdb_red = '#cc0001',
        hasLoaded = 0;

    var setup = function () {
        feature_tab_carousel_option = {
            mode: 'horizontal',
            wrapperClass: 'list',
            slideClass: 'feature-box'
        };
    };


    var feature_tabs_event_mobile = function ($this, $feature_tab_carousel, init, feature_reset) {

        // Events codes include tablet view as well
        // In tablet view, carousel is not initialized

        var $parent = $this.parent().parent(),
            $arrow_icon = $('.icon-chevron-down', $this),
            $feature_tab_active = $('.feature-tab.active'),
            $anchor_offset;

        $('.feature-tab-content', $feature_tab_active).stop().slideUp(function () {
            $feature_tab_active.removeClass('active');
        });


        if ($parent.hasClass('active')) {

            $('.feature-tab-content', $parent).stop().slideUp(function (e) {
                $parent.removeClass('active');
            });

            $arrow_icon.animateRotate(180, 0);

        } else {

            // Initialize carousel only in mobile
            if (init) {
                $feature_tab_carousel = $('.feature-box-list', $parent).swiper(feature_tab_carousel_option);
            }
            $arrow_icon.animateRotate(0, 180);

            $('.feature-tab-content', $parent).stop().slideDown(function (e) {
                $parent.addClass('active');

                // Anchor newly opened tab to the top of the page
                if (!feature_reset) {

                    $anchor_offset = $this.offset().top;
                    $(document).scrollTop($anchor_offset);
                }
                $(document).foundation('equalizer', 'reflow');
            });
        }

    }

    var move_chevron = function ($active_tab) {
        // animate chevron movement on tab clicking
        var left_offset = $active_tab.offset().left,
            tab_width = $active_tab.outerWidth(),
            $chevron = $('#main .chevron-wrapper');

        $chevron.stop().animate({
            left: left_offset + (tab_width / 2) - ($chevron.outerWidth() / 2)
        }, 500, function () {

        });
    }

    var feature_tabs_event = function ($this, $feature_tab_carousel) {
        // Events triggered in desktop view

        var $parent = $this.parent().parent(),
            $feature_tab_content_desktop = $('.feature-tabs .feature-tab-content-desktop'),
            $feature_tab_active = $('.feature-tab.active'),
            wrapper_content_clone;

        // Clone existing wrapper content
        // Remove existing content from DOM
        // Fadein cloned content
        wrapper_content_clone = $('.wrapper', $feature_tab_content_desktop).clone().html($('.feature-tab-content', $parent).html());
        $('.wrapper', $feature_tab_content_desktop).remove();
        wrapper_content_clone.hide();
        wrapper_content_clone.appendTo($feature_tab_content_desktop);
        wrapper_content_clone.fadeIn(700);

        // Initial load
        if (!$feature_tab_content_desktop.hasClass('active')) {
            $feature_tab_content_desktop.addClass('active');
        }


        if ($('.lt-ie10').length > 0) {

            $('.feature-tab-content-desktop .btn-white').on('mouseenter', function () {

                $(this).animate(
                    { backgroundColor: hdb_red }, 200
                );
            }).on('mouseleave', function () {

                $(this).animate(
                    { backgroundColor: '#ffffff' }, 200
                );
            });
        }

        // Reinitialize Foundation 5 equalizer script when tab content updated
        $(document).foundation('equalizer', 'reflow');

        $feature_tab_active.removeClass('active');
        $parent.addClass('active');

        move_chevron($parent);
    }

    var feature_tabs_reset = function (mobile) {
        // Composer/Relayout
        // Called in the event of browser resizing, and the layout of Feature tabs changed.

        var $feature_tabs = $('#main .feature-tabs'),
            $feature_tab_content = $('.feature-tab-content', $feature_tabs),
            $feature_tab_content_desktop = $('.feature-tab-content-desktop', $feature_tabs),
            $active_feature_tab = $('.feature-tab.active');

        if (mobile) {
            if ($feature_tab_content_desktop.is(':visible')) {
                $('.icon-chevron-down', $feature_tabs).animateRotate(180, 0);
                $feature_tab_content_desktop.hide();
                $active_feature_tab.removeClass('active');
            }

        } else {

            if ($feature_tab_content.is(':visible')) {
                $feature_tab_content.hide();
                $active_feature_tab.removeClass('active');
            }

            if (!$feature_tab_content_desktop.is(':visible')) {
                $feature_tab_toggle.eq(0).trigger('click');
            }

        }
    }

    var feature_tab_unbind = function (destroy) {
        //Unbind and destroy carousel instances

        $feature_tab_toggle.off();

        if (destroy) {
            if ($feature_tab_carousel != undefined && $feature_tab_carousel.destroy != undefined) {
                $feature_tab_carousel.destroy();
            }
        }
    };

    var mobile = function () {
        feature_tab_carousel_option = {
            mode: 'horizontal',
            wrapperClass: 'list',
            slideClass: 'feature-box',
            calculateHeight: true
        };
        $feature_tab_carousel = $('.feature-tab.active .feature-box-list').swiper(feature_tab_carousel_option);

        $feature_tab_toggle.on('click', function (e) {
            e.preventDefault();
            $this = $(this);

            feature_tabs_event_mobile($this, $feature_tab_carousel, true, false);
        });

        feature_tabs_reset(true);

    };

    var small = function () {
        feature_tab_carousel_option = {
            mode: 'horizontal',
            wrapperClass: 'list',
            slideClass: 'feature-box',
            slidesPerView: 2,
            calculateHeight: true
        };

        $feature_tab_carousel = $('.feature-tab.active .feature-box-list').swiper(feature_tab_carousel_option);

        $feature_tab_toggle.on('click', function (e) {
            e.preventDefault();
            $this = $(this);
            feature_tabs_event_mobile($this, $feature_tab_carousel, true, false);
        });

        feature_tabs_reset(true);
    };

    var tablet = function () {

        $feature_tab_toggle.on('click', function (e) {
            e.preventDefault();
            $this = $(this);
            feature_tabs_event_mobile($this, $feature_tab_carousel, false, false);
        });

        feature_tabs_reset(true);

    };

    var desktop = function () {

        $feature_tab_toggle.on('click', Foundation.utils.debounce(function (e) {
            $this = $(this);

            if (!$this.parent().parent().hasClass('active')) {
                feature_tabs_event($this, $feature_tab_carousel);
            }

            if (hasLoaded > 0) {
                $("html, body").animate({ scrollTop: $('.feature-tabs').offset().top }, 800);
            }

            hasLoaded++;

            return false;
        }, 400, false));

        feature_tabs_reset(false);

        $(window).on('resize', Foundation.utils.throttle(function (e) {
            if ($('.feature-tab.active').length > 0) {
                move_chevron($('.feature-tab.active'));
            }
        }, 300));
    };


    /**
     * Export module method
     */
    parent.homepageFeaturesTab = {
        setup: setup,
        feature_tab_unbind: feature_tab_unbind,
        small: small,
        mobile: mobile,
        tablet: tablet,
        desktop: desktop
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.homepageFeaturesTab.setup();
});/**
 *  RR UTILS - Live Search
 */
var rr = (function (parent, $) {
    var $alphabetical_listing = $('.alphabetical-listing '),
        $result_list = $('.result-list', $alphabetical_listing);

    var populate = function (json_input) {
        var html = '',
            ctr = 0,
            arr_letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        $.getJSON(json_input, function (data) {
            var temp_id = '',
                prev_id = '';

            $.each(data.data, function (key, val) {

                // Set ID for the first item in alphabet list
                for (var i = 0; i < arr_letters.length; i++) {
                    if (val.title.toLowerCase().charAt(0) == arr_letters[i]) {
                        temp_id = 'index' + arr_letters[i];

                        if (val.title.charAt(0) != prev_id.charAt(prev_id.length - 1)) {
                            temp_id = 'index' + arr_letters[i].toUpperCase();
                            prev_id = temp_id;
                        } else {
                            temp_id = '';
                        }
                    }
                }

                if (temp_id != '') {
                    html += '<li class="alphabetical-listing-item" id="' + temp_id + '">';
                } else {
                    html += '<li class="alphabetical-listing-item">';
                }

                html += '<h2 class="alphabetical-listing-item-title">';
                html += val.title;
                html += '</h2>';
                html += '<p class="alphabetical-listing-item-text">';
                html += val.text;
                html += '</p>';
                html += '</li>';
            });

            $result_list.html(html);
        });
    }

    var setup = function () {
        $('#inputLiveSearch').hideseek({
            list: '.alphabetical-listing .result-list',
            nodata: 'No data available'
        });

        //populate('/data.json');
    };


    /**
     * Export module method
     */
    parent.liveSearch = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.liveSearch.setup();
});/**
 *  RR UTILS - Mega menu
 */
var rr = (function (parent, $) {
    var $primary_nav_item = $('.primary-nav .js-primary-nav'),
        myTimeout;

    var setup = function () {
    };

    var desktop = function () {

        // Hover intent is used to make navigation in mega menu easier.
        // Mouse out movement will not hide the panel straight away.

        $primary_nav_item.hoverIntent({
            over: function () {

                var $this = $(this);

                $this.addClass('on-hover')
                    .find('.megamenu-panel')
                    .stop().fadeIn(200, function () {

                        $(this).addClass('active');
                    });

            },
            out: function () {
                var $this = $(this);


                $this.removeClass('on-hover')
                    .find('.megamenu-panel')
                    .stop().fadeOut(100, function () {

                        $(this).removeClass('active');
                    });
            },
            timeout: 300
        });

        $('.js-mega-nav').hoverIntent({
            over: function () {
                var $this = $(this),
                    $tertiaries = $this.find('.megamenu-sub-panel'),
                    $preview = $this.parent().parent().parent().find('.preview');

                $this.addClass('on-hover');

                if ($tertiaries.length > 0) {

                    $tertiaries.show().addClass('active');
                    $preview.removeClass('active');
                }
            },
            out: function () {
                var $this = $(this),
                    $tertiaries = $this.find('.megamenu-sub-panel'),
                    $preview = $this.parent().parent().parent().find('.preview');

                $this.removeClass('on-hover');
                $tertiaries.stop().fadeOut(200).removeClass('active');
                $preview.addClass('active');
            },
            timeout: 250
        });
    };

    /**
     * Export module method
     */
    parent.megaMenu = {
        setup: setup,
        desktop: desktop
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.megaMenu.setup();
});/**
 *  RR UTILS - Mobile menu
 */
var rr = (function (parent, $) {
    var $navbar_toggle = $('.nav-bar .js-navbar-toggle'),
        $mobile_nav_close = $('.js-mobile-nav-close'),
        $mobile_nav_expand = $('.mobile-nav .js-mobile-nav-expand'),
        $mobile_nav_back = $('.mobile-nav .js-mobile-nav-back');


    var setup = function () {
    };

    var mobile = function () {

        $navbar_toggle.on('click', function (e) {
            if ($mobile_nav_close.hasClass('active')) {
                $mobile_nav_close.removeClass('active');
            } else {
                $mobile_nav_close.addClass('active');
            }
        });

        $mobile_nav_close.on('click', function (e) {
            $mobile_nav_close.removeClass('active');
        });

        $mobile_nav_expand.on('click', function (e) {
            var $mobile_nav_subpanel = $(this).next('.mobile-nav-subpanel');
            var $mobile_nav_item = $(this).closest('.mobile-nav-item');

            if ($mobile_nav_item.hasClass('on-hover')) {
                $mobile_nav_item.removeClass('on-hover');
                $mobile_nav_subpanel.removeClass('active').hide();
            }
            else {
                $('.mobile-nav-item').each(function (index) {
                    $(this).removeClass('on-hover')
                        .find('.mobile-nav-subpanel')
                        .stop().fadeOut(100, function () {

                            $(this).removeClass('active');
                        });
                });
                $mobile_nav_subpanel.show();

                $mobile_nav_item.addClass('on-hover').find('.mobile-nav-subpanel').stop().fadeIn(200, function () {

                    $(this).addClass('active');
                });
            }

            /* $('.js-mobile-nav-expand', $mobile_nav_subpanel).each(function(index) {                
                 var $this = $(this);
                 $this.css('height', $this.parent().height() );
             });
             
             $mobile_nav_subpanel.animate({
                 left:0
             },500); */
        });

        $mobile_nav_back.on('click', function (e) {
            var $mobile_nav_subpanel = $(this).parent().parent();
            $mobile_nav_subpanel.animate({
                left: '100%'
            }, 500, function () {
                $mobile_nav_subpanel.hide();
            });
        });

        /*$mobile_nav_expand.each(function(index) {
            var $this = $(this);
            $this.css('height', $this.parent().height() );
        });*/
    };

    /**
     * Export module method
     */
    parent.mobileMenu = {
        setup: setup,
        mobile: mobile
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.mobileMenu.setup();
});/**
 *  RR UTILS - MyHDB Event handlers
 */

var rr = (function (parent, $) {


    // Set height for the call to action box in MyHDB Page
    var setHeight = function () {
        var $myhdb_info_list = $('.myhdb-info-list')
        $cta_block = $('.is-cta-block .myhdb-info-list-link', $myhdb_info_list);

        $cta_block.each(function (idx) {
            var $this = $(this);

            $this.outerHeight($this.parent().parent().find('.list-item').eq(0).height());
        });
    }

    // Initial load wait until Foundation 5 equalizer finish loading
    var initialLoad = function () {
        setHeight();

        setTimeout(
            function () {
                setHeight();
            }
            , 800);
    }

    var setup = function () {

        $(window).on('resize', Foundation.utils.throttle(function (e) {
            setHeight();
        }, 500));


        // Expand collapse functionality for MyHDB page
        $('.myhdb-info .js-myhdb-info-expand').on('click', function (e) {
            var $this = $(this),
                $myhdb_summary = $this.parent();

            if ($myhdb_summary.hasClass('is-expanded')) {
                $myhdb_summary.removeClass('is-expanded');
                $myhdb_summary.find('.is-hidden').fadeOut();
                $this.find('.cta-text').text('View all');
            } else {
                $myhdb_summary.addClass('is-expanded');
                $myhdb_summary.find('.is-hidden').fadeIn();
                $this.find('.cta-text').text('Less');
            }
        });

    }

    parent.myhdb = {
        setup: setup,
        setHeight: setHeight,
        initialLoad: initialLoad
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.myhdb.setup();
});/**
 *  Onemap - helpers
 */
var rr = (function (parent, undefined) {
    'use strict';

    parent.onemap = parent.onemap || {};

    /**
     * Generate Marker
     */
    function generateMarkerGraphic(XY, iconNam, iconPath, iconWidth) {
        var coords = XY.split(","),
            xCord = coords[0],
            yCord = coords[1],
            iconURL = iconPath + iconNam,
            thmSymbol = new esri.symbol.PictureMarkerSymbol(iconURL, iconWidth, iconWidth),
            PointLocation = new esri.geometry.Point(xCord, yCord, new esri.SpatialReference({ wkid: 3857 })),
            PointGraphic = new esri.Graphic(PointLocation, thmSymbol);

        return PointGraphic;
    }


    /**
     * Convert Google Map WGS84 EPSG 4326 to Onemap WSG84 EPSG 3857
     */
    function getCoordinate(coordinate, callback) {
        var inputSR = 4326,
            outputSR = 3857,
            newCoordinate,
            CoordConvertorObj = new CoordConvertor();

        CoordConvertorObj.ConvertCoordinate(coordinate, inputSR, outputSR, callback);
    }


    /**
     * Expose method to the rr object
     */
    parent.onemap.helpers = {
        getCoordinate: getCoordinate,
        generateMarkerGraphic: generateMarkerGraphic,
    }

    return parent;

}(rr || {}, undefined));/**
 *  RR Route component
 */

var rr = (function (parent, $) {

    var setup = function () {
        var $routeSection = $('#main .route-section');

        if ($routeSection.length) {

            if (window['routeData']) {
                var routeArr = routeData.routePointsArray,
                    pointsData = routeData.pointsData,
                    $routeStart = $('#routeStart'),
                    $routeEnd = $('#routeEnd'),
                    $routeBtn = $('.js-route-btn', $routeSection);

                $routeStart.on('change', function (e) {
                    var $this = $(this),
                        endArray = routeArr.slice(), // copy array
                        htmlStr = '';

                    // Remove selected item from arrray
                    endArray.splice(routeArr.indexOf($this.val()), 1);

                    for (var i = 0; i < endArray.length; i++) {
                        htmlStr += '<option value="' + endArray[i] + '">' + endArray[i] + '</option>';
                    };

                    $routeEnd.html(htmlStr);

                    var routeStr = getRouteStr($routeStart, $routeEnd);

                });

                $routeEnd.on('change', function (e) {
                    var routeStr = getRouteStr($routeStart, $routeEnd);
                    displayData(routeStr, pointsData, $routeSection);
                });

                $routeBtn.on('click', function (e) {
                    e.preventDefault();
                    var routeStr = getRouteStr($routeStart, $routeEnd);
                    displayData(routeStr, pointsData, $routeSection);
                });

            } else {
                console.log('Unable to get route data');
            }
        }
    };

    var displayData = function (routeStr, pointsData, $routeSection) {
        var $routeDistance = $('.route-distance', $routeSection),
            $routeTime = $('.route-time', $routeSection);


        if (routeStr) {
            var distance = pointsData[routeStr].distance,
                time = pointsData[routeStr].time;

            $routeDistance.html(distance);
            $routeTime.html(time);
        }

    }

    var getRouteStr = function ($routeStart, $routeEnd) {

        var startPoint = $routeStart.val(),
            endPoint = $routeEnd.val();


        if (startPoint && endPoint) {
            var routeStr = '';

            // Build a string where startPoint is always smaller than endPoint
            if (parseInt(startPoint.replace(/[^0-9]/g, ''), 10) < parseInt(endPoint.replace(/[^0-9]/g, ''), 10)) {
                routeStr = startPoint + '-' + endPoint;
            } else {
                routeStr = endPoint + '-' + startPoint;
            }

            return routeStr;
        }

        return null;
    };


    /**
     * Export module method
     */
    parent.routeComponent = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.routeComponent.setup();
});/**
 *  RR UTILS - Secondary Navigation
 */
var rr = (function (parent, $) {
    var $carousel = $('.carousel');

    var setup = function () {


        // Desktop
        $('.secondary-nav').on('click', '.js-secondary-nav-toggle', function (e) {

            var $this = $(this),
                $subnav = $this.next('.list');

            e.preventDefault();

            if ($subnav.hasClass('active')) {
                $this.animateRotate(180, 0);
                $subnav.slideUp(function () {
                    $(this).removeClass('active');
                });
            } else {
                $this.animateRotate(0, 180);
                $subnav.slideDown(function () {
                    $(this).addClass('active');
                });
            }
        });

        //Mobile
        $('.secondary-nav').on('click', '.js-toggle-shortcut', function (e) {
            e.preventDefault();
            $this = $(this);
            $secondary_nav_list = $this.parent().next('.list');

            if ($secondary_nav_list.hasClass('active')) {
                $('.icon', $this).animateRotate(180, 0);
                $secondary_nav_list.slideUp(function () {
                    $secondary_nav_list.removeClass('active');
                });
            } else {
                $('.icon', $this).animateRotate(0, 180);
                $secondary_nav_list.slideDown(function () {
                    $secondary_nav_list.addClass('active');
                });
            }


        });

    };


    /**
     * Export module method
     */
    parent.secondaryNavigation = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.secondaryNavigation.setup();
});/**
 *  RR UTILS - Site Search module
 *  Events listener related to search
 */
var rr = (function (parent, $) {

    var $alert_bar = $('.header .alert-bar'),
        $clear_search = $('.js-clear-search'),
        $input_search = $('.js-input-search'),
        $mobile_search = $('.mobile-site-search-form');

    var setup = function () {

        $input_search.on('keyup', function (e) {
            var $this = $(this),
                $clear_search = $this.next('.js-clear-search');

            if ($this.val() !== '') {
                $clear_search.show();
            } else {
                $clear_search.hide();
            }
        });

        $clear_search.on('click', function (e) {
            e.preventDefault();
            var $this = $(this),
                $input_search = $this.parent().find('.js-input-search');

            $input_search.val('');
            $this.hide();
        });

        $('.mobile-site-search-toggle').on('click', function (e) {
            e.preventDefault();

            if ($alert_bar.is(':visible')) {
                $alert_bar.slideUp(function () {
                    $('.alert.active').removeClass('active');
                });
            }

            if ($mobile_search.is(':visible')) {
                $mobile_search.slideUp();
            } else {
                $mobile_search.slideDown();
            }
        });
    };


    /**
     * Export module method
     */
    parent.siteSearch = {
        setup: setup
    };

    return parent;

}(rr || {}, jQuery));

jQuery(function ($) {
    rr.siteSearch.setup();
});/**
 * Wrap all tables in a <div class='table-responsive' />
 *
 */
var rr = (function (parent, $) {
    'use strict';

    $.fn.hasHorizontalScrollBar = function () {
        return this.get(0) ? this.get(0).scrollWidth > this.innerWidth() : false;
    }

    var wrap = function () {
        var $table = $('table');

        if ($table.length) {
            $table.each(function () {
                var $this = $(this),
                    $parent = $this.parent();

                if (!$parent.hasClass('table-responsive')) {
                    $this.wrap('<div class="table-responsive"></div>');
                }

            });

            $table.each(function () {
                var $this = $(this),
                    $parent = $this.parent();
                if (!$parent.hasHorizontalScrollBar()) {
                    $parent.addClass('no-scrollbar');
                }
            });
        }
    };

    var unwrap = function () {
        var $table = $('table');

        if (!$table.length) {
            return false;
        }

        $('body').off('click', '.js-print-table');
        $table.each(function () {
            var $this = $(this);

            $this.unwrap();
        });
    };

    parent.tableScrollbar = {
        wrap: wrap,
        unwrap: unwrap
    };

    return parent;

}(rr || {}, jQuery));

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function decode(s) {
        if (config.raw) {
            return s;
        }
        try {
            // If we can't decode the cookie, ignore it, it's unusable.
            return decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) { }
    }

    function decodeAndParse(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        s = decode(s);

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }

    var config = $.cookie = function (key, value, options) {

        // Write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                result = decodeAndParse(cookie);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = decodeAndParse(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));
