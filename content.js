console.log('Yandex Direct Plugin: start');

if (jQuery) {
    console.log('Yandex Direct Plugin: jQuery no conflict');
    jQuery.noConflict();
}

jQuery(document).ready(() => {
    jQuery('.b-advanced-forecast__result-table__table').on('DOMSubtreeModified', function() {
        updateControls();
    });
    jQuery(document).on('click', '.js-collect-contacts', () => {
        let geo    = jQuery('#geo').val();
        let phrase = jQuery(this).attr('title');

        collectContacts(phrase, geo);
    });

    updateControls();
});


function updateControls() {
    console.log('Yandex Direct Plugin: updateControls');

    jQuery('tr.js-phrase-row-template').each((index, row) => {
        let phrase = jQuery(row).find('td:nth-child(3) span').first().text();
        let list   = jQuery(row).find('td:nth-child(4) ul').first();

        if (list.children().length <= 3) {
            console.log('Yandex Direct Plugin: link added');
            list.append(`<li><span class="js-collect-contacts b-pseudo-link" title="${phrase}">собрать контакты</span></li>`);
        }
    });
}


function collectContacts(phrase, geo) {
    console.log('Collect contants using phrase: '+ phrase);

    //ajax get html
}