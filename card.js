let deviceOrientation = function () {
    let $card = document.querySelector('.card');
    let $body = document.querySelector('body');
    $body.style.background = 'red';

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

    if($card && window.innerWidth <= 1024 && window.DeviceOrientationEvent) {
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
                                    secure: true,
                                    'samesite': 'lax',
                                    'max-age': 1000000,
                                });

                                deviceOrientationParallax();
                            } else {
                                setCookie('device_orientation_request_refused', 'refused', {
                                    secure: true,
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
    }

    function deviceOrientationParallax() {
        window.addEventListener('deviceorientation', function(event){
            let xDevicePos = event.beta / 1.5;
            let yDevicePos = event.gamma / 3;
            // xDevicePos = xDevicePos;
            yDevicePos = -yDevicePos;

            $card.style.transform = 'rotateX(' + (xDevicePos - 30) + 'deg) rotateY(' + yDevicePos + 'deg)';
        }, true);
    }
};

document.addEventListener("DOMContentLoaded", function(){
    deviceOrientation();
});