(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    
})(jQuery);

/* --- Video Auto Play on Scroll --- */
document.addEventListener('DOMContentLoaded', () => {
    // プレイヤーの初期化
    const player = new Plyr('#player', {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        // シークバーなどの設定
        tooltips: { controls: true, seek: true }
    });

    // スクロール検知の設定
    const videoElement = document.querySelector('.video-container');
    
    // 画面に 50% 以上入ったら再生開始
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面に入った時
                player.play();
            } else {
                // 画面から出た時
                player.pause();
            }
        });
    }, { threshold: 0.5 });

    if(videoElement) {
        observer.observe(videoElement);
    }
});
