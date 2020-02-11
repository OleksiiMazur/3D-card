"use strict";

if ( location.protocol !== "https:" ) {
    location.href = "https:" + window.location.href.substring( window.location.protocol.length );
}

function deviceOrientation(){
    let $card = document.querySelector('.card');
    let $body = document.querySelector('body');

    function desktopParallax() {
        document.addEventListener('mousemove', function (e) {
            let leftRight  = -(window.innerWidth / 2 - e.pageX) / 35;
            let bottomTop  = (window.innerHeight / 2 - e.pageY + pageYOffset + $card.offsetHeight) / 20;

            console.log('bottomTop: ' + bottomTop);
            console.log('pageYOffset: ' + pageYOffset);

            $card.style.transform = 'rotateX(' + (bottomTop) + 'deg) rotateY(' + (leftRight) + 'deg)';
            // document.querySelector('.card__info').textContent  = 'bottomTop:\ ' + bottomTop + 'deg' + '\n leftRight:\ ' + leftRight + 'deg';
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

        window.addEventListener('scroll', function() {
            let windowTopScroll = pageYOffset;
            let windowHeight = window.innerHeight;
            let cardTop = $card.offsetTop;
            let cardHeight = $card.offsetHeight;

            if(windowTopScroll < (cardTop + windowHeight) && windowTopScroll > (cardTop - windowHeight)) {
                console.log('that`s it');
            } else {
                console.log('not yet');
            }
        });
    }

    sensorsChecker.checkDeviceorientation(
        function(){ // check if the device has sensors
            if (window.DeviceOrientationEvent) { // and check if the browser supports DeviceOrientationEvent
                alert('Sensor detected, \nbrowser supports \nDeviceOrientationEvent');
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

                function sendRequest(){ //send request for using DeviceOrientationEvent ==> start deviceOrientationParallax if grated or don`t need
                    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
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
                    } else {
                        deviceOrientationParallax();
                    }
                }

                if( !getCookie('device_orientation_request_granted') ){
                    sendRequest();
                } else if (getCookie('device_orientation_request_granted')) {
                    deviceOrientationParallax();
                }
            } else if (!window.DeviceOrientationEvent) {
                alert('Sensor detected, \nbut the browser doesn`t support \nDeviceOrientationEvent');
                scrollParallax();
            } else {
                scrollParallax();
            }
        },
        function(){
            if (window.innerWidth <= 1024) {
                alert('no sensor detected, \nMOBILE or TAB without sensors');
                scrollParallax();
            } else {
                alert('no sensor detected, \nDESKTOP');
                desktopParallax();
                // scrollParallax();
            }
        }
    );
};

document.addEventListener("DOMContentLoaded", function(){
    deviceOrientation();
    window.onresize = function(){
        deviceOrientation();
    }
});