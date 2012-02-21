d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  var data = csv.filter(function(el) { return el.state_location == "CA"; })
                .map(function(el) { return parseInt(el.revenues) });

  var histogram = d3.layout.histogram().bins(30)(data);

  var p = 20,
      w = 275 - 2 * p;
      h = 225 - 2 * p;
 
  var x = d3.scale.linear()
                  .domain([0, d3.max(data)])
                  .range([0, w]);
 
  var y = d3.scale.linear()
                  .domain([0, d3.max(histogram.map(function(d) { return d.y; }))])
                  .range([0, h]);
 
  var vis = d3.select("div#histogram")
              .append("svg")
              .attr("width", w + 2 * p)
              .attr("height", h + 2 * p)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");        

  // histogram bars 
  vis.selectAll("rect")
     .data(histogram)
     .enter()
     .append("rect")
     .attr("x", function(d) { return x(d.x); })
     .attr("y", function(d) { return h - y(d.y); })
     .attr("width", function(d) { return x(d.dx); })
     .attr("height", function(d) { return y(d.y); });
 
  // x axis
  var xrule = vis.selectAll("div#histogram g.x")
                 .data(x.ticks(5))
                 .enter()
                 .append("g")
                 .attr("class", "x");

  xrule.append("line")
       .attr("x1", x)
       .attr("x2", x)
       .attr("y1", 0)
       .attr("y2", h);

  xrule.append("text")
       .attr("x", x)
       .attr("y", h + 3)
       .attr("dy", ".71em")
       .attr("text-anchor", "middle")
       .text(x.tickFormat(5));
});