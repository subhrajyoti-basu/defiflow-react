import * as d3 from 'd3'
import _ from 'lodash'

function nodeName(a, b) {

    var links = [];
    var nodes = []
    var LS = []

    const width = 975
    const height = 800
    a.reverse()
    a.map(d => {
        if (d.to === 'WETH') {
            links.push({ source: d.from, target: d.to, column: 0, value: d.volume })
        } else if (d.from === 'WETH') {
            links.push({ source: d.from, target: d.to, column: 3, value: d.volume })
        } else if (d.to === 'USDC') {
            links.push({ source: d.from, target: d.to, column: 0, value: d.volume })
        } else if (d.from === 'USDC') {
            links.push({ source: d.from, target: d.to, column: 3, value: d.volume })
        }
    })
    links.map((d, i) => {
        if (d.column === 0) {
            LS.push(d.source + '-/~/left')
            d.source = d.source + '-/~/left'
            LS.push(d.target + '-/~/center')
            d.target = d.target + '-/~/center'
        }

        if (d.column === 3) {
            LS.push(d.source + '-/~/center')
            d.source = d.source + '-/~/center'
        } if (d.column === 3) {
            LS.push(d.target + '-/~/right')
            d.target = d.target + '-/~/right'
        }
    })

    LS = Array.from(new Set(LS))

    LS.map(d => {
        nodes.push({ name: d })
    })

    nodes.map(d => {
        d.targetLink = links.filter(o => { return o.source === d.name })
        d.sourceLink = links.filter(o => { return o.target === d.name })
    })
    nodes.map(d => {
        d.value = d3.max([_.sumBy(d.sourceLink, o => o.value), _.sumBy(d.targetLink, o => o.value)])
        d.column = d.name.split('-/~/')[1]
        d.ticker = d.name.split('-/~/')[0]
    })
    links.map(d => {
        d.sourceTicker = d.source.split('-/~/')[0]
        d.targetTicker = d.target.split('-/~/')[0]
    })

    function getRandomColor() {
        var letters = '012345F7FFABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function computeDomain() {
        var col1 = nodes.filter(d => { return d.column === 'left' })
        var col2 = nodes.filter(d => { return d.column === 'center' })
        var col3 = nodes.filter(d => { return d.column === 'right' })
        var total = [_.sumBy(col1, o => o.value), _.sumBy(col2, o => o.value), _.sumBy(col3, o => o.value)]
        // console.log(total)
        return d3.max(total)
    }

    // console.log(computeDomain())


    const yScale = d3.scaleLinear()
        .domain([0, computeDomain()])
        .range([0, height]);


    var y = 5
    var x = 5
    var z = 5
    const padding = 10
    nodes.map(d => {
        if (d.column === 'left') {
            d.x0 = 0
            d.x1 = 0 + 30
            d.y0 = x
            d.y1 = x + yScale(d.value)
            x = d.y1 + padding
        }
        else if (d.column === 'center') {
            d.x0 = width / 2
            d.x1 = d.x0 + 30
            d.y0 = y
            d.y1 = y + yScale(d.value)
            y = d.y1 + padding
        } else {
            d.x0 = width - 30
            d.x1 = width
            d.y0 = z
            d.y1 = z + yScale(d.value)
            z = d.y1 + padding
        }

    })

    nodes.map(d => {
        var color = getRandomColor()
        d.color = color
        if (d.targetLink.length > 1) {
            var l = 0
            d.targetLink.map(o => {
                o.source = [d.x0 + 30, d.y0 + yScale(o.value) / 2 + l]
                l = yScale(o.value) + l
                o.color = color
            })
        } else {

            d.targetLink.map(o => {
                o.source = [d.x0 + 30, d.y0 + yScale(d.value) / 2]
                o.color = color
            })
        }
        if (d.sourceLink.length > 1) {
            var j = 0
            d.sourceLink.map(o => {
                o.target = [d.x0, d.y0 + yScale(o.value) / 2 + j]
                j = yScale(o.value) + j


            })
        } else {
            d.sourceLink.map(o => {
                o.target = [d.x0, d.y0 + yScale(d.value) / 2]
            })
        }
    })

    // links.map(d => {
    //     d.color = getRandomColor()
    // })

    console.log(nodes, links)
    const svg = d3.select(b).append('svg').attr('width', width).attr('height', '900').attr('class', 'mx-auto')



    svg.append("g")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr('d', d3.linkHorizontal())
        .attr('stroke-width', d => yScale(d.value))
        .attr("fill", "none")
        .attr("stroke", d => d.color)
        .style("stroke-opacity", .5)
        .append("title")
        .text(d => `${d.sourceTicker} -> ${d.targetTicker}`);
    svg.append("g")
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('fill', d => d.color)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .append("title")
        .text(d => `${d.ticker}\n${d.value.toLocaleString()}`);
    svg.append("g")
        .style("font", "10px sans-serif")
        .style("fill", "white")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.ticker)
        .append("tspan")
        .attr("fill-opacity", 1)
        .text(d => ` ${d.value.toLocaleString()}`);

}

export default nodeName;
