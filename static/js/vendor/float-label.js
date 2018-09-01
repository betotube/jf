'use strict';

var fordFloatLabel = {
    run: function run(e) {
        var el = e.currentTarget,
            label = document.querySelector('[for=' + el.getAttribute('id') + ']');

        if (el.value.length) {
            label.classList.add('is-visible');
        } else {
            label.classList.remove('is-visible');
        }
    },

    bind: function bind(el) {
        el.addEventListener('keyup', fordFloatLabel.run);
    },

    bindAll: function bindAll(elements) {
        Array.from(elements).forEach(function (el) {
            return fordFloatLabel.bind(el);
        });
    }
};