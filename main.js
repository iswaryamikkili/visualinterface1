Promise.all([
    d3.json('data/counties-10m.json'),
    d3.csv('data/filtered_data1.csv')
]).then(data => {
    const geoData = data[0];
    const countyData = data[1];

    // Extract attribute names dynamically (excluding identifiers)
    const attributes = Object.keys(countyData[0]).filter(d => d !== "cnty_fips" && d !== "display_name");

    // Populate dropdowns
    const dropdown1 = document.getElementById('attribute1');
    const dropdown2 = document.getElementById('attribute2');

    attributes.forEach(attribute => {
        const option1 = document.createElement("option");
        option1.value = attribute;
        option1.textContent = attribute;
        dropdown1.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = attribute;
        option2.textContent = attribute;
        dropdown2.appendChild(option2);
    });

    // Default selected attributes
    let selectedAttr1 = attributes[0];
    let selectedAttr2 = attributes[1];

    // Function to bind attributes to GeoJSON
    function bindDataToGeoJSON(attr1, attr2) {
        geoData.objects.counties.geometries.forEach(d => {
            let county = countyData.find(c => c.cnty_fips === d.id);
            if (county) {
                d.properties.attr1 = +county[attr1];
                d.properties.attr2 = +county[attr2];
            } else {
                d.properties.attr1 = null;
                d.properties.attr2 = null;
            }
        });
    }

    // Function to update all visualizations
    function updateVisualizations() {
        selectedAttr1 = dropdown1.value;
        selectedAttr2 = dropdown2.value;

        if (selectedAttr1 && selectedAttr2) {
            bindDataToGeoJSON(selectedAttr1, selectedAttr2);

            // Update both maps
            map1.updateData("attr1");
            map2.updateData("attr2");

            // Update bar chart and scatter plot
            renderBarChart(countyData, selectedAttr1, selectedAttr2);
            renderScatterPlot(countyData, selectedAttr1, selectedAttr2);
        }
    }

    // Initialize maps
    const map1 = new ChoroplethMap({ parentElement: '#map1' }, geoData);
    const map2 = new ChoroplethMap({ parentElement: '#map2' }, geoData);

    // Initial data binding and render
    bindDataToGeoJSON(selectedAttr1, selectedAttr2);
    map1.updateData("attr1");
    map2.updateData("attr2");

    // Event listener for update button
    document.getElementById('updateBtn').addEventListener('click', updateVisualizations);
}).catch(error => console.error(error));





