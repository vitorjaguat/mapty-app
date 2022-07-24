'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords; // [lat, lng]
        this.distance = distance; //in km
        this.duration = duration; //in min
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}
class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.durantion / 60);
        return this.speed;
    }
}

//Test:
// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);



//////////////////////////////////////////
// APPLICATION ARCHITETURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this));

        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
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
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        //Handling clicks on map:
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        //'on' is a method of the map element, that was created by Leaflet (L object):
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }


    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        //Helper functions:
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp)); //only returns true if every input is a positive number
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);


        e.preventDefault();

        // Get data from form:
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;



        // If running, create running object
        if (type === 'running') {
            const cadence = +inputCadence.value;
            //Check if data is valid
            // if (!Number.isFinite(distance)) || !Number.isFinite(duration) || !Number.isFinite(cadence) //if distance, duration or cadence is NaN
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
                return alert('Inputs have to be positive numbers')
        }
        //If cycling, create cycling object
        if (type === 'cycling') {
            const elevation = +inputElevation.value;

            if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
                return alert('Inputs have to be positive numbers')
        }
        //Add new object to workouts array

        //Render workout on map as a marker
        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng]).addTo(this.#map)
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


        //Render workout on list

        //Hide form + clear input fields
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';



    }
}


//Creating an App object to initialize app:
const app = new App();
