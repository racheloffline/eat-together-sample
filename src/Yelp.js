// npm install yelp-fusion --save
// import yelp from 'yelp-fusion';

const yelp = require('yelp-fusion');

const apiKey = 'Qpp5fhhif1yAux97RX4ulrRaUvGEEBr4ZfilwXQlwH763U83Tul4KUjwR7-4877bUlAFs5oh7xyy6KR3o21_ePK1xQxzlzCeltgyDO4GwTRqiUOJkLz6ga5DfpP1Y3Yx';

const client = yelp.client(apiKey);

// General food query in Seattle
// client.search({
//       term: 'food',
//       location: 'Seattle',
//       categories: 'italian',
//       // categories: 'indian',
//       latitude: 47.608013,
//       longitude: -122.335167,
//       radius: 40000,
//       limit: 30
//     }).then(response => {
//       console.log(response.jsonBody.businesses);
//     }).catch(error => {
//       console.log(error);
//     });



// npm install axios

// Library that helps allows you to send HTTP requests to the API endpoint.
const axios = require('axios');

const search_endpoint = 'https://api.yelp.com/v3/businesses/search';
const business_endpoint = 'https://api.yelp.com/v3/businesses';

const rest_info_endpoint = 'https://api.yelp.com/v3/businesses/${restaurantId}';
const rest_review_endpoint = 'https://api.yelp.com/v3/businesses/${restaurantId}/reviews';

let categories = ['coffee', 'food', 'restaurant']; // Default categories if user doesn't provide any
// const location = 'Seattle';  Default location if user doesn't provide one
const location = 'The Ave, Seattle, WA'
const limit = 5;
const radius = 2000;  // 2 km radius


// Get user input for categories and location
// const userInputCategories = props.categories;

// Example user input
const userInputCategories = ['coffee', 'food'];

// Check if user provided any categories
if (userInputCategories.length > 0) {
  categories = userInputCategories;
}


// Build query parameters object
let params = {
  categories: categories.join(','),
  location: location,
  limit: limit,
  radius: radius,
  sort_by: 'best_match', // sort by rating and review count
};

let names = [];
let menu_list = [];
let review_list = [];

axios.get(search_endpoint, {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
  params,
}).then(response => {
  const businesses = response.data.businesses;

  // Get the business IDS of all the restaurants
  const businessIds = response.data.businesses.map((business) => business.id);


  // Extract the top 5 matching restaurants and their locations from the response
  
  if (businesses.length > 0) {
    
    let i = 1;

    businessIds.forEach((businessId) => {
      axios.get(`${business_endpoint}/${businessId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          include: 'menu',
        },
      }).then((response) => {
        const curr = response.data;
        console.log(curr.name);
        console.log(curr.rating);
        console.log(curr.coordinates);


        names.push(`#${i+1}: ${curr.name}, Rating: ${curr.rating}, Location: ${curr.coordinates}`);
        console.log(names);

        let menu = curr.menu;
        if (menu) {
          menu_list.push(menu);
        } else {
          menu_list.push("N/A");
        }

        let review = curr.review;
        if (review) {
          review_list.push(review);
        } else {
          review_list.push("N/A");
        }

      }).catch((error) => {
        console.error(error);
      });

      i+=1;  
    });

    // console.log(names.length);

    for (let j = 0; j < names.length; j++) {
      console.log("hi");
      console.log(`Name : ${names[j]}`);
      console.log(`Menu : ${menu_list[j]}`);
      console.log(`Review : ${review_list[j]}`);
    }

  } else {
    console.log('No restaurants found for categories "${categories.join(',')}" near "${location}":');
  }
}).catch(error => {
  console.log(error);
});






// We could either have drop down box of restauarants where clicking on it gives us restaurant id
// Other option is to accept restaurant name, and work with it by converting to restauarant_id

const restaurantName = 'ABC Restaurant';
// const restaurantName = props.res_name;
// params = {
//   term: restaurantName,
//   location,
// };
// axios.get(endpoint, {
//   headers: {
//     Authorization: `Bearer ${apiKey}`,
//   },
//   params,
// }).then((response) => {
//   const businesses = response.data.businesses;
//   if (businesses.length > 0) {
//     const restaurantId = businesses[0].id; // Use the ID of the first restaurant in the search results
//     // Make another API call using the retrieved restaurant ID
//     axios.get(rest_info_endpoint, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     }).then((restaurantResponse) => {
//       console.log(restaurantResponse.data);
//     }).catch((error) => {
//       console.error(error);
//     });
//   } else {
//     console.log(`No results found for restaurant "${restaurantName}" near "${location}".`);
//   }
// }).catch((error) => {
//   console.error(error);
// });