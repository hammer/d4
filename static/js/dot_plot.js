d3.csv("f500.csv", function handleCSV(csv) {
  // select revenues of CA companies
  var data = csv.filter(function(el) { 
                          return el.state_location == "CA"; })
                .map(function(el) { 
                          return parseInt(el.revenues) });

  var w = 235,
      h = 185,
      p = 20,
      r = 3,
      x = d3.scale.linear()
                  .domain([0, d3.max(data) * 1.01])
                  .range([0, w]),
      y = d3.scale.ordinal()
                  .domain(["CA"])
                  .range([h/2]);

  var vis = d3.select("div #dot")
              .append("svg")
              .attr("width", w + p * 2)
              .attr("height", h + p * 2)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");

  // x axis
  var xrule = vis.selectAll("g.x")
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

  // y axis
  var yrule = vis.selectAll("g.y")
                 .data(["CA"])
                 .enter()
                 .append("g")
                 .attr("class", "y");

  yrule.append("line")
       .attr("x1", -3)
       .attr("x2", 0)
       .attr("y1", y)
       .attr("y2", y);

  yrule.append("text")
       .attr("x", -5)
       .attr("y", y)
       .attr("dy", ".35em")
       .attr("text-anchor", "end")
       .text(String);

  // draw the dots
  vis.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", x)
     .attr("cy", y("CA"))
     .attr("r", r)
     .on("mouseover", function(d, i){d3.select("g.x").append("text").attr("id", "tip").attr("x", x(d)+5).attr("y", y("CA")-5).attr("text-anchor", "start").attr("font-size", "8").text(d3.format(",")(d)); d3.select(this).attr("fill", "red")})
     .on("mouseout", function(d, i){d3.select("g.x #tip").remove(); d3.select(this).attr("fill", "black")});
});



