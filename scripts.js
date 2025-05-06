mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYWFsZGF3b29kIiwiYSI6ImNtOThyeDFzYTA2NjEya3B3ZmVkbnBlNzUifQ.a2NLZb3e_7Ezo1smY7SpMQ';

const mapOptions = {
    container: 'map-container',
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-73.99432, 40.71103],
    zoom: 10
};

const map = new mapboxgl.Map(mapOptions);

// add manhattan geojson
map.on('load', () => {
    map.addSource('mn', {
        type: 'geojson',
        data: './data/mn.geojson' 
    });

    map.addLayer({
        id: 'mn',
        type: 'circle',
        source: 'mn',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ff6600'
        }
    });
});


// add brooklyn geojson
map.on('load', () => {
    map.addSource('bk', {
        type: 'geojson',
        data: './data/bk.geojson' 
    });

    map.addLayer({
        id: 'bk',
        type: 'circle',
        source: 'bk',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ff6600'
        }
    });
});

// add queens geojson
map.on('load', () => {
    map.addSource('qn', {
        type: 'geojson',
        data: './data/qn.geojson' 
    });

    map.addLayer({
        id: 'qn',
        type: 'circle',
        source: 'qn',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ff6600'
        }
    });
});

// add staten island geojson
map.on('load', () => {
    map.addSource('si', {
        type: 'geojson',
        data: './data/si.geojson' 
    });

    map.addLayer({
        id: 'si',
        type: 'circle',
        source: 'si',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ff6600'
        }
    });
});

// add bronx geojson
map.on('load', () => {
    map.addSource('bx', {
        type: 'geojson',
        data: './data/bx.geojson' 
    });

    map.addLayer({
        id: 'bx',
        type: 'circle',
        source: 'bx',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ff6600'
        }
    });
});