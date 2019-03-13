console.log('Yandex Direct Plugin: start');
initListeners();


function initListeners() {
    console.log('Yandex Direct Plugin: init listeners');

    let table = $('.b-advanced-forecast__result-table__table');
    table.on('DOMSubtreeModified', function() {
        updateControls();
    });
}


function updateControls() {
    console.log('Yandex Direct Plugin: update controls');

    $('tr.js-phrase-row-template').each((index, row) => {
        let phrase = $(row).find('td:nth-child(3) span').first().text();
        let list   = $(row).find('td:nth-child(4) ul').first();

        if (list.children().length <= 3) {
            let linkClass = 'b-pseudo-link';
            let li        = $(`<li></li>`);
            let span      = $(`<span class="${linkClass}">собрать контакты</span>`);

            span.click(() => {
                if (span.hasClass(linkClass)) {
                    let geo = $('#geo').val();
                    span.removeClass(linkClass);

                    collectContacts(phrase, geo, () => {
                        span.addClass(linkClass);
                    });
                }
            });

            li.append(span);
            list.append(li);
        }
    });
}


function collectContacts(phrase, geo, cb) {
    console.log('Collect contants: phrase = ' + phrase + '; geo = ' + geo);

    $.ajax({
        url: `https://direct.yandex.ru/registered/main.pl?cmd=showCompetitors&phrase=${phrase}&geo=${geo}`,
        success: (data) => {
            parseAds(data, cb);
        }
    });
}


function parseAds(html, cb) {
    let result = [];
    let spans = $(html).find('.b-banner-preview__footer > span.link');
    let count = spans.length;

    spans.each((index, row) => {
        let bem = $(row).data('bem');
        let url = bem['b-modal-popup-opener']['url'];

        $.ajax({
           url: url,
           success: (data) => {
               result[index] = parseContacts(data);
               count = count - 1;
               if (count <= 0) {
                   saveToFile(result);
                   cb();
               }
           }
        });
    });
}


function parseContacts(html) {
    let name  = $(html).find('.p-view-vcard-headless__vcard-name').text();
    let phone = $(html).find('.p-view-vcard-headless__phone .p-view-vcard-headless__info').text();
    let site  = $(html).find('.b-banner-preview__domain').text();

    return {
        name: name,
        phone: phone,
        site: site
    }
}


function saveToFile(data) {
    console.log(data);

}