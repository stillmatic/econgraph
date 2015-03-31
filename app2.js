var chart = c3.generate({
    bindto: '#chart',
    data: {
        url: 'test1.csv',
        hide: 'x',
        type: 'line'
    }
});

function bar() {
    chart.transform('bar');
}

function spline() {
    chart.transform('spline');
}

function line() {
    chart.transform('line');
}

function scatter() {
    chart.transform('scatter');
}

$(function() {
    var valMap = [70, 75, 80, 85, 90];
    var urlMap = ['test1.csv', 'test2.csv', 'test3.csv', 'test4.csv', 'test5.csv']
    $("#slider-range").slider({
        min: 0,
        max: valMap.length - 1,
        value: 0,
        slide: function(event, ui) {
            $("#amount").val('P' + valMap[ui.value]);
            chart.load({
                url: urlMap[ui.value],
                hide: 'x'
            })
        }
    });
});
