'use strict';

var cubeTemplate = '\n<vz-cube id="cube">\n    <vz-cubepivot>\n        <vz-cubeface data-face="top" style="background-image: url(static/images/cube/top.jpg)"></vz-cubeface>\n        <vz-cubeface data-face="bottom" style="background-image: url(static/images/cube/bottom.jpg)"></vz-cubeface>\n        <vz-cubeface data-face="front" style="background-image: url(static/images/cube/front.jpg)"></vz-cubeface>\n        <vz-cubeface data-face="back" style="background-image: url(static/images/cube/back.jpg)"></vz-cubeface>\n        <vz-cubeface data-face="left" style="background-image: url(static/images/cube/left.jpg)"></vz-cubeface>\n        <vz-cubeface data-face="right" style="background-image: url(static/images/cube/right.jpg)"></vz-cubeface>\n\n        <vz-cube-feature name="sync" data-ga="Sync 3" title="SYNC&reg; 3 com tela de 8&quot;" yaw="-1.5" pitch="15">\n            O novo SYNC\xAE 3 vem com tela touch screen de 8 polegadas, f\xE1cil de usar, assim como seu smartphone.\n            Al\xE9m disso, ele tamb\xE9m \xE9 compat\xEDvel com Apple Carplay e Android Auto.\n        </vz-cube-feature>\n        <vz-cube-feature name="panel" data-ga="Novo painel" title="Novo painel com soft touch (toque macio)" yaw="-22" pitch="8">\n            O novo painel Soft Touch do Novo EcoSport traz a agrad\xE1vel sensa\xE7\xE3o de um interior sofisticado,\n            com qualidade de acabamento presente apenas em ve\xEDculos de categoria  superior.\n        </vz-cube-feature>' +
/*<vz-cube-feature name="transmission" title="Nova transmissão automática de 6 velocidades" yaw="-1" pitch="29">
    A nova transmissão automática de 6 velocidades faz do Novo EcoSport um carro com mais conforto.
    Além disso, as trocas manuais no volante pelo paddle shift imprimem esportividade e melhor performance.
</vz-cube-feature>*/
'<vz-cube-feature name="skywindow" data-ga="Teto solar el\xE9trico" title="Teto solar el\xE9trico" yaw="0" pitch="-60">\n            Com o teto solar do Novo Ecosport voc\xEA pode aproveitar para explorar novas paisagens de um \xE2ngulo diferente.\n        </vz-cube-feature>\n        <vz-cube-feature name="cargo" data-ga="Assoalho inteligente" title="Assoalho inteligente do porta-\xADmalas" yaw="180" pitch="15">\n            Este recurso permite que voc\xEA aproveite melhor o espa\xE7o no porta-\xADmalas. Para isso, basta rebater os bancos\n            traseiros e ajustar o assoalho inteligente do porta-\xAD\u2010malas para ter uma condi\xE7\xE3o de piso plano e acomodar tudo o que voc\xEA precisa sem aperto.\n        </vz-cube-feature>\n    </vz-cubepivot>\n</vz-cube>';

var cubeIe10Template = '\n<div data-cube id="cube" data-fov="40">\n\n    <div data-face="top" style="background-image: url(static/images/cube/top.jpg);"></div>\n    <div data-face="left" style="background-image: url(static/images/cube/left.jpg);"></div>\n    <div data-face="front" style="background-image: url(static/images/cube/front.jpg);"></div>\n    <div data-face="right" style="background-image: url(static/images/cube/right.jpg);"></div>\n    <div data-face="back" style="background-image: url(static/images/cube/back.jpg);"></div>\n    <div data-face="bottom" style="background-image: url(static/images/cube/bottom.jpg);"></div>\n    <div data-fakepivot></div>\n\n    <a data-feature data-name="sync" data-ga="Sync 3" title="SYNC\xAE 3 com tela de 8\u201D" data-yaw="1.5" data-pitch="-15">\n        O novo SYNC\xAE 3 vem com tela touch screen de 8 polegadas, f\xE1cil de usar, assim como seu smartphone.\n        Al\xE9m disso, ele tamb\xE9m \xE9 compat\xEDvel com Apple Carplay e Android Auto.\n    </a>\n    <a data-feature data-name="panel" data-ga="Novo painel" title="Painel com Soft Touch" data-yaw="22" data-pitch="-8">\n        O novo painel Soft Touch do Novo EcoSport traz a agrad\xE1vel sensa\xE7\xE3o de um interior sofisticado,\n        com qualidade de acabamento presente apenas em ve\xEDculos de categoria  superior.\n    </a>' +
/*<a data-feature data-name="transmission" title="Transmissão automática" data-yaw="1" data-pitch="-29">
    A nova transmissão automática de 6 velocidades faz do Novo EcoSport um carro com mais conforto.
    Além disso, as trocas manuais no volante pelo paddle shift imprimem esportividade e melhor performance.
</a>*/
'<a data-feature data-name="skywindow" data-ga="Teto solar el\xE9trico" title="Teto solar" data-yaw="0" data-pitch="60">\n        Com o teto solar do Novo Ecosport voc\xEA pode aproveitar para explorar novas paisagens de um \xE2ngulo diferente.\n    </a>\n    <a data-feature data-name="cargo" data-ga="Assoalho inteligente" title="Assoalho inteligente do porta-\xADmalas" data-yaw="180" data-pitch="15">\n        Este recurso permite que voc\xEA aproveite melhor o espa\xE7o no porta-\xADmalas. Para isso, basta rebater os bancos\n        traseiros e ajustar o assoalho inteligente do porta-\xAD\u2010malas para ter uma condi\xE7\xE3o de piso plano e acomodar tudo o que voc\xEA precisa sem aperto.\n    </a>\n</div>';

var _container = document.querySelector('.content__360__interior');
var _body = document.querySelector('body');
var _script = document.createElement('script');

if (typeof CSS !== 'undefined' && CSS.supports('transform-style', 'preserve-3d') && !/Edge\/\d./i.test(navigator.userAgent)) {
    _script.setAttribute('src', 'static/js/vz-cube.js');
    _container.innerHTML = cubeTemplate + _container.innerHTML;
} else {
    _script.setAttribute('src', 'static/js/vendor/cube.js');
    _container.innerHTML = cubeIe10Template + _container.innerHTML;

    cube.isIE10 = true;
    _body.classList.add('isIE');
}

_body.appendChild(_script);

// new Event polyfill
function newEvent(eventName) {
    if (typeof Event === 'function') {
        var event = new Event(eventName);
    } else {
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
    }

    return event;
}

document.dispatchEvent(newEvent('cube-loaded'));