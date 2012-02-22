// For an array d sorted in ascending order, return [q1, median, q3]
function boxQuartiles(d) {
  return [
    d3.quantile(d, 0.25),
    d3.quantile(d, 0.50),
    d3.quantile(d, 0.75)
  ];
}

// Returns a function to compute the indices of values just inside
// k times the interquartile range (above, below) the (q3, q1) value
// (to be used as whiskers in a box plot)
function boxWhiskers(d) {
  var q1 = d3.quantile(d, 0.25),
      q3 = d3.quantile(d, 0.75),
      k = 1.5,
      iqr = (q3 - q1) * k,
      i = -1,
      j = d.length;
  while (d[++i] < q1 - iqr);
  while (d[--j] > q3 + iqr);
  return [i, j];
}

d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  // sort in ascending order for the quantile function
  // NB: JS lexically sorts by default
  var data = csv.filter(function(el) { return el.state_location == "CA"; })
                .map(function(el) { return parseInt(el.revenues) })
                .sort(d3.ascending);

  var quartiles = boxQuartiles(data),
      whisker_indices = boxWhiskers(data);

  var p = 20,
      w = 275 - 2 * p,
      h = 225 - 2 * p,
      box_width = 20;

  var y = d3.scale.linear()
                  .domain([0, d3.max(data)])
                  .range([0, h]);

  var vis = d3.select("div#box")
              .append("svg")
              .attr("width", w + 2 * p)
              .attr("height", h + 2 * p)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");

  // draw the box representing the IQR
  vis.append("rect")
     .attr("x", w/2-box_width/2)
     .attr("y", h - y(quartiles[2]))
     .attr("width", box_width)
     .attr("height", y(quartiles[2] - quartiles[0]));

  // draw the median
  vis.append("line")
      .attr("class", "median")
      .attr("x1", w/2-box_width/2)
      .attr("x2", w/2+box_width/2)
      .attr("y1", h-y(quartiles[1]))
      .attr("y2", h-y(quartiles[1]));

  // draw the whiskers
  // NB: quartiles[i*2] is a little bit of trickery
  //     to get q1 for the lower whisker and q3 for the upper whisker
  vis.selectAll(".whiskers line")
     .data(whisker_indices)
     .enter()
     .append("line")
     .attr("class", "whiskers")
     .attr("x1", w/2)
     .attr("x2", w/2)
     .attr("y1", function(d, i) { return h-y(quartiles[i*2]); })
     .attr("y2", function(d) { return h-y(data[d]); });

  // draw the outliers
  vis.selectAll("circle")
     .data(data.filter(function(d, i) { return i < boxWhiskers(data)[0] || i > boxWhiskers(data)[1]; }))
     .enter()
     .append("circle")
     .attr("cx", w / 2)
     .attr("cy", function(d) { return h - y(d); })
     .attr("r", 2)
     .on("mouseover", function(d, i){d3.select("div#box g").append("text").attr("id", "tip").attr("x", w/2+5).attr("y", h - y(d)).attr("text-anchor", "start").attr("font-size", "8").text(d3.format(",")(d)); d3.select(this).attr("fill", "red")})
     .on("mouseout", function(d, i){d3.select("div#box g #tip").remove(); d3.select(this).attr("fill", "black")});

  // draw the y axis
  var yrule = vis.selectAll(".y g")
                 .data(y.ticks(5))
                 .enter()
                 .append("g")
                 .attr("class", "y");

  yrule.append("line")
       .attr("class", "yaxis")
       .attr("x1", 25)
       .attr("x2", w)
       .attr("y1", function(d) { return h-y(d); })
       .attr("y2", function(d) { return h-y(d); });

  yrule.append("text")
       .attr("x", 20)
       .attr("y", function(d) { return h-y(d); })
       .attr("dy", "0.5ex")
       .attr("text-anchor", "end")
       .text(y.tickFormat(5));

  // x axis
  var xrule = vis.selectAll("g.x")
                 .data(["CA"])
                 .enter()
                 .append("g")
                 .attr("class", "x");

  xrule.append("line")
       .attr("x1", w/2)
       .attr("x2", w/2)
       .attr("y1", h)
       .attr("y2", h+4);

  xrule.append("text")
       .attr("x", w/2)
       .attr("y", h+5)
       .attr("dy", ".71em")
       .attr("text-anchor", "middle")
       .text(String);
});