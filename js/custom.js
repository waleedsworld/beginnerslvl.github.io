
// responsive menu

$('#bar').click(function(){
        $('.nav-desktop').css({'display':'inline-block'});
        $('#bar').css({'display':'none'});
        $('#close').css({'display':'inline-block'});
});

    $('#close').click(function(){
        $('.nav-desktop').css({'display':'none'});
        $('#bar').css({'display':'inline-block'});
        $('#close').css({'display':'none'});
});

$('.owl-one').owlCarousel({
    loop:true,
    margin:30,
    responsiveClass:true,
    // nav: true,
    navText: ["<",">"],
    responsive:{
        0:{
            items:1,
            nav:true
        },
        768:{
            items:2,
            nav:true,
            loop:true,
            margin:10
        },
        1024:{
            items:2,
            nav:true,
            loop:true,
            margin:30
        },
        1200:{
        	items:3,
            nav:true,
            loop:true
        }
    }
});

$('.owl-two').owlCarousel({
    loop:true,
    margin:30,
    responsiveClass:true,
    // nav: true,
    navText: ["<",">"],
    responsive:{
        0:{
            items:1,
            nav:true
        },
        768:{
            items:2,
            nav:true,
            loop:true,
            margin:10
        },
        1024:{
            items:2,
            nav:true,
            loop:true
        }
    }
});

$('.owl-three').owlCarousel({
    loop:true,
    margin:10,
    responsiveClass:true,
    // nav: true,
    navText: ["<",">"],
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:2,
            nav:false
        },
        1000:{
            items:5,
            nav:true,
            loop:true
        }
    }
});


// For Banner Slider Home Page
$('.owl-four').owlCarousel({
    loop:true,
    responsiveClass:true,
    nav: true,
    dots: false,
    navContainer: '#owl-four-nav',
    navText: ["<",">"],
    responsive:{
        0:{
            items:1,
            nav:true,
            loop:true
        },
        600:{
            items:1,
            nav:true,
            loop:true
        },
        1000:{
            items:1,
            nav:true,
            loop:true
        }
    }
});

// Owl Carousel For Video
$('.owl-five').owlCarousel({
        items:1,
        loop:true,
        margin:0,
        video:true,
        autoHeight:true,
        lazyLoad:true,
        center:true,
        responsive:{
            480:{
                items:1
            },
            600:{
                items:1
            }
    }
});


$('.three').owlCarousel({
    loop:true,
    responsiveClass:true,
    nav: true,
    dots: false,
    navText: ["<",">"],
    responsive:{
        0:{
            items:1,
            nav: false,
            dots: true
        },
        768:{
            items:1,
            nav:true,
            loop:true,
            margin:10
        },
        1024:{
            items:1,
            nav:true,
            loop:true,
            margin:30
        },
        1200:{
            items:1,
            nav:true,
            loop:true
        }
    }
});


// For Rating
 $(function () {
 
  $(".rateYo").rateYo({
    rating: 2,
    starWidth: "20px"
  });
 
});

// For Isotopes Course Listing && Gallery 2
var $grid = $('#cGrid').isotope({
  itemSelector: '.grid-item',
  layoutMode: 'fitRows'
});

// Combined category + keyword filtering. The category buttons and the live
// search box each set their own value, then applyCourseFilters() re-runs the
// Isotope filter so both conditions apply at the same time.
var courseCategory = '*';   // active category selector, "*" = all
var courseSearch = '';      // lowercased search term

function applyCourseFilters() {
  $grid.isotope({
    filter: function () {
      var $item = $(this);
      var matchesCategory = courseCategory === '*' || $item.is(courseCategory);
      var matchesSearch = courseSearch === '' ||
        $item.text().toLowerCase().indexOf(courseSearch) !== -1;
      return matchesCategory && matchesSearch;
    }
  });
}

// filter items on button click
$('#filters').on( 'click', 'button', function() {
  courseCategory = $(this).attr('data-filter');
  $('#filters button').removeClass('is-active');
  $(this).addClass('is-active');
  applyCourseFilters();
});

// live keyword search over the course cards
$('#course-search').on('keyup', function () {
  courseSearch = $.trim($(this).val()).toLowerCase();
  applyCourseFilters();
});


// Scroll-to-top button: injected on every page, fades in once the visitor has
// scrolled down and smoothly returns them to the top of the page on click.
var $scrollTop = $('<button>', {
  'id': 'scroll-to-top',
  'aria-label': 'Back to top',
  'html': '<i class="fas fa-arrow-up"></i>'
}).appendTo('body');

$(window).on('scroll', function () {
  if ($(this).scrollTop() > 400) {
    $scrollTop.addClass('is-visible');
  } else {
    $scrollTop.removeClass('is-visible');
  }
});

$scrollTop.on('click', function () {
  $('html, body').animate({ scrollTop: 0 }, 500);
  return false;
});

