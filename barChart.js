function renderBarChart(dataset, attribute1, attribute2) {
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
        
            const svg = d3.select("#barChartContainer").html("").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(dataset.map(d => d[attribute1]));
        
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
        
            // Create bars for the bar chart
            svg.selectAll(".bar")
                .data(dataset)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d[attribute1]))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d[attribute2]))
                .attr("height", d => height - y(d[attribute2]))
                .style("fill", "orange")
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
        
            // Create x and y axes
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
        
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y));
        }
        
