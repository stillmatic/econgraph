var chart = c3.generate({
    bindto: '#chart',
    data: {
        url: 'test1.csv',
        x: 'x',
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

var chart2 = c3.generate({
    bindto: '#chart-cps05',
    data: {
        url: 'cps05.csv',
        x: 'Age',
        type: 'bar',
        groups: [
            ['Not In Labor Force', 'Full Time', 'Part Time']
        ]
    },
    axis: {
        x: {
            type: 'category',
            label: {
                text: 'Age',
                position: 'outer-center'
            }
        }
    }
});


var chart2 = c3.generate({
    bindto: '#chart-sim05',
    data: {
        url: 'sim05.csv',
        x: 'Age',
        type: 'bar',
        groups: [
            ['Not In Labor Force', 'Full Time', 'Part Time']
        ]
    },
    axis: {
        x: {
            type: 'category',
            label: {
                text: 'Age',
                position: 'outer-center'
            }
        }
    }
});
