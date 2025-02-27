function renderScatterPlot(dataset, attribute1, attribute2) {
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
        
            // Clear any previous SVG content
            const svg = d3.select("#scatterPlotContainer").html("").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            // Define x and y scales based on the selected attributes
            const x = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(dataset, d => d[attribute1])]);
        
            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(dataset, d => d[attribute2])]);
        
            // Create Tooltip element (hidden by default)
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "lightsteelblue")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .style("font-size", "12px")
                .style("pointer-events", "none");
        
            // Create the scatter plot circles
            svg.selectAll(".dot")
                .data(dataset)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 5)
                .attr("cx", d => x(d[attribute1]))
                .attr("cy", d => y(d[attribute2]))
                .style("fill", "blue")
                // Show tooltip on mouseover
                .on("mouseover", function(event, d) {
                    tooltip.style("visibility", "visible")
                        .html("Name: " + d["display_name"] + "<br/>" + 
                            attribute1 + ": " + d[attribute1] + "<br/>" + 
                            attribute2 + ": " + d[attribute2])
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                // Hide tooltip on mouseout
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        
            // Add x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .append("text")
                .attr("x", width / 2)
                .attr("y", 25)
                .style("text-anchor", "middle")
                .text(attribute1); // Label for x-axis
        
            // Add y-axis
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -35)
                .attr("x", -height / 2)
                .style("text-anchor", "middle")
                .text(attribute2); // Label for y-axis
        }
        




