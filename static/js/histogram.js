d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  var data = csv.filter(function(el) { return el.state_location == "CA"; })
                .map(function(el) { return parseInt(el.revenues) });

  var histogram = d3.layout.histogram().bins(30)(data);

  var p = 20,
      w = 275 - 2 * p;
      h = 225 - 2 * p;
 
  var x = d3.scale.ordinal()
                  .domain(histogram.map(function(d) { return d.x; }))
                  .rangeRoundBands([0, w]);

  //  var x = d3.scale.linear()
  //                  .domain([d3.min(histogram.map(function(d) { return d.x; })),
  //                           d3.max(histogram.map(function(d) { return d.x+d.dx; }))])
  //                  .range([0, width]);
 
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
     .attr("width", x.rangeBand()) // function(d) { return x(d.dx); }
     .attr("height", function(d) { return y(d.y); });
 
  // x axis (ordinal axes can't configure number of ticks)
  var ticks = x.domain().filter(function(d, i) { return i % 8 == 5; });
  console.log(ticks);

  // x axis
  var xrule = vis.selectAll("div#histogram g.x")
                 .data(ticks)
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
      .text(d3.format(",.0f"));
});