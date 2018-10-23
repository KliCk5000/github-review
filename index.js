const GITHUB_URL = "https://api.github.com/";
const A1 = "c085c9981358";
const A2 = "e574cdf9e187acf8";
const A3 = "c552d72d6db7";
const API_KEY = A1 + A3 + A2;

// Get Candidate Github list
function getGithubList(userHandle) { 
  // -setup query
  const params = {
    type: "owner",
    sort: "updated",
    direction: "desc",
  };
  // -put url together (FormatQueryParams)
  const queryString = formatQueryParams(params);
  const url = `${GITHUB_URL}users/${userHandle}/repos?${queryString}`;
  // -add API key to header
  const options = {
    headers: new Headers({
      "X-GitHub-OTP": API_KEY})
  };
  // -FETCH
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

// Display results
function displayResults(responseJson) {
  console.log(responseJson);
  $('.js-results-list').empty();

  for (let obj in responseJson) {
    $('.js-results-list').append(
      `<li><h3><a href="${responseJson[obj].html_url}">${responseJson[obj].name}</a></h3>
      <p>Created: ${responseJson[obj].created_at.substr(0, responseJson[obj].created_at.indexOf('T'))}</p>
      <p>By ${responseJson[obj].owner.login}</p>
      <p>Description: ${responseJson[obj].description}</p>
      <p>Language: ${responseJson[obj].language}</p>
      </li>`
    );
  }

  $('.js-results').removeClass('hidden');
}

// Watch for event submit on button
// (send info to function)
function watchForm() {
  $('.js-form').submit(event => {
    event.preventDefault();
    const userHandle = $('.js-user-handle').val();

    $('.js-user-handle').val('');
    getGithubList(userHandle);
  });
}

// Jquery watch form
$(watchForm);