(function($) {
    "use strict";



    /* cart */
    $(".icon-cart").on("click", function() {
        $(this).parent().find('.cart-toogle').slideToggle('medium');
    })
    
    /* search */
    $(".icon-search").on("click", function() {
        $(this).parent().find('.toogle-content').slideToggle('medium');
    })
    
    
    $('.slider-active').owlCarousel({
        loop: true,
        nav: true,
        items: 1,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.slider-active-5').owlCarousel({
        loop: true,
        nav: true,
        items: 1,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.brand-logo-active').owlCarousel({
        loop: true,
        nav: true,
        margin: 30,
        items: 5,
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        responsive: {
            0: {
                items: 2
            },
            768: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    })
    
    
    $('.single-portfolio-slider-active').owlCarousel({
        loop: true,
        nav: true,
        margin: 30,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.related-post-active').owlCarousel({
        loop: true,
        nav: true,
        items: 4,
        navText: ['<i class="pe-7s-angle-left"></i>', '<i class="pe-7s-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    })
    
    
    $('.testimonials-active').owlCarousel({
        loop: true,
        nav: false,
        margin: 30,
        items: 2,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 2
            }
        }
    })
    
    
    $('.slider-active-seven').owlCarousel({
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        nav: false,
        items: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.testimonials-active-4').owlCarousel({
        loop: true,
        nav: false,
        items: 3,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    })
    
    
    $('.blog-slider-active').owlCarousel({
        loop: true,
        nav: true,
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        items: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    $('.sidebar-slider').owlCarousel({
        loop: true,
        nav: false,
        items: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.testimonials-3-active').owlCarousel({
        loop: true,
        nav: false,
        items: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    $('.details-tab').owlCarousel({
        loop: true,
        nav: false,
        margin:30,
        items: 5,
        responsive: {
            0: {
                items: 2
            },
            768: {
                items: 4
            },
            1000: {
                items: 5
            }
        }
    })
    
    
    /* isotop active */
    // filter items on button click
    
    var portfolioarea = $('.portfolio-area , .portfolio-style');
    var portfoliomenuactive = $('.portfolio-menu-active');
    portfolioarea.masonry(function() {
        portfoliomenuactive.on('click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({
                filter: filterValue
            });
        });
        // init Isotope
        var $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.grid-item',
            }
        });
    });
    
    
    /* isotop active */
    // filter items on button click
    portfolioarea.imagesLoaded(function() {
        portfoliomenuactive.on('click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({
                filter: filterValue
            });
        });
        // init Isotope
        var $grid = $('.grid-2').isotope({
            itemSelector: '.grid-item-2',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: 1,
            }
        });
    });
    
    
    $('.portfolio-menu-active button').on('click', function(event) {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
    });
    
    
    /* magnificPopup image popup */
    $('.img-poppu').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });
    
    
    /*--
    Testimonial Slick Carousel
    -----------------------------------*/
    $('.testimonial-text-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        draggable: false,
        fade: true,
        asNavFor: '.slider-nav',
    });
    
    
    /*--
        Testimonial Slick Carousel as Nav
    -----------------------------------*/
    $('.testimonial-image-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.testimonial-text-slider',
        dots: false,
        arrows: false,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: '0px',
        responsive: [{
                breakpoint: 767,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 420,
                settings: {
                    autoplay: true,
                    dots: false,
                    slidesToShow: 2,
                    centerMode: false,
                }
            }
        ]
    });
    
    
    /*---------------------
    price slider
    --------------------- */
    var sliderrange = $('#slider-range');
    var amountprice = $('#amount');
    $(function() {
        sliderrange.slider({
            range: true,
            min: 0,
            max: 1200,
            values: [0, 1000],
            slide: function(event, ui) {
                amountprice.val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        amountprice.val("$" + sliderrange.slider("values", 0) +
        " - $" + sliderrange.slider("values", 1));
    });
    
    
    /*----- 
    	Cart Plus Minus
    --------------------------------*/
    $('.pro-qty, .cart-plus-minus-2').append('<span class="inc qtybtn"><i class="fa fa-plus"></i></span>');
    $('.pro-qty, .cart-plus-minus-2').append('<span class="dec qtybtn"><i class="fa fa-minus"></i></span>');
    $('.qtybtn').on('click', function() {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });
    
    
    /*--- showlogin toggle function ----*/
    $('#showlogin').on('click', function() {
        $('#checkout-login').slideToggle(900);
    });
    
    
    /*--- showlogin toggle function ----*/
    $('#showcoupon').on('click', function() {
        $('#checkout_coupon').slideToggle(900);
    });
    
    
    /*--- showlogin toggle function ----*/
    $('#ship-box').on('click', function() {
        $('#ship-box-info').slideToggle(1000);
    });
    
    
    /* parallax active  */
    $('.parallax-window').parallax();
    
    
    /*--------------------------
        09. ScrollUp
    ---------------------------- */
    $.scrollUp({
        scrollText: '<i class="fa fa-angle-double-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });
    
    
    /* jQuery MeanMenu */
    $('#mobile-menu-active').meanmenu({
        meanScreenWidth: "767",
        meanMenuContainer: ".mobile-menu-area .mobile-menu",
    });
    
    
    /*------------------------------------    
      08. Toogle Menu
    --------------------------------------*/
    var bodyoverlay = $('.body__overlay');
    var offsetmenu = $('.offsetmenu');
    $('.toggle__menu').on('click', function() {
        offsetmenu.addClass('offsetmenu__on');
        bodyoverlay.addClass('is-visible');
    });
    
    $('.offsetmenu__close__btn').on('click', function() {
        offsetmenu.removeClass('offsetmenu__on');
        bodyoverlay.removeClass('is-visible');
    });
    
    
    /*------------------------------------    
      09. Overlay Close
    --------------------------------------*/
    bodyoverlay.on('click', function() {
        $(this).removeClass('is-visible');
        offsetmenu.removeClass('offsetmenu__on');
    });
    
    
    /* creative-menu-6 */
    $(".sidebar-menu-active").on("click", function() {
        $(".sidebar-mega-menu").toggleClass('open');
        return false;
    })
    
    
    /*--
    Menu Stick
    -----------------------------------*/
    var header = $('.transparent-bar');
    var win = $(window);
    
    win.on('scroll', function() {
        var scroll = win.scrollTop();
        if (scroll < 1) {
            header.removeClass('stick');
        } else {
            header.addClass('stick');
        }
    });
    
    /* counterUp */
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });
    
    /* magnific video popup */
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });
    
    
    
    
    
    
    
    
    
    
    



})(jQuery);