// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;
var margin = { top: 30, right: 100, bottom: 30, left: 100 };

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);  

// Append a group area, then set its margins
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y");

// Load json data from Flask route
url = "/annual_data";
d3.json(url, function(error, dataset) {

  // Throw an error if one occurs
  if (error) throw error;

  // Print the dataset
  console.log(dataset);

  // Format the date and cast the force value to a number
  dataset.forEach(function(data) {
    data.Year = parseTime(data.Year);
    data.Homeless_Population = +data.Homeless_Population;
    data.Budget_Dollars = +data.Budget_Dollars;
  });

  // Configure a time scale
  // d3.extent returns the an array containing the min and max values for the property specified
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(dataset, data => data.Year))
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(dataset, data => data.Homeless_Population)])
    .range([chartHeight, 0]);
  
    var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(dataset, data => data.Budget_Dollars)])
    .range([chartHeight, 0]);
  
  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xTimeScale);
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

  chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);

  // Add rightAxis to the right side of the display
  chartGroup.append("g").attr("transform", `translate(${chartWidth}, 0)`).call(rightAxis);

  // Configure line functions which will plot the x and y coordinates using our scales
  var drawLine1 = d3.line()
    .x(data => xTimeScale(data.Year))
    .y(data => yLinearScale1(data.Homeless_Population));

  var drawLine2 = d3.line()
    .x(data => xTimeScale(data.Year))
    .y(data => yLinearScale2(data.Budget_Dollars));
  
   // Append a path for line1
  chartGroup.append("path")
    .data([dataset])
    .attr("stroke", "black")
    .attr("stroke-width", "3")
    .attr("fill", "none")
    .attr("d", drawLine1)
    .classed("line", true);

  // Append a path for line2
  chartGroup.append("path")
    .data([dataset])
    .attr("stroke", "green")
    .attr("stroke-width", "3")
    .attr("fill", "none")
    .attr("d", drawLine2)
    .classed("line", true);
  
  // Append a legend to chart
  svg.append("circle").attr("cx",200).attr("cy",180).attr("r", 6).style("fill", "Black")
  svg.append("circle").attr("cx",200).attr("cy",210).attr("r", 6).style("fill", "Green")
  svg.append("text").attr("x", 220).attr("y", 180).text("Homeless Population").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 220).attr("y", 210).text("Annual Budget ($)").style("font-size", "15px").attr("alignment-baseline","middle")

}); 

