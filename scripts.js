mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYWFsZGF3b29kIiwiYSI6ImNtOThyeDFzYTA2NjEya3B3ZmVkbnBlNzUifQ.a2NLZb3e_7Ezo1smY7SpMQ';

const mapOptions = {
    container: 'map-container',
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-73.99432, 40.71103],
    zoom: 10
};

const map = new mapboxgl.Map(mapOptions);

map.on('load', () => {
    map.addSource('deaths', {
        type: 'geojson',
        data: './data/deaths.geojson'
    });

    map.addLayer({
        id: 'crash-points',
        type: 'circle',
        source: 'deaths',
        paint: {
            'circle-radius': 6,
            'circle-color': '#999999', // default gray
            'circle-opacity': 0.3
        }
    });
});

function filterCrashes(property) {
    activeProperty = property;

    map.setPaintProperty('crash-points', 'circle-color', [
        'case',
        ['>', ['get', property], 0], '#ff6600', // highlight match
        '#999999' // others gray
    ]);

    map.setPaintProperty('crash-points', 'circle-opacity', [
        'case',
        ['>', ['get', property], 0], 0.9,
        0.2
    ]);
}

function resetFilter() {
    activeProperty = null;

    map.setPaintProperty('crash-points', 'circle-color', '#999999');
    map.setPaintProperty('crash-points', 'circle-opacity', 0.6);
}


map.on('click', 'crash-points', (e) => {
    const props = e.features[0].properties;
  
    let incidentType = '';
    let numberOfKilled = 0;
  
    // Determine if it's a cyclist or pedestrian incident
    if (props.number_of_cyclist_killed > 0) {
      incidentType = 'Cyclist';
      numberOfKilled = props.number_of_cyclist_killed;
    } else if (props.number_of_pedestrians_killed > 0) {
      incidentType = 'Pedestrian';
      numberOfKilled = props.number_of_pedestrians_killed;
    }
  
    const html = `
    ${numberOfKilled} ${incidentType} Killed due to ${props.contributing_factor_vehicle_1} on ${props.crash_date}
 
    `;
  
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
  });


  function filterByContributingFactor(factor) {
    selectedFactor = factor;

    // Update the filter to show only features with the selected contributing factor
    map.setFilter('crash-points', ['==', ['get', 'contributing_factor_vehicle_1'], selectedFactor]);

    // Highlight the selected factor points in dark red
    map.setPaintProperty('crash-points', 'circle-color', '#ff0000'); // Dark Red for selected
    map.setPaintProperty('crash-points', 'circle-opacity', 0.8);
}



//     map.addLayer({
//         id: 'crash-points',
//         type: 'circle',
//         source: 'deaths',
//         paint: {
//             'circle-radius': 6,
//             'circle-color': '#ff6600',
//             'circle-opacity': 0.6
//         }
//     });
// });

// function filterCrashes(property) {
//     map.setFilter('crash-points', ['>', ['get', property], 0]);
// }

// function resetFilter() {
//     map.setFilter('crash-points', null);
// }
