// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = 960;
    var svgHeight = 700;
  
    var margin = {
      top: 50,
      bottom: 100,
      right: 50,
      left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("assets/data/data.csv")
      .then(function(healthData) {
  
  
        // parse data
        healthData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
        });
  
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.poverty) - 1, d3.max(healthData, d => d.poverty) +1])
            .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.healthcare) - 1, d3.max(healthData, d => d.healthcare) +1])
            .range([height, 0]);
  
        // create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);
  
        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
  
        chartGroup.append("g")
            .call(yAxis);
  

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "12")
            .attr("fill", "coral")
            .attr("stroke-width", "1")
            .attr("opacity", "1")
            .attr("stroke", "none");

        var circleLabels = chartGroup.selectAll(null).data(healthData).enter().append("text");

        circleLabels
            .attr("x", function(d) {
                return xLinearScale(d.poverty);
            })
            .attr("y", function(d) {
                return yLinearScale(d.healthcare);
            })
            .text(function(d) {
                return d.abbr;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("dx", "-.65em")
            .attr("dy", ".35em")
            .attr("text-anchor", "center")
            .attr("fill", "white");

        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 60)
          .attr("x", 0 - (height / 1.5))
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");

        chartGroup.append("text")
          .attr("transform", `translate(${width / 2 - 25}, ${height + margin.top})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");


        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return `<strong>${d.state}</strong><br>Poverty %: ${d.poverty}<br>Healthcare %: ${d.healthcare}<br>`;
            });
  
        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);
  
        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
            toolTip.hide(d);
          });

      });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  