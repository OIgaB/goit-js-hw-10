import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');
//import {RestCountriesAPI} from './fetchCountries';
import {fetchCountries} from './fetchCountries';

//<input type="text" id="search-box" />
//<ul class="country-list"></ul>
//<div class="country-info"></div>

const DEBOUNCE_DELAY = 300;
const searchInputEl = document.querySelector('#search-box');
const cardsSet = document.querySelector('.country-list');
const oneCard = document.querySelector('.country-info');

cardsSet.style.cssText = "padding-left: 4px; margin-top: 0";
searchInputEl.addEventListener('input', debounce(handleFormInput, DEBOUNCE_DELAY));

//const restCountriesAPI = new RestCountriesAPI();

function handleFormInput(event) {
    const name = event.target.value.trim();


    fetchCountries(name).then(data => {
        console.log(data);

        if (data.length > 10) {  ////Якщо бекенд повернув більше ніж 10 країн
            Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (data.length >= 2 && data.length <= 10) { ////Якщо бекенд повернув більше ніж 2, але менше ніж 10 країн
            cardsSet.insertAdjacentHTML('beforeend', createCountryCardsMarkup(data));
            
            function createCountryCardsMarkup(data) {
                return data.map(({flags, name}) => {
                    return `
                        <li style="display:flex; margin-bottom:15px; height: 40px;">
                            <div style="height: 40px; width: 60px;">
                                <img src="${flags.svg}" alt="flag" width="60"></img>
                            </div>
                            <p style="padding-left: 10px; margin-top: auto; margin-bottom: auto;">${name.official}</p>
                        </li>`;
                }).join('');
            } 

        } else { ////Якщо бекенд повернув 1 країну
            oneCard.insertAdjacentHTML('beforeend', createOneCountryCardMarkup(data));
            
            function createOneCountryCardMarkup(data) {
                return data.map(({flags, name, capital, population, languages}) => {
                    return `
                            <div style="height: 40px; width: 60px;">
                                <img src="${flags.svg}" alt="flag" width="60"></img>
                                <p style="padding-left: 10px; margin-top: auto; margin-bottom: auto;">${name.official}</p>
                            </div>
                            <ul>
                                <li>
                                    <span>Capital:</span>${capital}
                                </li>
                                <li>
                                    <span>Population:</span>${population}
                                </li>
                                <li>
                                    <span>Languages:</span>${Object.values(languages)}
                                </li>
                            </ul>
                    `;
                }).join('');
            } 
        }
    }).catch(Notify.failure('Oops, there is no country with that name')); //Якщо користувач ввів назву країни, якої не існує


    // console.log(restCountriesAPI.name); 
    // restCountriesAPI.name = event.target.value.trim();
    // console.log(restCountriesAPI.name);

    // restCountriesAPI.fetchCountries().then(data => {
    //     console.log(data);
    // }).catch(console.log);
}




//backOverlay   boolean	false	Adds a background overlay to the notifications.
//backOverlayColor  string	rgba(0,0,0,0.5)	Changes the color of the background overlay. (Only if the notification type-based "backOverlayColor" option is an empty string.)
//fontAwesomeIconStyle  string	basic	2 types of styles can be used: basic shadow

//jQuery(window).on('resize', _.debounce(calculateLayout, 150));