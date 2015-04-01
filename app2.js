// chua@wharton.upenn.edu
// https://bitbucket.org/illmatic/ppi

//main line chart
var chart = c3.generate({
    bindto: '#chart',
    data: {
        url: 'test1.csv',
        x: 'x',
        type: 'line'
    },
    line: {
        connect: {
            null: false
        }
    },
    point: {
        show: false
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

//slider
$(function() {
    var valMap = [70, 75, 80, 85, 90];
    var urlMap = ['test1.csv', 'test2.csv', 'test3.csv', 'test4.csv', 'test5.csv']
    $("#slider-range").slider({
        min: 0,
        max: valMap.length - 1,
        value: 0,
        slide: function(event, ui) {
            $("#amount").val('Dataset: Pers' + valMap[ui.value]);
            chart.load({
                url: urlMap[ui.value]
            });
        }
    });
});

//cps 05 demo - stacked bar
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

//simulated 05 demo - stacked bar
var chart3 = c3.generate({
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

// Export to PNG - low quality but works
function saveImage(name) {
    d3.selectAll("svg text").style({
        'font-style': '10px'
    });

    d3.selectAll(".c3 svg").style({
        'font': '10px sans-serif'
    });

    d3.selectAll(".c3 path, .c3 line").style({
        'fill': 'none',
        'stroke': '# 000'
    });

    d3.selectAll(".c3-legend-item-tile, .c3-xgrid-focus, .c3-ygrid, .c3-event-rect, .c3-bars path").style({
        'shape-rendering': 'crispEdges'
    });

    d3.selectAll(".c3-text.c3-empty").style({
        'fill': '#808080',
        'font-size': '2em'
    });

    d3.selectAll(".c3-line").style({
        'stroke-width': '1px'
    });

    d3.selectAll(".c3-circle._expanded_").style({
        'stroke-width': '1px',
        'stroke': 'white'
    });

    d3.selectAll(".c3-selected-circle").style({
        'stroke-width': '2px',
        'fill': 'white'
    });

    d3.selectAll(".c3-chart-arc path").style({
        'stroke': '#FFFFFF'
    });
    d3.selectAll(".c3-chart-arc text").style({
        'font-size': '13 px',
        'fill': '#FFFFFF'
    });

    d3.selectAll(".c3-grid line").style({
        'stroke': '#aaa'
    });

    d3.selectAll(".c3-grid text").style({
        'fill': '#aaa'
    });

    d3.selectAll(".c3-xgrid, .c3-ygrid").style({
        'stroke-dasharray': '3 3'
    });

    d3.selectAll(".c3-region").style({
        'fill': 'steelblue',
        'fill-opacity': '.1'
    });

    d3.selectAll(".c3-area").style({
        'opacity': '.2',
        'stroke-width': '0'
    });

    d3.selectAll(".c3-axis path").style({
        'fill': 'none',
        'stroke': '# 000 '
    });

    html2canvas(document.getElementById(name), {
        onrendered: function(canvas) {
            var a = document.createElement("a");
            a.download = name + "_chart.png";
            a.href = canvas.toDataURL("image/png");
            console.log("Saving image of " + name);
            a.click();
        }
    });
}

function submit_download_form(output_format) {
    // Get the d3js SVG element
    var tmp = document.getElementById("chart");
    var svg = tmp.getElementsByTagName("svg")[0];
    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

    // Submit the <FORM> to the server.
    // The result will be an attachment file to download.
    var form = document.getElementById("svgform");
    form['output_format'].value = output_format;
    form['data'].value = svg_xml;
    form.submit();
}

function saveSVG() {
    submit_download_form("svg");
}

function savePNG() {
    submit_download_form("png");
}

var prefix = {
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    svg: "http://www.w3.org/2000/svg"
};


/* following from https://github.com/NYTimes/svg-crowbar
Copyright (c) 2013 The New York Times

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
var body = document.body,
    emptySvg;

function nyt(val) {
    var objects = document.querySelectorAll("object"),
        documents = [window.document],
        SVGSources = [];
    var emptySvg = window.document.createElementNS(prefix.svg, 'svg');
    window.document.body.appendChild(emptySvg);
    var emptySvgDeclarationComputed = getComputedStyle(emptySvg);

    [].forEach.call(objects, function(el) {
        try {
            if (el.contentDocument) {
                documents.push(el.contentDocument);
            }
        } catch (err) {
            console.log(err)
        }
    });
    documents.forEach(function(doc) {
        var newSources = getSources(doc, emptySvgDeclarationComputed);
        // because of prototype on NYT pages
        for (var i = 0; i < newSources.length; i++) {
            SVGSources.push(newSources[i]);
        }
    });
    if (SVGSources.length > 0) {
        download(SVGSources[val]); //abstract this out
    } else {
        alert("The Crowbar couldn’t find any SVG nodes.");
    }

}

function getSources(doc, emptySvgDeclarationComputed) {
    var svgInfo = [],
        svgs = doc.querySelectorAll("svg");

    [].forEach.call(svgs, function(svg) {

        svg.setAttribute("version", "1.1");

        // removing attributes so they aren't doubled up
        svg.removeAttribute("xmlns");
        svg.removeAttribute("xlink");

        // These are needed for the svg
        if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
            svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
        }

        if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
            svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
        }

        setInlineStyles(svg, emptySvgDeclarationComputed);

        var source = (new XMLSerializer()).serializeToString(svg);
        var rect = svg.getBoundingClientRect();
        svgInfo.push({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            class: svg.getAttribute("class"),
            id: svg.getAttribute("id"),
            childElementCount: svg.childElementCount,
            source: [doctype + source]
        });
    });
    return svgInfo;
}

function download(source) {
    var filename = "untitled";

    if (source.id) {
        filename = source.id;
    } else if (source.class) {
        filename = source.class;
    } else if (window.document.title) {
        filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    var url = window.URL.createObjectURL(new Blob(source.source, {
        "type": "text\/xml"
    }));

    var a = document.createElement("a");
    body.appendChild(a);
    a.setAttribute("class", "svg-crowbar");
    a.setAttribute("download", filename + ".svg");
    a.setAttribute("href", url);
    a.style["display"] = "none";
    a.click();

    setTimeout(function() {
        window.URL.revokeObjectURL(url);
    }, 10);
}

function setInlineStyles(svg, emptySvgDeclarationComputed) {

    function explicitlySetStyle(element) {
        var cSSStyleDeclarationComputed = getComputedStyle(element);
        var i, len, key, value;
        var computedStyleStr = "";
        for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
            key = cSSStyleDeclarationComputed[i];
            value = cSSStyleDeclarationComputed.getPropertyValue(key);
            if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
                computedStyleStr += key + ":" + value + ";";
            }
        }
        element.setAttribute('style', computedStyleStr);
    }

    function traverse(obj) {
            var tree = [];
            tree.push(obj);
            visit(obj);

            function visit(node) {
                if (node && node.hasChildNodes()) {
                    var child = node.firstChild;
                    while (child) {
                        if (child.nodeType === 1 && child.nodeName != 'SCRIPT') {
                            tree.push(child);
                            visit(child);
                        }
                        child = child.nextSibling;
                    }
                }
            }
            return tree;
        }
        // hardcode computed css styles inside svg
    var allElements = traverse(svg);
    var i = allElements.length;
    while (i--) {
        explicitlySetStyle(allElements[i]);
    }
}
