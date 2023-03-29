import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

// Додаткові налаштування бібліотеки Notiflix
Notify.init({
    cssAnimation: true,
    cssAnimationDuration: 900,
    cssAnimationStyle: 'from-top',
});

const inputEl = document.querySelector('#search-box');     //<input>
const cardsSet = document.querySelector('.country-list');  //<ul>
const oneCard = document.querySelector('.country-info');   //<div>
const DEBOUNCE_DELAY = 300;

cardsSet.style.cssText = "padding-left: 4px; margin-top: 0";                   //<ul>
inputEl.addEventListener('input', debounce(handleFormInput, DEBOUNCE_DELAY)); //<input>


function handleFormInput(event) {
    const query = event.target.value.trim();

    fetchCountries(query).then(data => {
        console.log(data);
        if (data.length > 10) {  ////Якщо бекенд повернув більше ніж 10 країн
            Notify.info('Too many matches found. Please enter a more specific name.');

        } else if (data.length >= 2 && data.length <= 10) { ////Якщо бекенд повернув більше ніж 2, але менше ніж 10 країн
            cardsSet.insertAdjacentHTML('beforeend', createCountryCardsMarkup(data));

            //Обираємо країну з випадаючого списку кліком
            cardsSet.addEventListener('click', handleCountryItemClick);
            function handleCountryItemClick(evt) {
                data.forEach(({flags}, index) => {
                    if (evt.target.src === flags.svg) {
                        cardsSet.innerHTML = "";   
                        return oneCard.insertAdjacentHTML('beforeend', createOneCountryCardMarkup([data[index]]));  
                    }
                    return;
                }) 
            }
        } else {  ////Якщо бекенд повернув 1 країну
            oneCard.insertAdjacentHTML('beforeend', createOneCountryCardMarkup(data));
        }
    }).catch(() => {
        if(query === "") {  // Якщо <input> пустий
            return;
        }
        Notify.failure('Oops, there is no country with that name'); //Якщо користувач ввів назву країни, якої не існує  
    });
    oneCard.innerHTML = "";
    cardsSet.innerHTML = "";
}


function createCountryCardsMarkup(data) {  //Розмітка дла випадаючого списку країн
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

function createOneCountryCardMarkup(data) {  //Розмітка дла однієї країн
    return data.map(({flags, name, capital, population, languages}) => {

        const languagesWithSpaces = Object.values(languages).map((language) => {
            return " " + language ;
        });

        return `
                <div style="display:flex;">
                    <img src="${flags.svg}" alt="flag" width="60"></img>
                    <p style="padding-left: 10px; margin-top: auto; margin-bottom: auto; font-size: 30px; font-weight: 700; font-style: italic;">${name.official}</p>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li>
                        <span style = "font-weight: 700; padding-right: 10px;">Capital:</span>${capital}
                    </li>
                    <li>
                        <span style = "font-weight: 700; padding-right: 10px;">Population:</span>${population}
                    </li>
                    <li style = "gap: 3px;">
                        <span style = "font-weight: 700; padding-right: 10px;">Languages:</span>${languagesWithSpaces}
                    </li>
                </ul>
        `;
    }).join('');
}