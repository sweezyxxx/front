$(function () {
    $('#jq-set-text').on('click', function () {
        $('#jq-by-id').text('Текст изменён через jQuery .text()');
    });
    $('#jq-set-html').on('click', function () {
        $('.jq-by-class').html('<strong>HTML изменён через jQuery .html()</strong>');
    });
    $('#jq-apply-css').on('click', function () {
        $('p.jq-by-tag').css({
            color: '#67e0a3',
            background: '#182033',
            padding: '6px 8px',
            borderRadius: '10px'
        });
    });

    $('#jq-hide').on('click', function () { $('#jq-paragraph').hide(); });
    $('#jq-show').on('click', function () { $('#jq-paragraph').show(); });
    $('#jq-toggle').on('click', function () { $('#jq-paragraph').toggle(); });

    $('#jq-fade-in').on('click', function () { $('#jq-fade-img').fadeIn(200); });
    $('#jq-fade-out').on('click', function () { $('#jq-fade-img').fadeOut(200); });
    $('#jq-fade-toggle').on('click', function () { $('#jq-fade-img').fadeToggle(200); });

    $('#jq-slide-down').on('click', function () { $('#jq-panel').slideDown(200); });
    $('#jq-slide-up').on('click', function () { $('#jq-panel').slideUp(200); });
    $('#jq-slide-toggle').on('click', function () { $('#jq-panel').slideToggle(200); });

    $('#jq-prepend-item').on('click', function () {
        $('#jq-list').prepend('<li class="jq-item">Новый элемент (в начало)</li>');
    });
    $('#jq-append-item').on('click', function () {
        $('#jq-list').append('<li class="jq-item">Новый элемент (в конец)</li>');
    });
    $('#jq-remove-item').on('click', function () {
        const items = $('#jq-list li');
        if (items.length) items.last().remove();
    });

    $('#jq-change-img').on('click', function () {
        const img = $('#jq-switch-img');
        const current = img.attr('src') || '';
        const next = current.includes('newone.png') ? 'public/images/carbonara.jpg' : 'public/images/newone.png';
        img.attr('src', next);
    });
    $('#jq-change-link').on('click', function () {
        const link = $('#jq-dynamic-link');
        const toRecipes = link.attr('href') !== 'recipes.html';
        link.attr('href', toRecipes ? 'recipes.html' : 'https://example.com');
        link.attr('target', toRecipes ? '' : '_blank');
        link.text(toRecipes ? 'Открыть рецепты' : 'Внешняя ссылка');
    });

    $('#jq-animate-steps').on('click', function () {
        const box = $('#jq-box');
        box.stop(true, true)
            .animate({ left: "+=150px" }, 400)
            .animate({ top: "+=150px" }, 400)
            .animate({ width: "60px", height: "60px" }, 400)
            .animate({ left: "0px", top: "0px", width: "100px", height: "100px" }, 400);
    });
    $('#jq-animate-combined').on('click', function () {
        $('#jq-box').stop(true, true).animate({
            left: '200px',
            top: '80px',
            opacity: 0.55,
            width: '140px',
            height: '140px'
        }, 600);
    });

    $('.jq-gallery .thumb').on('click', function () {
        const thumb = $(this);
        const src = thumb.attr('data-large') || thumb.attr('src');
        const preview = $('.jq-gallery .preview img');
        $('.jq-gallery .thumb').removeClass('active').css('opacity', 0.6);
        thumb.addClass('active').css('opacity', 1);
        preview.stop(true, true).fadeOut(120, function () {
            preview.attr('src', src).fadeIn(120);
        });
    });
    $('#jq-gallery-hide').on('click', function () { $('.jq-gallery .thumbs').fadeOut(180); });
    $('#jq-gallery-show').on('click', function () { $('.jq-gallery .thumbs').fadeIn(180); });
    $('#jq-gallery-toggle').on('click', function () { $('.jq-gallery .thumbs').fadeToggle(180); });

    $('.jq-accordion .accordion-header').on('click', function () {
        const header = $(this);
        const content = header.next('.accordion-content');
        if (content.is(':visible')) {
            content.slideUp(180);
            header.removeClass('open');
        } else {
            $('.jq-accordion .accordion-content:visible').slideUp(180);
            $('.jq-accordion .accordion-header.open').removeClass('open');
            content.slideDown(180);
            header.addClass('open');
        }
    });

    $('#jq-start-bounce').on('click', function () {
        const area = $('.jq-ball-area');
        const ball = $('.jq-ball');
        const maxX = (area.width() || 300) - (ball.outerWidth() || 0);
        const maxY = (area.height() || 200) - (ball.outerHeight() || 0);

        function bounce(xToRight, yToBottom, times) {
            if (times <= 0) return;
            ball.stop(true, false).animate({
                left: xToRight ? maxX : 0,
                top: yToBottom ? maxY : 0
            }, 400, 'swing', function () {
                bounce(!xToRight, !yToBottom, times - 1);
            });
        }

        bounce(true, true, 8);
    });
    $('#jq-stop-bounce').on('click', function () { $('.jq-ball').stop(true); });
});


