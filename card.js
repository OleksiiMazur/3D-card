"use strict";

if ( location.protocol !== "https:" ) {
    location.href = "https:" + window.location.href.substring( window.location.protocol.length );
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
    };
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}
function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function deviceOrientation(){
    let $card = document.querySelector('.card');
    let $body = document.querySelector('body');

    function sendRequest(){
        $body.addEventListener('click', function () { // feature detect
            DeviceOrientationEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    setCookie('device_orientation_request_granted', 'granted', {
                        secure: false,
                        'samesite': 'lax',
                        'max-age': 1000000,
                    });

                    deviceOrientationParallax();
                }
            }).catch(console.error);
        });
    }

    function desktopParallax() {
        document.addEventListener('mousemove', function (e) {
            let leftRight  = -(window.innerWidth / 2 - e.pageX) / 35;
            let bottomTop  = (window.innerHeight / 2 - e.pageY + pageYOffset) / 20;

            $card.style.transform = 'rotateX(' + (bottomTop) + 'deg) rotateY(' + (leftRight) + 'deg)';
        });
    }

    function deviceOrientationParallax() {
        window.addEventListener('deviceorientation', function(event){
            let bottomTop;
            let leftRight;
            let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;

            bottomTop = event.beta / 1.5;
            leftRight = -(event.gamma / 2.5);

            if (orientation === "portrait-primary") {
                bottomTop = event.beta / 1.5;
                leftRight = -(event.gamma / 2.5);
            } else if (orientation === "portrait-secondary") {
                bottomTop = -(event.beta / 1.5);
                leftRight = (event.gamma / 2.5);
            } else if (orientation === "landscape-primary") {
                bottomTop = -(event.gamma / 2.5);
                leftRight = -(event.beta / 1.5);
            } else if (orientation === "landscape-secondary") {
                bottomTop = (event.gamma / 2.5);
                leftRight = (event.beta / 1.5);
            } else if (orientation === "portrait-secondary") {
                bottomTop = -(event.gamma / 1.5);
                leftRight = (event.beta / 2.5);
            }

            $card.style.transform = 'rotateX(' + (bottomTop - 25) + 'deg) rotateY(' + leftRight + 'deg)';

            // document.querySelector('.card__info').textContent  = 'bottomTop: ' + event.beta + 'deg' + '\nleftRight: ' + event.gamma + 'deg' + '\n compass: ' + event.alpha;
        }, false);
    }

    function scrollParallax() {
        // alert('scrollParallax');
        let windowHeight = window.innerHeight;
        let cardHeight = $card.offsetHeight;

        window.addEventListener('scroll', function() {
            let cardTop = $card.offsetTop;
            let bottomTop = pageYOffset - cardTop + windowHeight / 2 - cardHeight / 2;

            if(pageYOffset < (cardTop + windowHeight + 150) && pageYOffset > (cardTop - windowHeight - 150)) {
                $card.style.transform = 'rotateX(' + -(bottomTop / 10) + 'deg) rotateY(0deg)';
            }
        });
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        /**
         * For iPhone if need request for using DeviceOrientationEvent
         * */

        if( !getCookie('device_orientation_request_granted') ){
            sendRequest();
        } else if (getCookie('device_orientation_request_granted')) {
            deviceOrientationParallax();
        }
    } else {
        sensorsChecker.checkDeviceorientation(
            function(){
                if (window.DeviceOrientationEvent) {
                    /**
                     * if the device HAS sensors and the browser supports DeviceOrientationEvent
                     * */

                    deviceOrientationParallax();
                } else if (!window.DeviceOrientationEvent) {
                    /**
                     * if the device HAS sensors but browser DOESN`T support DeviceOrientationEvent
                     * */

                    scrollParallax();
                } else {
                    /**
                     * Just for safe. If there are more variants.
                     * */

                    scrollParallax();
                }
            },
            function(){
                /**
                 * if the device DOESN`T have sensors
                 * */
                if (window.innerWidth <= 1024) {
                    // alert('no sensor detected, \nMOBILE or TAB without sensors');
                    scrollParallax();
                } else {
                    // alert('no sensor detected, \nDESKTOP');
                    desktopParallax();
                }
            }
        );
    }
}

document.addEventListener("DOMContentLoaded", function(){
    deviceOrientation();
    window.onresize = function(){
        deviceOrientation();
    }
});