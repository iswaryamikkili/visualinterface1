class ChoroplethMap {
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 400,
        margin: _config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
        tooltipPadding: 10
      };
  
      this.data = _data;
      this.us = _data;
      this.active = d3.select(null);
      this.currentAttr = null;
  
      this.initVis();
    }
  
    initVis() {
      let vis = this;
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);
  
      vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale(vis.width);
  
      vis.colorScale = d3.scaleLinear()
        .range(['#000000', '#0d306b'])
        .interpolate(d3.interpolateHcl);
  
      vis.path = d3.geoPath().projection(vis.projection);
  
      vis.g = vis.svg.append("g")
        .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      vis.counties = vis.g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(vis.us, vis.us.objects.counties).features)
        .enter().append("path")
        .attr("d", vis.path)
        .attr("fill", "#000000") // Default color when no data
        .on('mousemove', (event, d) => {
          let value = d.properties[vis.currentAttr] ? `<strong>${d.properties[vis.currentAttr]}</strong>` : 'No data available';
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.properties.name}</div>
              <div>${value}</div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });
  
      vis.g.append("path")
        .datum(topojson.mesh(vis.us, vis.us.objects.states, (a, b) => a !== b))
        .attr("id", "state-borders")
        .attr("d", vis.path);
    }
  
    updateData(attribute) {
      let vis = this;
      vis.currentAttr = attribute;
  
      vis.colorScale.domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties[attribute]));
  
      vis.counties.transition().duration(1000)
        .attr('fill', d => d.properties[attribute] ? vis.colorScale(d.properties[attribute]) : "#000000");
    }
  }


    
    