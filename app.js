var width = 600;
var height = 600;
var padding = 30;
var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);

//Map colors to months of the year
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var colorScale = d3.scaleOrdinal()
                    .domain(months)
                    .range(d3.schemeCategory20);

var quarterColors = ['blue', 'green', 'red', 'yellow'];                    

//Outer Pie Chart
var svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);
svg
    .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .classed('chart', true);

//Inner Pie Chart        
svg
    .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .classed('inner-chart', true);

//Title
d3.select('svg')
    .append('text')
    .attr('x', width / 2)
    .attr('y', padding)
    .style('text-anchor', 'middle')
    .style('font-size', '2em')
    .classed('title', true);

d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => {
        makeGraph(+d3.event.target.value);
    });

makeGraph(minYear);

function makeGraph(minYear) {

    d3.select('.title')
        .text(`Births by month and quarter for ${minYear}`);

    var yearData = birthData.filter(d => d.year === minYear);

    // Returns an array that contains the slices of the pie chart (Determines size of slice)
    var arcs = d3.pie()
                .value(d => d.births)
                .sort( (a,b) => {
                    if(months.indexOf(a.month) < months.indexOf(b.month)) return -1;
                    else if(months.indexOf(a.month) > months.indexOf(b.month)) return 1;
                    else return months.indexOf(a.month) - months.indexOf(b.month);
                })
                (yearData);

    var innerArcs = d3.pie()
                    .value(d => d.births)
                    .sort((a,b) => a.quarter - b.quarter);
    
    // Translates the javascript objects to a string that can be passed to the d property of an SVG path
    var path = d3.arc()
                .outerRadius(width / 2 - 40)
                .innerRadius(width / 4)

    var innerPath = d3.arc()
                        .outerRadius(width / 4)
                        .innerRadius(0);

    var outer = d3.select('.chart')
                    .selectAll('.arc')
                    .data(arcs);

    outer
        .exit()
        .remove();
    
    outer
        .enter()
        .append('path')
            .classed('arc', true)
        .merge(outer)
            .attr('fill', d => colorScale(d.data.month))
            .attr('stroke', 'black')
            .attr('d', path);
    
    var inner = d3.select('.inner-chart')
                    .selectAll('.arc')
                    .data(innerArcs(getDataByQuarter(yearData)));
    
    inner
        .exit()
        .remove();
    
    inner
        .enter()
        .append('path')
            .classed('arc', true)
            .attr('fill', (d, i) => quarterColors[i])
        .merge(inner)
            .attr('d', innerPath);
}

function getDataByQuarter(data) {
    var quarterTallies = [0, 1, 2, 3].map( value => ({quater: value, births: 0}));
    for(var i =0; i < data.length; i++) {
        var row = data[i];
        var quarter = Math.floor(months.indexOf(row.month) / 3);
        quarterTallies[quarter].births += row.births;
    }
    return quarterTallies;
}