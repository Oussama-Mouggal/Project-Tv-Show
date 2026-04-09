//You can edit ALL of the code here
let allEpisodes = [];
let currentSearchTerm = "";

let searchInputElem;
let episodeSelectElem;
let matchCountElem;
let episodeGridElem;

function setup() {
  allEpisodes = getAllEpisodes();
  buildPageStructure();
  populateEpisodeSelector(allEpisodes);
  renderEpisodes(allEpisodes);
  updateMatchCount(allEpisodes.length, allEpisodes.length);
}

function buildPageStructure() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const heading = document.createElement("h1");
  heading.textContent = "TV Show Episodes";

  const controls = document.createElement("section");
  controls.className = "controls";

  const controlsRow = document.createElement("div");
  controlsRow.className = "controls-row";

  const searchControl = document.createElement("div");
  searchControl.className = "control-group";

  const searchLabel = document.createElement("label");
  searchLabel.setAttribute("for", "episode-search");
  searchLabel.textContent = "Search episodes:";

  searchInputElem = document.createElement("input");
  searchInputElem.id = "episode-search";
  searchInputElem.type = "text";
  searchInputElem.placeholder = "Search episodes";

  searchControl.appendChild(searchLabel);
  searchControl.appendChild(searchInputElem);

  const selectorControl = document.createElement("div");
  selectorControl.className = "control-group";

  const selectLabel = document.createElement("label");
  selectLabel.setAttribute("for", "episode-select");
  selectLabel.textContent = "Jump to episode:";

  episodeSelectElem = document.createElement("select");
  episodeSelectElem.id = "episode-select";

  selectorControl.appendChild(selectLabel);
  selectorControl.appendChild(episodeSelectElem);

  matchCountElem = document.createElement("p");
  matchCountElem.className = "match-count";

  controlsRow.appendChild(searchControl);
  controlsRow.appendChild(selectorControl);

  controls.appendChild(controlsRow);
  controls.appendChild(matchCountElem);

  episodeGridElem = document.createElement("section");
  episodeGridElem.className = "episode-grid";

  const attribution = document.createElement("p");
  attribution.className = "attribution";
  attribution.innerHTML =
    'Episode data originally comes from <a href="https://tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>.';

  rootElem.appendChild(heading);
  rootElem.appendChild(controls);
  rootElem.appendChild(episodeGridElem);
  rootElem.appendChild(attribution);

  searchInputElem.addEventListener("input", onSearchInput);
  episodeSelectElem.addEventListener("change", onEpisodeSelect);
}

function onSearchInput(event) {
  currentSearchTerm = event.target.value.trim();
  const filteredEpisodes = getFilteredEpisodes(allEpisodes, currentSearchTerm);
  renderEpisodes(filteredEpisodes);
  updateMatchCount(filteredEpisodes.length, allEpisodes.length);
}

function onEpisodeSelect(event) {
  const selectedEpisodeId = event.target.value;
  if (selectedEpisodeId === "") {
    return;
  }

  // Clear search so the selected episode is definitely visible before scrolling.
  currentSearchTerm = "";
  searchInputElem.value = "";
  renderEpisodes(allEpisodes);
  updateMatchCount(allEpisodes.length, allEpisodes.length);

  const selectedEpisodeElem = document.getElementById(
    `episode-${selectedEpisodeId}`,
  );
  if (selectedEpisodeElem) {
    selectedEpisodeElem.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getFilteredEpisodes(episodeList, searchTerm) {
  if (searchTerm === "") {
    return episodeList;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return episodeList.filter((episode) => {
    const nameMatches = episode.name
      .toLowerCase()
      .includes(lowerCaseSearchTerm);
    const summaryMatches = episode.summary
      .toLowerCase()
      .includes(lowerCaseSearchTerm);

    return nameMatches || summaryMatches;
  });
}

function renderEpisodes(episodeList) {
  episodeGridElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("article");
    card.className = "episode-card";
    card.id = `episode-${episode.id}`;

    const title = document.createElement("h2");
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    title.textContent = `${episode.name} - ${episodeCode}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `${episode.name} (${episodeCode})`;

    const episodeMeta = document.createElement("p");
    episodeMeta.className = "episode-meta";
    episodeMeta.textContent = `Season ${episode.season}, Episode ${episode.number}`;

    const summary = document.createElement("div");
    summary.className = "episode-summary";
    summary.innerHTML = episode.summary;

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(episodeMeta);
    card.appendChild(summary);
    episodeGridElem.appendChild(card);
  });
}

function populateEpisodeSelector(episodeList) {
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  episodeSelectElem.appendChild(defaultOption);

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    option.value = String(episode.id);
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelectElem.appendChild(option);
  });
}

function updateMatchCount(matchCount, totalCount) {
  matchCountElem.textContent = `Displaying ${matchCount} / ${totalCount} episodes`;
}

function formatEpisodeCode(season, episodeNumber) {
  const formattedSeason = String(season).padStart(2, "0");
  const formattedEpisode = String(episodeNumber).padStart(2, "0");
  return `S${formattedSeason}E${formattedEpisode}`;
}

window.onload = setup;
