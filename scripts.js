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
            'circle-opacity': 0.2
        }
    });
});


// filter by victim type
function filterCrashes(property) {
    activeProperty = property;

    map.setPaintProperty('crash-points', 'circle-color', [
        'case',
        ['>', ['get', property], 0], '#ff6600',
        '#999999' 
    ]);

    map.setPaintProperty('crash-points', 'circle-opacity', [
        'case',
        ['>', ['get', property], 0], 0.4,
        0.2
    ]);
}

// show all button
function resetFilter() {
    activeProperty = null;

    map.setPaintProperty('crash-points', 'circle-color', '#999999');
    map.setPaintProperty('crash-points', 'circle-opacity', 0.2);
}


// popups when clicked on markers
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
  
    // text in the box
    const html = `
    <strong>${numberOfKilled}</strong> ${incidentType} Killed due to <strong>${props.contributing_factor_vehicle_1}</strong> on ${props.crash_date}
 
    `;

    
  
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
  });








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