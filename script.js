const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
//async function searchSongs(term) {
//  const res = await fetch(`${apiURL}/suggest/${term}`);
//  const data = await res.json();
//  console.log(data);
//}

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`https://genius.p.rapidapi.com/search?q=${term}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '8b41c3da86mshf136c5380ba4fbep1213f7jsneccb0d36dd3c',
      'x-rapidapi-host': 'genius.p.rapidapi.com',
    },
  });
  const data = await res.json();

  console.log(data.response);
  showdata(data);
}

// Show song and artist in DOM
function showdata(data) {
  //let output = '';
  //
  //data.response.docs.forEach(song => {
  //  //console.log(song);
  //  output += `
  //  <li>
  //    <span><strong>${song.band}</strong> - ${song.title}</span>
  //    <button class="btn" data-artist="${song.band}" data-songtitle="${song.title}//">Get Lyrics</button>
  //  </li>
  //  `;
  //});
  //
  //result.innerHTML = `
  //<ul class="songs">
  //  ${output}
  //</ul>
  //`;

  result.innerHTML = `
  <ul class="songs">
    ${data.response.hits
      .map(
        song => `
    <li>
      <span><strong>${song.result.primary_artist.name}</strong> - ${song.result.title}</span>
      <button class="btn" data-artist="${song.result.primary_artist.name}" data-songtitle="${song.result.title}">Get Lyrics</button>     
    </li>    
    `
      )
      .join('')}
  </ul>
  `;
  more.innerHTML = '';
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(
    `https://api.vagalume.com.br/search.php?art=${artist}&mus=${songTitle}&apikey={38a71866d69ff281a661dccc923ff16e}`
  );
  const data = await res.json();
  //console.log(data.mus[0].text);
  const lyrics = data.mus[0].text.replace(/(\r\n|\r|\n)/g, '<br>');
  //console.log(lyrics);

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>
  `;

  more.innerHTML = `<button class="btn" onclick="searchSongs('${search.value.trim()}')">Back To Results</button>`;

  //more.innerHTML = '';
}

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();
  //searchSongs(searchTerm);
  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click

result.addEventListener('click', e => {
  //console.log(e.target);
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
