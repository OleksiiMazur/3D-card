"use strict";

if ( location.protocol !== "https:" ) {
    location.href = "https:" + window.location.href.substring( window.location.protocol.length );
}

let deviceOrientation = function () {
    let $card = document.querySelector('.card');
    let $body = document.querySelector('body');

    if($card && window.innerWidth <= 1024 && window.DeviceOrientationEvent) {
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

        if( !getCookie('device_orientation_request_granted') ){
            sendRequest();
        } else if (getCookie('device_orientation_request_granted')) {
            deviceOrientationParallax();
        } else if (getCookie('device_orientation_request_refused')) {

        }

        function sendRequest(){ //send request for using DeviceOrientationEvent ==> start deviceOrientationParallax if grated or don`t need
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                $body.addEventListener('click', function () { // feature detect
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                setCookie('device_orientation_request_granted', 'granted', {
                                    secure: false,
                                    'samesite': 'lax',
                                    'max-age': 1000000,
                                });

                                deviceOrientationParallax();
                            } else {
                                setCookie('device_orientation_request_refused', 'refused', {
                                    secure: false,
                                    'samesite': 'lax',
                                    'max-age': 40000,
                                });
                            }
                        })
                        .catch(console.error);
                });
            } else {
                deviceOrientationParallax();
            }
        }
    } else if ($card && window.innerWidth > 1024 && window.DeviceOrientationEvent) {
        desktopParallax();
    } else {
        scrollParallax();
    }

    function desktopParallax() {
        document.addEventListener('mousemove', function (e) {
            let windWidth= window.innerWidth;
            let windHeight= window.innerHeight;
            let parallaxY = -(windWidth / 2 - e.pageX) / 20;
            let parallaxX = (windHeight - e.pageY) / 15;

            $card.style.transform = 'rotateX(' + (parallaxX) + 'deg) rotateY(' + (parallaxY) + 'deg)';
        });
    }

    function deviceOrientationParallax() {
        window.addEventListener('deviceorientation', function(event){
            let bottomTop;
            let leftRight;
            let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;

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
            } else if (orientation === undefined) {
            }

            $card.style.transform = 'rotateX(' + (bottomTop - 25) + 'deg) rotateY(' + leftRight + 'deg)';

            document.querySelector('.card__info')
                .textContent  = 'bottomTop: ' + event.beta + 'deg' + '\nleftRight' + event.gamma + 'deg';
        }, false);
    }

    function scrollParallax() {
        console.log('scrollParallax');
    }
};

document.addEventListener("DOMContentLoaded", function(){
    deviceOrientation();
    window.onresize = deviceOrientation;
});