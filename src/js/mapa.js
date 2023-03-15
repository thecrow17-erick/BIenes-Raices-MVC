(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker;

    //utilizar provide y geocoder 
    const geocodeService = L.esri.Geocoding.geocodeService();


    //mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    //pin
    marker = new L.marker([lat,lng],{
        draggable: true,
        autoPan: true

    })
    .addTo(mapa)

    //detectar el movimiento del pin
    marker.on('moveend', (e)=>{
        marker = e.target

        const posicion = marker.getLatLng()

        console.log(posicion)

        mapa.panTo(new L.latLng(posicion.lat,posicion.lng))

        //obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion,13).run(function(err,res){
           console.log(res) 
           marker.bindPopup(res.address.LongLabel)
        })
        
    })
})()