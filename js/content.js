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
        let phrase = $(row).find('td:nth-child(3) span').first().text().trim();
        let list   = $(row).find('td:nth-child(4) ul').first();

        if (list.children().length <= 3) {
            let linkClass = 'b-pseudo-link';
            let li        = $(`<li></li>`);
            let span      = $(`<span class="${linkClass}">собрать контакты</span>`);

            span.click(() => {
                if (span.hasClass(linkClass)) {
                    span.removeClass(linkClass);
                    collectContacts(phrase, () => {span.addClass(linkClass);});
                }
            });

            li.append(span);
            list.append(li);
        }
    });
}


function collectContacts(phrase, cb) {
    let geo = $('#geo').val();
    let geoNames = $('.b-region-selector__geo-text-fact').text().trim();
    let req = {
        phrase: phrase,
        geo: geo,
        geoNames: geoNames
    };

    $.ajax({
        url: `https://direct.yandex.ru/registered/main.pl?cmd=showCompetitors&phrase=${phrase}&geo=${geo}`,
        success: (data) => {
            parseAds(req, data, cb);
        }
    });
    console.log('Collect contants: phrase = ' + phrase + '; geo = ' + geo);
}


function parseAds(req, html, cb) {
    let result   = [];
    let spans    = $(html).find('.b-banner-preview__footer > span.link');
    let count    = spans.length;
    let onResult = () => {
        count = count - 1;
        if (count <= 0) {
            saveToFile(req, result);
            cb();
        }
    };

    spans.each((index, row) => {
        let bem = $(row).data('bem');
        let url = bem['b-modal-popup-opener']['url'];

        $.ajax({
           url: url,
           success: (data) => {
               result[index] = parseContacts(data);
               onResult();
           }
        });
    });
}


function parseContacts(html) {
    let name  = $(html).find('.p-view-vcard-headless__vcard-name').text().trim();
    let phone = $(html).find('.p-view-vcard-headless__phone .p-view-vcard-headless__info').text().trim();
    let site  = $(html).find('.b-banner-preview__domain').text().trim();

    return {
        name: name.replace(/"/g, "'"),
        phone: phone.replace(/\+/g, ''),
        site: site
    }
}


function saveToFile(req, data) {
    let csvHeader   = `"Поиск по фразе:";"${req.phrase}"\n"Регионы:";"${req.geoNames}"`;
    let columnNames = `"Название компании";"Телефон";"Сайт"`;

    let csv = data.reduce(
        (result, obj) => `${result}\n"${obj.name}";"${obj.site}";"${obj.phone}"`,
        `${csvHeader}\n\n${columnNames}`);

    let contentType = 'text/csv';
    let blob        = new Blob(['\ufeff' + csv], { type: contentType });
    let anchor      = document.createElement('a');

    anchor.download            = `${req.phrase}.csv`;
    anchor.href                = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [contentType, anchor.download, anchor.href].join(':');
    anchor.click();
}