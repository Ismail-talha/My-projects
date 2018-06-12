


$(document).ready(function () {

    //scroll alert


    getHeight = $('.cartItems').height();
    var getHeightMinus = '-' + getHeight + 'px';
    $('.cartItems').css('top', getHeightMinus);

    $('.openCart').click(function () {
        if ($('.cartItems .items').html() !== '') {
            if ($('.cartItems').css('display') == 'block') {
                $('.cartItems').animate({ top: getHeightMinus });
                $('.itemCartBox').animate({ top: '0px' });
                setTimeout(function () { $('.cartItems').hide() }, 500);
            }
            else {
                $('.cartItems').show();
                $('.cartItems').animate({ top: '0px' });
                $('.itemCartBox').animate({ top: getHeight });
            }
        }
        else {
        }
    });




    $('.masthead')
         .visibility({
             once: false,
             onBottomPassed: function () {
                 $('.fixed.menu').transition('fade in');
             },
             onBottomPassedReverse: function () {
                 $('.fixed.menu').transition('fade out');
             }
         });

    // create sidebar and attach to menu open
    // $('.ui.sidebar').sidebar('attach events', '.toc.item');















    $(".menuCat .card").hover(function () {

        //$(this).find('.linkTab').animate({ height: "130px" });
        $(this).find('.linkTab').animate({ height: "130px" });

    }, function () {

        //$(this).find('.linkTab').animate({ height: "50px" });
        $(this).find('.linkTab').animate({ height: "0px" });

    });

    var slideCount = $('#slider ul li').length;
    var slideWidth = $('#slider ul li').width();
    var slideHeight = $('#slider ul li').height();
    var sliderUlWidth = slideCount * slideWidth;

    $('#slider').css({ width: slideWidth, height: slideHeight });

    $('#slider ul').css({ width: sliderUlWidth, marginLeft: -slideWidth });

    $('#slider ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
        $('#slider ul').animate({
            left: +slideWidth
        }, 200, function () {
            $('#slider ul li:last-child').prependTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    function moveRight() {
        $('#slider ul').animate({
            left: -slideWidth
        }, 200, function () {
            $('#slider ul li:first-child').appendTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });

    var
      changeSides = function () {
          $('.ui.shape')
            .eq(0)
              .shape('flip over')
              .end()
            .eq(1)
              .shape('flip over')
              .end()
            .eq(2)
              .shape('flip back')
              .end()
            .eq(3)
              .shape('flip back')
              .end()
          ;
      },
      validationRules = {
          firstName: {
              identifier: 'email',
              rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter an e-mail'
                },
                {
                    type: 'email',
                    prompt: 'Please enter a valid e-mail'
                }
              ]
          }
      };

    // $('.ui.dropdown').dropdown({on: 'hover'});

    // $('.ui.form').form(validationRules, {on: 'blur'});

    $('.masthead .information')
      .transition('scale in', 1000);

    setInterval(changeSides, 3000);




});

function openNav() {

    document.getElementById("mySidenav").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("main");
    document.body.style.backgroundColor = "white";
}

$(window).scroll(function (event) {

    console.log($(document).scrollTop());

    var scroll_position = $(window).scrollTop();
    if ($(window).width() >= 984) {


        //MenuHideShow();
        if (scroll_position == '0' || scroll_position < '46') {
            $("#hide").hide();
            $("#hide1").show();
        }

        else {
            $("#hide").show();
            $("#hide1").hide();
        }
    }
});
