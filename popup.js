let regionMenu = $('.dropdown-menu');
regionMenu.empty();

$('#download').click(() => {
    console.log('click download')
    $.ajax({
        url: 'https://direct.yandex.ru/registered/main.pl?cmd=showCompetitors&phrase=остекление балконов&geo=0',
        success: (data) => {
            console.log(data);
        }
    });
});