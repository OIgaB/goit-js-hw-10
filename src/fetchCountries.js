export const fetchCountries = (name) => {
        
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`).then(response => {
        if(!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    })
}

//https://restcountries.eu/rest/v2/all?fields=name;capital;currencies




// export class RestCountriesAPI {
//     #BASE_URL = "https://restcountries.com";
//     name = "S";     

//     fetchCountries(name) {
        
//         fetch(`${this.#BASE_URL}/v3.1/name/${this.name}`).then(response => {
//             if(!response.ok) {
//                 throw new Error(response.status);
//             }
//             return response.json();
//         })
//     }
// }