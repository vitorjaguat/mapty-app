'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

class App {
    constructor() { }

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap, function () {
                alert('Could not get your position!');
            }
            );
    }

    _loadMap(position) {

        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(latitude, longitude);
        console.log(position)
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`)

        const coords = [latitude, longitude];

        //Displaying Leaflet map: (code available on https://leafletjs.com/index.html )
        //'L' is the Naming space used by the Leaflet script. 'map', 'tileLayer', 'marker' are methods that the Leaflet object can use.
        //'map' is the id of a div in HTML, where the map should appear.
        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);



        //Handling clicks on map:
        //'on' is a method of the map element, that was created by Leaflet (L object):
        map.on('click', function (mapE) {
            mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();


        })
    }


    _showForm() { }

    _toggleElevationField() { }

    _newWorkout() { }
}




form.addEventListener('submit', function (e) {
    e.preventDefault();
    const { lat, lng } = mapEvent.latlng;

    //Clear input fields:
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';

    //Display popup:
    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            //To view all the options for the popup, see Leaflet documentation!
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup'
        }))
        .setPopupContent('Workout')
        .openPopup();
})

inputType.addEventListener('change', function () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
})
