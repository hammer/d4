d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  var data = csv.filter(function(el) { return el.state_location == "CA"; })
                .map(function(el) { return parseInt(el.revenues) });
  var w = 275,
      h = 225,
      xmin = d3.min(data),
      xmax = d3.max(data),
      x = d3.scale.linear()
                  .domain([xmin, xmax])
                  .range([0, w]),
      kde_x_vals = d3.range(xmin, xmax, (xmax - xmin)/100);
      kde = science.stats.kde()
                         .sample(data)
                  	 .bandwidth(science.stats.bandwidth.nrd0)(kde_x_vals),
      ymax = d3.max(kde, function(d) { return d[1]; }),
      y = d3.scale.linear()
                  .domain([0, ymax])
                  .range([0, h]);

  var vis = d3.select("div#kde")
       	      .append("svg")
	      .attr("width", w)
              .attr("height", h);

  var line = d3.svg.line()
  	           .x(function(d) { return x(d[0]); })
	           .y(function(d) { return h - y(d[1]); });

  vis.append("path")
     .attr("d", line(kde));
});