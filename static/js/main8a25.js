'use strict';

var landscapeBlock = document.querySelector('.landscape__alert');

// Menu
var menu = document.querySelector('.fordheader__menu');
var menuItems = Array.from(document.querySelectorAll('.fordheader__menu a'));

menuItems.push(document.querySelector('a.fordheader__fordlogo'));
menuItems.push(document.querySelector('a.fordfooter__fordlogo'));

var openMobileMenu = document.querySelector('.fordheader__mobilemenu');

var goToTop = function goToTop() {
    var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 450;

    scrollIt(document.querySelector('a[name=explore]'), speed, 'easeOutQuad');
};

Array.from(menuItems).forEach(function (el) {
    var _href = el.getAttribute('href');
    var _anchorName = _href.substr(_href.indexOf('#') + 1);

    el.addEventListener('click', function () {
        scrollIt(document.querySelector('a[name=' + _anchorName + ']'), 750, 'easeOutQuad');

        if (el.classList.contains('fordfooter__fordlogo')) return;

        var _gaTag = el.classList.contains('fordheader__fordlogo') ? 'Logo Ford' : el.innerHTML;
        var _gaEvent = el.classList.contains('fordheader__fordlogo') ? 'Site Ford' : 'clique';
        ga('send', 'event', 'Header', _gaTag, _gaEvent);
    });
});

openMobileMenu.addEventListener('click', function (e) {
    return menu.classList.toggle('opened');
});

// cube position
var adjust360Position = function adjust360Position() {
    var _cube = document.querySelector('#cube');
    var _jog = document.querySelector('#jogwheel');

    if (_cube) {
        _cube.style.marginTop = -(_cube.clientHeight - _cube.parentElement.parentElement.clientHeight) / 2 + 'px';
        _cube.style.marginLeft = -(_cube.clientWidth - _cube.parentElement.parentElement.clientWidth) / 2 + 'px';
    }

    if (_jog) _jog.parentElement.style.height = _jog.parentElement.parentElement.clientHeight + 'px';
};

var resetCubeCam = function resetCubeCam() {
    // reset cube
    if (!cube.isIE10) {
        cube.yaw = 0;cube.pitch = -11;
    };
};

document.addEventListener("cube-loaded", function () {
    // 360
    var cubePivot = document.querySelector('vz-cubepivot') || document.querySelector('[data-cube]');
    var cubeVinhete = document.querySelector('.content__360__interior__overlay');
    var cubeFeatures = !cube.isIE10 ? document.querySelectorAll('vz-cube-feature') : document.querySelectorAll('[data-feature]');
    var jogwheel = document.querySelector('#jogwheel');
    var jogOverlay = document.querySelector('.jogwheel__anchors-overlay');
    var tooltip = document.querySelector('.content__360__tooltip');
    var internalNextButton = document.querySelector('.content__360__next--internal');
    var externalNextButton = document.querySelector('.content__360__next--external');

    var container360 = document.querySelector('.content__360');
    var preview360 = document.querySelector('.content__360__preview');
    var mobileInitButton = document.querySelector('.content__360__preview__button');
    var mobileCloseButton = document.querySelector('.content__360__alert__close');

    var interior = document.querySelector('.content__360__interior');
    var exterior = document.querySelector('.content__360__exterior');

    var switcher = document.querySelectorAll('.content__360__switch button');

    adjust360Position();
    setTimeout(resetCubeCam, 200);

    // mobile flow
    var prevDefault = function prevDefault(e) {
        return e.preventDefault();
    };

    mobileInitButton.addEventListener('click', function (e) {
        e.preventDefault();

        window.addEventListener('orientationchange', showSign);

        container360.classList.add('mobileactive');
        landscapeBlock.classList.add('no-show');
        adjust360Position();

        container360.addEventListener('touchmove', prevDefault);
    });

    mobileCloseButton.addEventListener('click', function (e) {
        e.preventDefault();

        container360.classList.remove('mobileactive');
        landscapeBlock.classList.remove('no-show');

        container360.removeEventListener('touchmove', prevDefault);
    }); // end moble flow

    // usado apenas pro GA dos tooltips
    var currentTooltip = void 0;

    var openTooltip = function openTooltip(feature) {
        var tooltip = document.querySelector('.content__360__tooltip');
        var name = !cube.isIE10 ? feature.getAttribute('name') : feature.getAttribute('data-name');

        currentTooltip = feature.getAttribute('data-ga');
        ga('send', 'event', 'Explore', currentTooltip, 'Abrir');

        cubePivot.classList.add('zoomed');
        cubeVinhete.classList.add('active');

        tooltip.querySelector('.content__360__tooltip__title').innerHTML = feature.getAttribute('title');
        tooltip.querySelector('.content__360__tooltip__description').innerHTML = feature.innerHTML;
        tooltip.classList.add('content__360__tooltip--visible');

        tooltip.setAttribute('data-name', name);

        if (cube.isIE10) {
            cubeVinhete.setAttribute('data-show', name);
        }
    };

    var openExtTooltip = function openExtTooltip(e) {
        var feature = e.currentTarget;

        currentTooltip = feature.getAttribute('data-ga');
        ga('send', 'event', 'Explore', currentTooltip, 'Abrir');

        jogwheel.classList.add('locked');

        tooltip.querySelector('.content__360__tooltip__title').innerHTML = feature.getAttribute('title');
        tooltip.querySelector('.content__360__tooltip__description').innerHTML = feature.getAttribute('data-description');
        tooltip.classList.add('content__360__tooltip--visible');
        tooltip.classList.add('content__360__tooltip--external');
    };

    var closeTooltip = function closeTooltip() {
        cubePivot.classList.remove('zoomed');
        cubeVinhete.classList.remove('active');

        jogwheel.classList.remove('locked');

        ga('send', 'event', 'Explore', currentTooltip, 'Fechar');

        tooltip.querySelector('.content__360__tooltip__title').innerHTML = '';
        tooltip.querySelector('.content__360__tooltip__description').innerHTML = '';
        tooltip.classList.remove('content__360__tooltip--visible');
        setTimeout(function () {
            tooltip.classList.remove('content__360__tooltip--external');
            tooltip.removeAttribute('data-name');

            if (cube.isIE10) {
                cubeVinhete.removeAttribute('data-show');
            }
            internalNextButton.style.opacity = 1;
        }, 300);

        if (cube.isIE10) return;

        cube.zoomOut();
        cube.unfreeze();
    };

    Array.from(cubeFeatures).forEach(function (el) {

        el.addEventListener('click', function (e) {
            goToTop();
            internalNextButton.style.opacity = 0;

            if (cube.isIE10) {
                openTooltip(el);
            } else {
                cube.animateTo(-el.yaw, -el.pitch, undefined, function () {
                    cube.zoomIn();
                    cube.freeze();
                    openTooltip(el);
                });
            }
        });
    });

    document.querySelector('.content__360__close').addEventListener('click', closeTooltip);

    // EXTERNO
    Array.from(document.querySelectorAll('.jogwheel__anchor')).forEach(function (el) {
        el.addEventListener('click', function (e) {
            goToTop();
            openExtTooltip(e);
        });
    });

    // Switcher
    Array.from(switcher).forEach(function (button) {
        button.addEventListener('click', function (e) {

            goToTop();
            closeTooltip();

            if (interior.classList.contains('active')) {
                Array.from(switcher).forEach(function (button) {
                    return button.classList.toggle('active');
                });
                interior.classList.remove('active');
                exterior.classList.add('active');

                // reset cube
                setTimeout(resetCubeCam, 200);
                externalNextButton.style.opacity = 0;

                goToTime(6.31, 1, function () {
                    externalNextButton.style.opacity = 1;
                });

                ga('send', 'event', 'Home', 'Ver Exterior', 'Clique');
            } else {
                externalNextButton.style.opacity = 0;

                goToTime(0, 2, function () {
                    Array.from(switcher).forEach(function (button) {
                        return button.classList.toggle('active');
                    });
                    interior.classList.add('active');
                    exterior.classList.remove('active');

                    adjust360Position();
                });

                ga('send', 'event', 'Home', 'Ver Interior', 'Clique');
            }
        });
    });

    internalNextButton.addEventListener('click', function (e) {
        e.preventDefault();
        ga('send', 'event', 'Explore', 'Scroll down', 'Clique');
        scrollIt(document.querySelector('a[name=conheca]'), 450, 'easeOutQuad');
    });

    externalNextButton.addEventListener('click', function (e) {
        e.preventDefault();
        ga('send', 'event', 'Explore', 'Scroll down', 'Clique');
        scrollIt(document.querySelector('a[name=conheca]'), 450, 'easeOutQuad');
    });
});

// slider
var sections = ['conectividade', 'versatilidade', 'seguranca', /*'eficiencia',*/'conforto'];

var siema = [];
var siemaChange = [];
var siemaLoaded = [];

window.addEventListener('load', function () {
    Array.from(sections).forEach(function (section) {
        siemaChange[section] = function () {
            var slides = document.querySelectorAll('.content__' + section + ' .fordHighlight__gallery__slider img');
            var caption = slides[this.currentSlide].getAttribute('alt');

            document.querySelector('.content__' + section + ' .fordHighlight__gallery__caption').innerHTML = caption;

            if (this.currentSlide === 0) {
                document.querySelector('.content__' + section + ' .siema-prev').classList.add('inactive');
            } else {
                document.querySelector('.content__' + section + ' .siema-prev').classList.remove('inactive');
            }

            if (this.currentSlide === slides.length - 1) {
                document.querySelector('.content__' + section + ' .siema-next').classList.add('inactive');
            } else {
                document.querySelector('.content__' + section + ' .siema-next').classList.remove('inactive');
            }

            // bullets
            var bullets = document.querySelectorAll('.content__' + section + ' .siema-bullet');

            Array.from(bullets).forEach(function (el) {
                el.classList.remove('active');
            });
            bullets[this.currentSlide].classList.add('active');

            if (siemaLoaded[section]) {
                ga('send', 'event', 'Conheça', caption + ' - seta', 'Clique');
            } else {
                siemaLoaded[section] = true;
            }
        };

        siema[section] = new Siema({
            selector: '.content__' + section + ' .fordHighlight__gallery__slider',
            draggable: true,
            onInit: siemaChange[section],
            onChange: siemaChange[section]
        });

        document.querySelector('.content__' + section + ' .siema-prev').addEventListener('click', function () {
            return siema[section].prev();
        });
        document.querySelector('.content__' + section + ' .siema-next').addEventListener('click', function () {
            return siema[section].next();
        });
    });
});

// indique um amigo
fordFloatLabel.bindAll(document.querySelectorAll('.content__indique__form__input'));

var indiqueButton = document.querySelector('.content__indique__openform');
var indiqueStep1 = document.querySelector('.content__indique__step1');
var indiqueStep2 = document.querySelector('.content__indique__step2');
var indiqueForm = document.querySelector('.content__indique__form');
var indiqueClose = document.querySelector('.content__indique__close');
var indiqueSubmit = document.querySelector('.content__indique__form__submit');

var indiqueOpenFn = function indiqueOpenFn() {
    ga('send', 'event', 'Home', 'Botão Indicar Amigo', 'Clique');
    ga('send', 'pageview', 'Indicar um Amigo - Formulario');

    scrollIt(document.querySelector('a[name=indique]'), 200, 'easeOutQuad');
    indiqueStep1.style.opacity = '0';

    setTimeout(function () {
        indiqueStep1.classList.remove('is-active');
        indiqueStep2.classList.add('is-active');
    }, 150);
};

var indiqueCloseFn = function indiqueCloseFn() {
    indiqueStep1.classList.add('is-active');
    indiqueStep2.classList.remove('is-active');

    ga('send', 'event', 'Indicar um Amigo - Formulario', 'Fechar', 'Clique');

    setTimeout(function () {
        indiqueStep1.style.opacity = '1';
        indiqueForm.reset();
    }, 410);
};

indiqueButton.addEventListener('click', indiqueOpenFn);
indiqueClose.addEventListener('click', indiqueCloseFn);

document.querySelector('.content__indique__form__input').addEventListener('blur', function (e) {
    if (!e.currentTarget.getAttribute('data-ga-done')) {
        ga('send', 'event', 'Indicar um Amigo - Formulario', e.currentTarget.getAttribute('placeholder'), 'Preencheu');
        e.currentTarget.setAttribute('data-ga-done', 'true');
    }
});

indiqueForm.addEventListener('submit', function (e) {
    e.preventDefault();
    ga('send', 'event', 'Indicar um Amigo - Formulario', 'Enviar', 'Clique');

    indiqueSubmit.innerHTML = 'Enviando...';
    indiqueSubmit.setAttribute('disabled', true);

    atomic.ajax({
        url: './share-with-a-friend/',
        type: 'POST',
        data: {
            "friend[name]": indiqueForm.querySelector('#app_indique_name').value,
            "friend[email]": indiqueForm.querySelector('#app_indique_email').value
        }
    }).success(function (data, xhr) {
        ga('send', 'pageview', 'Indicar um Amigo - Sucesso');

        document.querySelector('.content__indique__title').innerHTML = 'Amigo indicado! Indique outro amigo para conhecer o Novo EcoSport.';
        indiqueCloseFn();
    }).always(function () {
        indiqueSubmit.innerHTML = 'Enviar';
        indiqueSubmit.removeAttribute('disabled');
    });
});

// Start gallery
var galleryEl = document.querySelector('.fordGallery');
var galleryImages = galleryEl.querySelectorAll('img');

var galleryView = document.querySelector('.fordGalleryView');
var galleryViewSlider = document.querySelector('.fordGalleryView__slider');

var galleryViewClose = galleryView.querySelector('.fordGalleryView__close');
var galleryViewPrev = galleryView.querySelector('.fordGalleryView__prev');
var galleryViewNext = galleryView.querySelector('.fordGalleryView__next');

var scrollTop = void 0;

var fordGallery = {
    siema: siema,

    init: function init(e) {
        fordGallery.siema = new Siema({
            selector: '.fordGalleryView__slider',
            onInit: fordGallery.updateSlider,
            onChange: fordGallery.updateSlider
        });
    },

    updateSlider: function updateSlider() {
        var _index = fordGallery.siema.currentSlide || 0,
            _prevIndex = _index - 1,
            _nextIndex = _index + 1,
            _gallerySize = galleryImages.length;

        if (_prevIndex >= 0) {
            galleryViewPrev.style.left = -galleryViewPrev.clientHeight / 2 + 'px';
            galleryViewPrev.style.backgroundImage = 'url(' + galleryImages[_prevIndex].src + ')';
        } else {
            galleryViewPrev.style.left = -galleryViewPrev.clientHeight - 10 + 'px';
        }

        if (_nextIndex < _gallerySize) {
            galleryViewNext.style.right = -galleryViewNext.clientHeight / 2 + 'px';
            galleryViewNext.style.backgroundImage = 'url(' + galleryImages[_nextIndex].src + ')';
        } else {
            galleryViewNext.style.right = -galleryViewNext.clientHeight - 10 + 'px';
        }

        document.querySelector('.fordGalleryView__caption').innerHTML = galleryImages[_index].getAttribute('data-caption');
    },

    open: function open(e) {
        e.preventDefault();
        landscapeBlock.classList.add('no-show');

        var parent = e.currentTarget.parentNode;
        var index = Array.from(parent.parentNode.children).indexOf(parent);

        var imgUrl = e.currentTarget.style.backgroundImage;
        var imgName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('"') - (imgUrl.lastIndexOf('/') + 1));

        fordGallery.siema.goTo(index);
        ga('send', 'event', 'Home', imgName, 'Clique');

        scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;

        setTimeout(function () {
            galleryView.classList.add('opened');
            galleryView.style.top = parseInt(document.body.clientWidth) < 1024 ? 0 : document.querySelector('.fordheader').clientHeight + 'px';
            galleryView.style.opacity = '1';

            setTimeout(function () {
                document.querySelector('html').style.top = -scrollTop + 'px';
                document.querySelector('html').style.position = 'fixed';
                document.querySelector('html').style.overflowY = 'scroll';
            }, 200);
        }, 200);
    },

    close: function close(e) {
        e.preventDefault();
        landscapeBlock.classList.remove('no-show');

        galleryView.style.top = '100%';
        galleryView.style.opacity = '0';

        var imgUrl = galleryImages[fordGallery.siema.currentSlide].src;
        var imgName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);

        ga('send', 'event', 'Galeria', imgName + '- fechar', imgName + '- fechar');

        document.querySelector('html').style.top = 0;
        document.querySelector('html').style.position = 'static';
        document.querySelector('html').style.overflow = 'auto';

        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop; // IE

        galleryView.classList.remove('opened');
    },

    goTo: function goTo(e, direction) {
        var imgUrl = e.currentTarget.style.backgroundImage,
            imgName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('"') - (imgUrl.lastIndexOf('/') + 1)),
            gaTag = void 0;

        if (direction == 'prev') {
            fordGallery.siema.prev();
            gaTag = 'Seta esquerda - ' + imgName;
        } else {
            fordGallery.siema.next();
            gaTag = 'Seta direita - ' + imgName;
        }

        ga('send', 'event', 'Galeria', gaTag, 'Clique');
    }
};

galleryViewClose.addEventListener('click', fordGallery.close);
galleryViewPrev.addEventListener('click', function (e) {
    return fordGallery.goTo(e, 'prev');
});
galleryViewNext.addEventListener('click', function (e) {
    return fordGallery.goTo(e, 'next');
});

// ESCAPE key pressed
document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = evt.key == "Escape" || evt.key == "Esc";
    } else {
        isEscape = evt.keyCode == 27;
    }

    if (isEscape && galleryView.classList.contains('opened')) {
        fordGallery.close(evt);
    }

    if (isEscape && document.querySelector('.content__360__tooltip').classList.contains('content__360__tooltip--visible')) {
        document.querySelector('.content__360__close').dispatchEvent(newEvent('click'));
    }
};

var wmax = Math.max(parseInt(window.innerWidth), parseInt(window.innerHeight)) * window.devicePixelRatio;

Array.from(galleryImages).forEach(function (el) {
    var imageUrl = el.src,
        thumbUrl = el.src;

    thumbUrl = window.innerWidth < 480 ? thumbUrl : thumbUrl.replace('-sm', '');
    imageUrl = wmax < 480 ? imageUrl : wmax > 1024 ? imageUrl.replace('-sm', '-lg') : imageUrl.replace('-lg', '');

    el.parentElement.style.backgroundImage = 'url(' + thumbUrl + ')';
    el.parentElement.addEventListener('click', fordGallery.open);

    var img = document.createElement('div');
    img.classList.add('fordGalleryView__slider__image');
    img.style.backgroundImage = 'url(' + imageUrl + ')';

    galleryViewSlider.appendChild(img);
    el.parentNode.removeChild(el);
});

fordGallery.init();

// resize fix
window.addEventListener('resize', function (e) {
    // 360
    adjust360Position();

    // gallery
    if (galleryView.classList.contains('opened')) {
        //galleryView.style.top = document.querySelector('.fordheader').clientHeight + 'px';
        fordGallery.updateSlider();
    }
});

// scroll events
// GA constants
var exploreOffset = document.querySelector('a[name=explore]').offsetTop + 300,
    conhecaOffset = document.querySelector('a[name=conheca]').offsetTop + 300,
    galeriaOffset = document.querySelector('a[name=galeria]').offsetTop + 300;

var exploreViewed = false,
    conhecaViewed = false,
    galeriaViewed = false;

window.addEventListener('scroll', function (e) {
    // close menu
    if (menu.classList.contains('opened')) menu.classList.remove('opened');

    // ga
    if (typeof ga !== 'undefined') {
        var _scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;

        if (_scrollTop > exploreOffset && !exploreViewed) {
            exploreViewed = true;
            ga('send', 'pageview', 'Explore o Ecosport');
        }

        if (_scrollTop > conhecaOffset && !conhecaViewed) {
            conhecaViewed = true;
            ga('send', 'pageview', 'Conheça o Ecosport');
        }

        if (_scrollTop > galeriaOffset && !galeriaViewed) {
            galeriaViewed = true;
            ga('send', 'pageview', 'Galeria de fotos');
        }
    }
});