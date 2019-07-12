const PLACEHOLDER = "https://tinyurl.com/tv-missing";
/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl, image }
 */

async function searchShows(query) {
  let results = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`);

  let shows = results.data.map(result => {
    let show = result.show;
    return {
      id: result.show.id,
      name: show.name,
      summary: show.summary ? show.summary : "No Summary",
      episodesUrl: `http://api.tvmaze.com/shows/${show.id}/episodes`,
      image: show.image ? show.image.medium:PLACEHOLDER
    };
  });

  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary show-episode">Episodes</button>
           </div>
         </div>
       </div>
      `);

  // Add event listener to episode button to show episodes when click   
    $(".show-episode").on("click", async function handleEpisode (evt) {
      evt.preventDefault();
    
      let episode = await getEpisodes(show.id);
    
      populateEpisodes(episode);
    });

      $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let results = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`);

  // TODO: figure out what data should be returned.
  let episodes = results.data.map(result => {
    return {
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number
    };
  });
  console.log(episodes);
  return episodes;
}
// Given a { id, name, season, number }, show episodes on DOM

function populateEpisodes(episodes) {
  for (episode of episodes)
  {
    $("#episodes-list").append(`
    <li>
      ${episode.name} (season ${episode.season}, number ${episode.number})
    </li>`)
  }
  $("#episodes-area").show();
}

