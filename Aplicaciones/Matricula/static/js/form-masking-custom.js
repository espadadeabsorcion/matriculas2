// 'use strict';
// (function () {
// var regExpMask = IMask(document.querySelector('.date'), { mask: '00/00/0000' });

// var regExpMask = IMask(document.querySelector('.date2'), { mask: '00-00-0000' });

// var regExpMask = IMask(document.querySelector('.hour'), { mask: '00:00:00' });

// var regExpMask = IMask(document.querySelector('.dateHour'), { mask: '00/00/0000 00:00:00' });

// var regExpMask = IMask(document.querySelector('.mob_no'), { mask: '0000-000-000' });

// var regExpMask = IMask(document.querySelector('.phone'), { mask: '0000-0000' });

// var regExpMask = IMask(document.querySelector('.telphone_with_code'), { mask: '(00) 0000-0000' });

// var regExpMask = IMask(document.querySelector('.us_telephone'), { mask: '(000) 000-0000' });

// var regExpMask = IMask(document.querySelector('.ip'), { mask: '000.000.000.000' });

// var regExpMask = IMask(document.querySelector('.ipv4'), { mask: '000.000.000.0000' });

// var regExpMask = IMask(document.querySelector('.ipv6'), { mask: '0000:0000:0000:0:000:0000:0000:0000' });

// })();

'use strict';

function aplicarMascaras() {
    const masks = [
        { selector: '.date', mask: '00/00/0000' },
        { selector: '.date2', mask: '00-00-0000' },
        { selector: '.hour', mask: '00:00:00' },
        { selector: '.dateHour', mask: '00/00/0000 00:00:00' },
        { selector: '.mob_no', mask: '0000-000-000' },
        { selector: '.edad_an', mask: '00' }, // edad en dos digitos
        { selector: '.ced_no', mask: '0000000000' }, // cedula
        { selector: '.phone', mask: '0000-0000' },
        { selector: '.telphone_with_code', mask: '(00) 0000-0000' },
        { selector: '.us_telephone', mask: '(000) 000-0000' },
        { selector: '.ip', mask: '000.000.000.000' },
        { selector: '.ipv4', mask: '000.000.000.0000' },
        { selector: '.ipv6', mask: '0000:0000:0000:0:000:0000:0000:0000' }
    ];

    masks.forEach(item => {
        document.querySelectorAll(item.selector).forEach(el => {
            // Evitar aplicar doble máscara
            if (!el.dataset.maskApplied) {
                IMask(el, { mask: item.mask });
                el.dataset.maskApplied = 'true';
            }
        });
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', aplicarMascaras);
