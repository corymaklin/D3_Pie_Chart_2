var width = 600;
var height = 600;
var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.min(birthData, d => d.year);

//Map colors to months of the year
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var colorScale = d3.scaleOrdinal()
                    .domain(months)
                    .range(d3.schemeCategory20);

//Center Pie Chart
d3.select('svg')
        .attr('width', width)
        .attr('height', height)
    .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .classed('chart', true);

makeGraph(minYear);

function makeGraph(minYear) {
    var yearData = birthData.filter(d => d.year === minYear);

    console.log(yearData)

    // Returns an array that contains the slices of the pie chart (Determines size of slice)
    var arcs = d3.pie()
                .value(d => d.births)
                (yearData);
    
    // Translates the javascript objects to a string that can be passed to the d property of an SVG path
    var path = d3.arc()
                .outerRadius(width / 2 - 10)
                .innerRadius(width / 4)

    var update = d3.select('.chart')
                    .selectAll('.arc')
                    .data(arcs);

    update
        .exit()
        .remove();
    
    update
        .enter()
        .append('path')
            .classed('arc', true)
        .merge(update)
            .attr('fill', d => colorScale(d.data.month))
            .attr('stroke', 'black')
            .attr('d', path);
}