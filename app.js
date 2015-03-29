'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

var composite = dc.compositeChart('#plain-chart');
var ndx, dim;

function load_button(file) {
    return function load_it() {
        d3.csv(file, function(error, exp) {
            ndx = crossfilter();
            ndx.add(exp.map(function(d) {
                return {
                    x: +d.x,
                    y1: +d.nonfam,
                    y2: +d.sing_hd,
                    y3: +d.dual_hd,
                    y4: +d.dual_sp,
                    y5: +d.kids_sing,
                    y6: +d.kids_dual,
                    y7: +d.total
                };;
            }));

            dim = ndx.dimension(dc.pluck('x'));

            var grp1 = dim.group().reduceSum(dc.pluck('y1')), // nonfam
                grp2 = dim.group().reduceSum(dc.pluck('y2')), // sing_hd
                grp3 = dim.group().reduceSum(dc.pluck('y3')), // dual_hd
                grp4 = dim.group().reduceSum(dc.pluck('y4')), // dual_sp
                grp5 = dim.group().reduceSum(dc.pluck('y5')), // kids_sing
                grp6 = dim.group().reduceSum(dc.pluck('y6')), // kids_dual
                grp7 = dim.group().reduceSum(dc.pluck('y7')); // total

            composite
                .width(768)
                .height(480)
                .x(d3.scale.linear().domain([0, 100]))
                .yAxisLabel("Y")
                .mouseZoomable(true)
                .elasticY(true)
                // .childOptions({
                //     defined: function(d) {
                //         return (!d.nonfam == null);
                //     }
                // })
                .legend(dc.legend().x(580).y(20).itemHeight(13).gap(5))
                .renderHorizontalGridLines(true)
                .compose([
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('red')
                    .group(grp1, "nonfam"),
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('blue')
                    .group(grp2, "sing_hd"),
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('green')
                    .group(grp3, "dual_hd"),
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('purple')
                    .group(grp4, "dual_sp"),
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('gray')
                    .group(grp5, "kids_sing"),
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('orange')
                    .group(grp6, "kids_dual"),
                    dc.lineChart(composite)
                    .dimension(dim)
                    .colors('brown')
                    .group(grp7, "total")
                ])
                .brushOn(false)
                .render();

            dc.renderAll();
        });
    };
}

var button1 = load_button("test1.csv"),
    button2 = load_button("test2.csv");
