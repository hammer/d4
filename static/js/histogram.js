d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  var data = csv.filter(function(el) { return el.state_location == "CA"; })
                .map(function(el) { return parseInt(el.revenues) });

  var histogram = d3.layout.histogram().bins(30)(data);

  var width = 275,
      height = 225;
 
  var x = d3.scale.ordinal()
                  .domain(histogram.map(function(d) { return d.x; }))
                  .rangeRoundBands([0, width]);
 
  var y = d3.scale.linear()
                  .domain([0, d3.max(histogram.map(function(d) { return d.y; }))])
                  .range([0, height]);
 
  var svg = d3.select("div#histogram")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
 
  svg.selectAll("rect")
     .data(histogram)
     .enter()
     .append("rect")
     .attr("width", x.rangeBand())
     .attr("x", function(d) { return x(d.x); })
     .attr("y", function(d) { return height - y(d.y); })
     .attr("height", function(d) { return y(d.y); });
 
  svg.append("line")
     .attr("x1", 0)
     .attr("x2", width)
     .attr("y1", height)
     .attr("y2", height);
});