d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  // sort in ascending order for the quantile function
  // NB: JS lexically sorts by default
  var data = csv.filter(function(el) { return el.state_location == "CA"; })
                .map(function(el) { return parseInt(el.revenues) })
                .sort(d3.ascending);

  var p = 20,
      w = 275 - 2 * p,
      h = 225 - 2 * p;

  var x = d3.scale.linear()
                  .domain([0, d3.max(data)])
                  .range([0, w]);

  var y = d3.scale.linear()
                  .range([0, h]);

  var vis = d3.select("div#ecdf")
              .append("svg")
              .attr("width", w + 2 * p)
              .attr("height", h + 2 * p)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");

  // draw the data points and associated lines
  var datapoint = vis.selectAll("g.datapoint")
                     .data(data)
                     .enter()
                     .append("g")
                     .attr("class", "datapoint");

  // points
  datapoint.append("circle")
           .attr("cx", x)
           .attr("cy", function(d, i) { return y(1-(i+1)/data.length); })
           .attr("r", 2);

  // lines
  datapoint.append("line")
           .attr("x1", x)
           .attr("x2", function(d, i) { return i+1<data.length ? x(data[i+1]) : x(d); } )
           .attr("y1", function(d, i) { return y(1-(i+1)/data.length); })
           .attr("y2", function(d, i) { return y(1-(i+1)/data.length); });

  // x axis
  var xrule = vis.selectAll("g.x")
                 .data(x.ticks(5))
                 .enter()
                 .append("g")
                 .attr("class", "x");

  // ticks
  xrule.append("line")
       .attr("x1", x)
       .attr("x2", x)
       .attr("y1", 0)
       .attr("y2", h);

  // labels
  xrule.append("text")
       .attr("x", x)
       .attr("y", h + 3)
       .attr("dy", ".71em")
       .attr("text-anchor", "middle")
       .text(x.tickFormat(5));

  // y axis
  var yrule = vis.selectAll("g.y")
                 .data(y.ticks(5))
                 .enter()
                 .append("g")
                 .attr("class", "y");

  // ticks
  yrule.append("line")
       .attr("x1", -4)
       .attr("x2", 0)
       .attr("y1", function(d) { return h-y(d); })
       .attr("y2", function(d) { return h-y(d); });

  // labels
  yrule.append("text")
       .attr("x", -5)
       .attr("y", function(d) { return h-y(d); })
       .attr("dy", "0.5ex")
       .attr("text-anchor", "end")
       .text(y.tickFormat(5));
});