(function () {
    'use strict';

    var advertisement = document.querySelector('.advertisement');

    if (advertisement) {
        [getTeapotAds].forEach(function (adsMethod) {
            var element = document.createElement('div');
            element.className = 'advertisement__element';
            element.appendChild(adsMethod());

            advertisement.appendChild(element);
        })
    }

    function getTeapotAds() {
        var img = document.createElement('img');
        img.src = '/ads/teapot.png';
        img.style.width = '100%';

        var a = document.createElement('a');
        a.href = 'http://www.amazon.com/b?node=367229011';
        a.style.textDecoration = 'none';
        a.appendChild(img);

        return a;
    }
})();