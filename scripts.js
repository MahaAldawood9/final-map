mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYWFsZGF3b29kIiwiYSI6ImNtOThyeDFzYTA2NjEya3B3ZmVkbnBlNzUifQ.a2NLZb3e_7Ezo1smY7SpMQ';

const mapOptions = {
    container: 'map-container',
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-73.99432, 40.71103],
    zoom: 10
};

const map = new mapboxgl.Map(mapOptions);

map.on('load', () => {
    const boroughs = {
        mn: './data/mn.geojson',
        bk: './data/bk.geojson',
        qn: './data/qn.geojson',
        si: './data/si.geojson',
        bx: './data/bx.geojson'
    };

    for (const id in boroughs) {
        map.addSource(id, {
            type: 'geojson',
            data: boroughs[id]
        });

        map.addLayer({
            id: id,
            type: 'circle',
            source: id,
            paint: {
                'circle-radius': 6,
                'circle-color': '#999', 
                'circle-opacity': 0.2
            }
        });
    }
});

function highlightBorough(id) {
    const boroughs = ['mn', 'bk', 'qn', 'si', 'bx'];
    selectedBoroughId = id;

    boroughs.forEach(b => {
        if (b === id) {
            map.setPaintProperty(b, 'circle-color', '#ff6600');
            map.setPaintProperty(b, 'circle-opacity', 0.6);
        } else {
            map.setPaintProperty(b, 'circle-color', '#999999');
            map.setPaintProperty(b, 'circle-opacity', 0.2);
        }
    });

    // Hide the sidebar and show the filter container
    document.getElementById('sidebar-container').style.display = 'block'; 
    document.getElementById('filter-container').style.display = 'block';
    document.getElementById('selected-borough-label').innerText = boroughNameFromId(id);

    map.setFilter(id, null); 
}

function boroughNameFromId(id) {
    const names = {
        mn: 'Manhattan',
        bk: 'Brooklyn',
        qn: 'Queens',
        si: 'Staten Island',
        bx: 'The Bronx'
    };
    return names[id];
}

function filterCrashes(property) {
    if (!selectedBoroughId) return;
    map.setFilter(selectedBoroughId, ['>', ['get', property], 1]);
}

function goBack() {
    if (selectedBoroughId) {
        map.setPaintProperty(selectedBoroughId, 'circle-color', '#999999');
        map.setPaintProperty(selectedBoroughId, 'circle-opacity', 0.2);
        map.setFilter(selectedBoroughId, null);
    }

    selectedBoroughId = null;
    document.getElementById('sidebar-container').style.display = 'block'; 
    document.getElementById('filter-container').style.display = 'none';
}