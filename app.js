// chua@wharton.upenn.edu
// https://bitbucket.org/illmatic/ppi

//main line chart
var chart = c3.generate({
    bindto: '#chart',
    data: {
        url: 'data/test1.csv',
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
    var urlMap = ['data/test1.csv', 'data/test2.csv', 'data/test3.csv', 'data/test4.csv', 'data/test5.csv']
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

//abstracted bar
function generateBar(binding, path) {
    c3.generate({
        bindto: binding,
        data: {
            url: path,
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
}

//initialize bar
generateBar('#chart-cps05', 'data/cps05.csv')
generateBar('#chart-sim05', 'data/sim05.csv')

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

// END NYT JS
