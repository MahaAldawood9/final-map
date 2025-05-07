mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYWFsZGF3b29kIiwiYSI6ImNtOThyeDFzYTA2NjEya3B3ZmVkbnBlNzUifQ.a2NLZb3e_7Ezo1smY7SpMQ';

const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-73.99432, 40.71103],
    zoom: 10
});



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
            'circle-radius': 4,
            'circle-color': '#999999',
            'circle-opacity': 0.4
        }
    });
});

let activeVictimType = null;
let activeContributingFactor = null;

// filter by victim type
function filterByVictimType(event, property) {
    activeVictimType = property;


    document.querySelectorAll('.button-group button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');


    map.setPaintProperty('crash-points', 'circle-color', [
        'case',
        ['>', ['get', property], 0],
        '#ff6600', 
        '#999999'  
    ]);

    map.setPaintProperty('crash-points', 'circle-opacity', [
        'case',
        ['>', ['get', property], 0], 
        0.7, 
        0.2 
    ]);
}

function showAllVictimTypes() {
    // Reset active victim type
    activeVictimType = null;

    // Remove active button class
    document.querySelectorAll('.button-group button').forEach(btn => btn.classList.remove('active'));

    //default 
    map.setPaintProperty('crash-points', 'circle-color', '#999999');
    map.setPaintProperty('crash-points', 'circle-opacity', 0.4);
}


// Contributing factor filter
function filterByContributingFactor(factor) {
    activeContributingFactor = factor;

    document.querySelectorAll('.button-group2 button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    map.setPaintProperty('crash-points', 'circle-color', [
        'case',
        ['==', ['get', 'contributing_factor_vehicle_1'], factor],
        '#ff0000',
        '#999999'
    ]);

    map.setPaintProperty('crash-points', 'circle-opacity', [
        'case',
        ['==', ['get', 'contributing_factor_vehicle_1'], factor],
        0.7,
        0.4
    ]);
}

// Year filtering
document.getElementById('yearSlider').addEventListener('input', (e) => {
    const selectedYear = parseInt(e.target.value);
    updateYearDisplay(selectedYear);

    if (selectedYear === 2025) {
        map.setFilter('crash-points', [
            '==', ['to-number', ['slice', ['get', 'crash_date'], -2]], 25
        ]);
    } else {
        map.setFilter('crash-points', [
            '==', ['to-number', ['slice', ['get', 'crash_date'], -2]], selectedYear % 100
        ]);
    }
});

function updateYearDisplay(year) {
    const label = year === 2025 ? 'Total' : year;
    document.getElementById('yearValue').textContent = label;
}

// Reset all filters
function resetFilters() {
    activeVictimType = null;
    activeContributingFactor = null;

    document.querySelectorAll('.button-group button, .button-group2 button').forEach(btn => btn.classList.remove('active'));

    map.setPaintProperty('crash-points', 'circle-color', '#999999');
    map.setPaintProperty('crash-points', 'circle-opacity', 0.4);
    map.setFilter('crash-points', undefined);

    document.getElementById('yearSlider').value = 2025;
    updateYearDisplay(2025);
}

// Popups
map.on('click', 'crash-points', (e) => {
    const props = e.features[0].properties;
    let victim = '';
    let killed = 0;

    if (props.number_of_cyclist_killed > 0) {
        victim = 'Cyclist';
        killed = props.number_of_cyclist_killed;
    } else if (props.number_of_pedestrians_killed > 0) {
        victim = 'Pedestrian';
        killed = props.number_of_pedestrians_killed;
    }

    const factor = props.contributing_factor_vehicle_1 || 'Unknown';
    const date = props.crash_date || 'Unknown date';

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${killed}</strong> ${victim} Killed due to <strong>${factor}</strong> on ${date}`)
        .addTo(map);
});


document.getElementById('yearSlider').value = 2025;
updateYearDisplay(2025);
