//some js


function encodeSvg(svg) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}



function scenicPhoto(config) {
  return encodeSvg(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">' +
      '<defs>' +
        '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + config.skyTop + '"/>' +
          '<stop offset="100%" stop-color="' + config.skyBottom + '"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="1080" height="1080" fill="url(#sky)"/>' +
      '<ellipse cx="160" cy="220" rx="170" ry="90" fill="#ffffff" opacity="0.92"/>' +
      '<ellipse cx="370" cy="300" rx="220" ry="110" fill="#ffffff" opacity="0.88"/>' +
      '<ellipse cx="780" cy="190" rx="200" ry="95" fill="#ffffff" opacity="0.85"/>' +
      '<ellipse cx="910" cy="320" rx="160" ry="80" fill="#ffffff" opacity="0.8"/>' +
      '<path d="' + config.mountain + '" fill="' + config.rock + '"/>' +
      '<path d="' + config.shadow + '" fill="' + config.shadowColor + '" opacity="0.55"/>' +
      '<rect y="860" width="1080" height="220" fill="' + config.ground + '"/>' +
    '</svg>'
  );
}

function portrait(initials, start, end) {
  return encodeSvg(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
      '<defs>' +
        '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="' + start + '"/>' +
          '<stop offset="100%" stop-color="' + end + '"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="120" height="120" rx="60" fill="url(#g)"/>' +
      '<text x="60" y="73" text-anchor="middle" font-size="42" font-family="Helvetica, Arial, sans-serif" fill="#ffffff" font-weight="700">' + initials + '</text>' +
    '</svg>'
  );
}




//POSTS
var posts = [
  {
    id: 1,
    user: "pat",
    place: "Yosemite National Park",
    time: "12m",
    avatar: portrait("P", "#405e84", "#1c2633"),
    image: scenicPhoto({
      skyTop: "#819bc0",
      skyBottom: "#eef1f5",
      mountain: "M590 720 L760 460 L890 445 L1010 530 L1070 760 L1070 860 L470 860 Z",
      shadow: "M665 505 L760 460 L890 445 L1010 530 L890 610 L760 655 L675 650 Z",
      rock: "#d0c0a9",
      shadowColor: "#9e8c78",
      ground: "#d8cfc0"
    }),
    likes: 184,
    caption: "Still one of those places that makes everyone go quiet for a minute.",
    comments: [
      { user: "elena123", text: "This is exactly the old IG feeling." },
      { user: "mikeinboots", text: "Let's hope we will win this Hacktathon! " }
    ]
  },
  {
    id: 2,
    user: "pat",
    place: "Mission District, San Francisco",
    time: "1h",
    avatar: portrait("P", "#405e84", "#1c2633"),
    image: scenicPhoto({
      skyTop: "#f3d9b2",
      skyBottom: "#f7f0e3",
      mountain: "M0 830 L260 620 L510 760 L720 610 L1080 790 L1080 860 L0 860 Z",
      shadow: "M260 620 L470 700 L620 650 L760 700 L920 740 L1080 790 L1080 860 L560 860 L300 820 Z",
      rock: "#bb7f5c",
      shadowColor: "#8b5f47",
      ground: "#d7c9b7"
    }),
    likes: 96,
    caption: "A slower internet would probably make everybody a little nicer.",
    comments: [
      { user: "lena_toast", text: "Honestly yes" },
      { user: "samir", text: "Chronological feed forever" }
    ]
  },
  {
    id: 3,
    user: "pat",
    place: "Yosemite Village",
    time: "3h",
    avatar: portrait("P", "#405e84", "#1c2633"),
    image: scenicPhoto({
      skyTop: "#c7d8de",
      skyBottom: "#f6f7f7",
      mountain: "M0 780 L180 650 L380 720 L560 520 L760 580 L930 470 L1080 620 L1080 860 L0 860 Z",
      shadow: "M560 520 L760 580 L930 470 L1080 620 L1080 860 L720 860 L520 760 L460 680 Z",
      rock: "#83966d",
      shadowColor: "#5d6f52",
      ground: "#cbc3b5"
    }),
    likes: 312,
    caption: "Morning light over the valley floor. Thanks for keeping the trails clean this week.",
    comments: [
      { user: "usullip", text: "The colors here look straight out of 2015." },
      { user: "lilmapppp", text: "I miss when photos just looked like photos." }
    ]
  }
];



var searchResults = [
  { type: "#", title: "yosemite", subtitle: "816,319 posts" },
  { type: "⌖", title: "Yosemite National Park", subtitle: "Yosemite Village" },
  { type: "avatar", title: "yosemitenps", subtitle: "Yosemite National Park", avatar: portrait("YN", "#2a7a4b", "#184f34") }
];

function renderSearchResults() {
  var container = document.getElementById("search-results");

  container.innerHTML = searchResults.map(function (item) {
    var glyph = item.type === "avatar"
      ? '<img class="search-avatar" src="' + item.avatar + '" alt="' + item.title + '">'
      : '<div class="search-glyph">' + item.type + "</div>";

    return [
      '<div class="search-item">',
      glyph,
      "<div>",
      "<strong>" + item.title + "</strong>",
      "<span>" + item.subtitle + "</span>",
      "</div>",
      "</div>"
    ].join("");
  }).join("");
}

function renderFeed() {
  var feed = document.getElementById("feed-list");

  feed.innerHTML = posts.map(function (post) {
    var commentHtml = post.comments.map(function (comment) {
      return '<p class="comment-line"><strong>' + comment.user + "</strong> " + comment.text + "</p>";
    }).join("");

    return [
      '<article class="post-card">',
      '  <header class="post-header">',
      '    <div class="post-author">',
      '      <img class="avatar" src="' + post.avatar + '" alt="' + post.user + ' avatar">',
      '      <div class="post-user">',
      '        <span class="post-user-name">' + post.user + "</span>",
      '        <span class="post-location">' + post.place + "</span>",
      "      </div>",
      "    </div>",
      '    <span class="post-time">' + post.time + "</span>",
      "  </header>",
      '  <div class="post-photo">',
      '    <img src="' + post.image + '" alt="' + post.place + '">',
      "  </div>",
      '  <div class="post-body">',
      '    <p class="likes">' + post.likes + " likes</p>",
      '    <p class="caption"><strong>' + post.user + "</strong> " + post.caption + "</p>",
      '    <div class="comment-list">' + commentHtml + "</div>",
      '    <div class="comment-form">',
      '      <input type="text" value="" placeholder="Add a comment...">',
      '      <button type="button">Post</button>',
      "    </div>",
      "  </div>",
      "</article>"
    ].join("");
  }).join("");
}

function renderProfileGrid() {
  var grid = document.getElementById("profile-grid");

  grid.innerHTML = posts.map(function (post) {
    return '<img class="grid-tile" src="' + post.image + '" alt="' + post.place + '">';
  }).join("");
}

function setupSearchMenu() {
  var input = document.getElementById("search-input");
  var menu = document.getElementById("search-menu");

  function openMenu() {
    menu.classList.add("visible");
  }

  function closeMenu() {
    menu.classList.remove("visible");
  }

  input.addEventListener("focus", openMenu);
  input.addEventListener("click", openMenu);
  input.addEventListener("blur", function () {
    window.setTimeout(closeMenu, 120);
  });

  openMenu();
}

function setProfileAvatar() {
  document.getElementById("profile-avatar").innerHTML =
    '<img src="' + portrait("P", "#405e84", "#1c2633") + '" alt="pat avatar">';
}

renderSearchResults();
renderFeed();
renderProfileGrid();
setupSearchMenu();
setProfileAvatar();
