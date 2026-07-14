/* ==========================================================================
   NOW SHOWING — script.js
   Handles: loading movies.xml, rendering ticket cards, genre filtering,
   movie detail lookup, and review-form validation.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     0. Fallback XML (used only if data/movies.xml can't be fetched,
        e.g. when the site is opened directly from disk with file://
        instead of a local server, which blocks fetch of local files).
     ------------------------------------------------------------------ */
  var FALLBACK_XML =
    '<?xml version="1.0" encoding="UTF-8"?><movies>' +
    '<movie id="1"><title>Crimson Vector</title><genre>Action</genre><year>2021</year><rating>8.1</rating><director>Rosa Iyengar</director><runtime>118</runtime><synopsis>A disavowed courier races across three border checkpoints to deliver a data drive that could stop a private militia\'s coup before dawn.</synopsis></movie>' +
    '<movie id="2"><title>Steel Horizon</title><genre>Action</genre><year>2019</year><rating>7.6</rating><director>Marcus Webb</director><runtime>124</runtime><synopsis>An offshore rig crew turns makeshift engineers and welding torches into their only defense when hijackers seize the platform during a storm.</synopsis></movie>' +
    '<movie id="3"><title>Blackout Protocol</title><genre>Action</genre><year>2023</year><rating>8.4</rating><director>Yuki Tanaka</director><runtime>131</runtime><synopsis>When a city-wide power grid is weaponized, a retired hacker is pulled back in to shut it down floor by floor of a besieged tower.</synopsis></movie>' +
    '<movie id="4"><title>Iron Tide</title><genre>Action</genre><year>2017</year><rating>7.2</rating><director>Devon Okafor</director><runtime>109</runtime><synopsis>A salvage diver uncovers a sunken smuggling operation and has forty-eight hours to expose it before the evidence is dredged away for good.</synopsis></movie>' +
    '<movie id="5"><title>Nightfall Run</title><genre>Action</genre><year>2022</year><rating>7.9</rating><director>Priya Nandakumar</director><runtime>115</runtime><synopsis>Two rival getaway drivers are forced into an uneasy alliance to outrun a cartel convoy through a city with the streetlights cut.</synopsis></movie>' +
    '<movie id="6"><title>The Landlord\'s Cat</title><genre>Comedy</genre><year>2020</year><rating>7.0</rating><director>Harriet Sloane</director><runtime>97</runtime><synopsis>A broke musician agrees to cat-sit for his landlord and spirals into chaos trying to hide the pet\'s escalating list of destroyed heirlooms.</synopsis></movie>' +
    '<movie id="7"><title>Reheated Leftovers</title><genre>Comedy</genre><year>2018</year><rating>6.8</rating><director>Tomás Reyes</director><runtime>92</runtime><synopsis>Three estranged siblings are stuck reopening their late father\'s failing diner, and the only recipe that works is honesty.</synopsis></movie>' +
    '<movie id="8"><title>Uncle Marv\'s Wedding</title><genre>Comedy</genre><year>2021</year><rating>7.4</rating><director>Naomi Fitzgerald</director><runtime>101</runtime><synopsis>A family reunion turns into a farce when the groom\'s ex, the caterer, and a runaway peacock all show up at the same lakeside venue.</synopsis></movie>' +
    '<movie id="9"><title>Parking Lot Philosophers</title><genre>Comedy</genre><year>2023</year><rating>7.7</rating><director>Ben Okonkwo</director><runtime>99</runtime><synopsis>Two mismatched mall security guards spend the night shift debating the meaning of life while accidentally foiling a string of petty crimes.</synopsis></movie>' +
    '<movie id="10"><title>Casserole of Doom</title><genre>Comedy</genre><year>2016</year><rating>6.5</rating><director>Linda Park</director><runtime>88</runtime><synopsis>A church potluck competition escalates into an absurd culinary arms race between two rival grandmothers.</synopsis></movie>' +
    '<movie id="11"><title>Paper Lanterns</title><genre>Drama</genre><year>2019</year><rating>8.6</rating><director>Mei Lin Zhou</director><runtime>134</runtime><synopsis>A grandmother and her estranged granddaughter retrace a river journey from decades earlier to finally understand why the family split apart.</synopsis></movie>' +
    '<movie id="12"><title>The Quiet Harbor</title><genre>Drama</genre><year>2022</year><rating>8.3</rating><director>Elias Bergström</director><runtime>127</runtime><synopsis>A fishing town\'s last boatbuilder must decide whether to pass his failing trade to a daughter who has already built a life elsewhere.</synopsis></movie>' +
    '<movie id="13"><title>Autumn in Ostend</title><genre>Drama</genre><year>2020</year><rating>8.0</rating><director>Claire Dubois</director><runtime>121</runtime><synopsis>A retired concert pianist confronts a forgotten rivalry when a former student returns to the coastal town to care for her ailing mother.</synopsis></movie>' +
    '<movie id="14"><title>Letters to No One</title><genre>Drama</genre><year>2015</year><rating>8.5</rating><director>Samuel Okoro</director><runtime>139</runtime><synopsis>A postal worker discovers a decades-old bundle of undelivered letters and sets out to finish the correspondence that fate interrupted.</synopsis></movie>' +
    '<movie id="15"><title>Ninth Floor</title><genre>Drama</genre><year>2023</year><rating>7.8</rating><director>Ana Cristina Reyes</director><runtime>112</runtime><synopsis>Neighbors in a soon-to-be-demolished apartment block spend one final week untangling years of quiet grudges and unspoken kindness.</synopsis></movie>' +
    '<movie id="16"><title>Echelon Drift</title><genre>Science Fiction</genre><year>2021</year><rating>8.2</rating><director>Ingrid Solheim</director><runtime>128</runtime><synopsis>A generation ship\'s navigator discovers the vessel has been quietly recalculating its destination for a hundred years, and no one knows why.</synopsis></movie>' +
    '<movie id="17"><title>The Silence of Europa</title><genre>Science Fiction</genre><year>2018</year><rating>8.7</rating><director>Kenji Watanabe</director><runtime>142</runtime><synopsis>A three-person research outpost beneath Europa\'s ice picks up a signal that shouldn\'t exist, and each crew member hears something different in it.</synopsis></movie>' +
    '<movie id="18"><title>Halcyon Protocol</title><genre>Science Fiction</genre><year>2023</year><rating>7.9</rating><director>Freya Lindqvist</director><runtime>119</runtime><synopsis>An AI caretaker assigned to a dying arcology must decide whether following its directives still counts as protecting the people inside.</synopsis></movie>' +
    '<movie id="19"><title>Ghosts of Proxima</title><genre>Science Fiction</genre><year>2020</year><rating>8.0</rating><director>Diego Alvarez</director><runtime>125</runtime><synopsis>The first colonists to reach Proxima b find abandoned structures that predate humanity\'s arrival by centuries.</synopsis></movie>' +
    '<movie id="20"><title>Recursion Point</title><genre>Science Fiction</genre><year>2022</year><rating>8.5</rating><director>Halima Yusuf</director><runtime>133</runtime><synopsis>A physicist trapped in a looping simulation realizes each iteration is quietly rewriting her memories, and she has only one loop left to notice.</synopsis></movie>' +
    "</movies>";

  /* ------------------------------------------------------------------
     1. XML loading + parsing
     ------------------------------------------------------------------ */
  function parseMoviesXML(xmlText) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, "application/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length) {
      throw new Error("Malformed movies.xml");
    }

    var nodes = xmlDoc.getElementsByTagName("movie");
    var movies = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      movies.push({
        id: node.getAttribute("id"),
        title: getText(node, "title"),
        genre: getText(node, "genre"),
        year: getText(node, "year"),
        rating: getText(node, "rating"),
        director: getText(node, "director"),
        runtime: getText(node, "runtime"),
        synopsis: getText(node, "synopsis")
      });
    }
    return movies;
  }

  function getText(parentNode, tagName) {
    var el = parentNode.getElementsByTagName(tagName)[0];
    return el && el.textContent ? el.textContent.trim() : "";
  }

  // Returns a Promise that resolves to the array of movie objects.
  function loadMovies() {
    return fetch("data/movies.xml")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.text();
      })
      .then(function (text) {
        return parseMoviesXML(text);
      })
      .catch(function () {
        // Local file:// access (or network issue) — use the embedded copy.
        return parseMoviesXML(FALLBACK_XML);
      });
  }

  /* ------------------------------------------------------------------
     2. Genre helpers (shared styling hooks)
     ------------------------------------------------------------------ */
  var GENRE_INFO = {
    "Action": { badge: "badge-action", poster: "poster-action", glyph: "\u25B2" },
    "Comedy": { badge: "badge-comedy", poster: "poster-comedy", glyph: "\u2606" },
    "Drama": { badge: "badge-drama", poster: "poster-drama", glyph: "\u25C6" },
    "Science Fiction": { badge: "badge-scifi", poster: "poster-scifi", glyph: "\u2726" }
  };

  function genreInfo(genre) {
    return GENRE_INFO[genre] || { badge: "badge-drama", poster: "poster-drama", glyph: "\u2605" };
  }

  function initials(title) {
    var words = title.split(/\s+/).filter(Boolean);
    var letters = words.slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); });
    return letters.join("");
  }

  /* ------------------------------------------------------------------
     3. Ticket card rendering (used on Home + All Films pages)
     ------------------------------------------------------------------ */
  function buildTicketCard(movie) {
    var info = genreInfo(movie.genre);

    var article = document.createElement("article");
    article.className = "ticket";
    article.setAttribute("data-genre", movie.genre);

    article.innerHTML =
      '<div class="ticket-poster ' + info.poster + '" aria-hidden="true">' + initials(movie.title) + "</div>" +
      '<div class="ticket-perf" aria-hidden="true"></div>' +
      '<div class="ticket-body">' +
        "<h3>" + escapeHTML(movie.title) + "</h3>" +
        '<div class="ticket-meta">' +
          '<span class="badge ' + info.badge + '">' + escapeHTML(movie.genre) + "</span>" +
          "<span>" + escapeHTML(movie.year) + "</span>" +
        "</div>" +
        '<div class="ticket-footer">' +
          '<span class="rating">\u2605 ' + escapeHTML(movie.rating) + "</span>" +
          '<a href="movie-detail.html?id=' + encodeURIComponent(movie.id) + '">View details<span class="visually-hidden"> for ' + escapeHTML(movie.title) + "</span></a>" +
        "</div>" +
      "</div>";

    return article;
  }

  function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------
     4. Home page: featured movies strip
     ------------------------------------------------------------------ */
  function initHomeFeatured() {
    var container = document.getElementById("featured-movies");
    if (!container) return;

    loadMovies().then(function (movies) {
      // One pick per genre, then fill up to 8 with the highest-rated remaining.
      var byGenre = {};
      movies.forEach(function (m) {
        if (!byGenre[m.genre]) byGenre[m.genre] = [];
        byGenre[m.genre].push(m);
      });

      var featured = [];
      Object.keys(byGenre).forEach(function (g) {
        byGenre[g].sort(function (a, b) { return parseFloat(b.rating) - parseFloat(a.rating); });
        featured.push(byGenre[g][0]);
        if (byGenre[g][1]) featured.push(byGenre[g][1]);
      });

      container.innerHTML = "";
      featured.slice(0, 8).forEach(function (movie) {
        container.appendChild(buildTicketCard(movie));
      });
    }).catch(function () {
      container.innerHTML = '<p class="error-msg">Films could not be loaded right now. Please try again shortly.</p>';
    });
  }

  /* ------------------------------------------------------------------
     5. All Films page: full grid + genre filtering
     ------------------------------------------------------------------ */
  function initAllFilms() {
    var grid = document.getElementById("movie-grid");
    if (!grid) return;

    var statusEl = document.getElementById("results-status");
    var filterButtons = document.querySelectorAll(".filter-bar button");
    var params = new URLSearchParams(window.location.search);
    var initialGenre = params.get("genre") || "All";

    var allMovies = [];

    function render(genre) {
      var filtered = genre === "All" ? allMovies : allMovies.filter(function (m) { return m.genre === genre; });

      grid.innerHTML = "";

      if (filtered.length === 0) {
        var empty = document.createElement("div");
        empty.className = "empty-state";
        empty.setAttribute("role", "status");
        empty.textContent = "No films found in this genre yet. Try another category.";
        grid.appendChild(empty);
      } else {
        filtered.forEach(function (movie) {
          grid.appendChild(buildTicketCard(movie));
        });
      }

      if (statusEl) {
        statusEl.textContent = filtered.length + " film" + (filtered.length === 1 ? "" : "s") +
          (genre === "All" ? " across all genres" : " in " + genre);
      }

      filterButtons.forEach(function (btn) {
        var isActive = btn.getAttribute("data-genre") === genre;
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var genre = btn.getAttribute("data-genre");
        render(genre);
        // Keep the URL shareable/bookmarkable without a full reload.
        var url = new URL(window.location.href);
        if (genre === "All") {
          url.searchParams.delete("genre");
        } else {
          url.searchParams.set("genre", genre);
        }
        window.history.replaceState({}, "", url);
      });
    });

    grid.setAttribute("aria-busy", "true");
    loadMovies().then(function (movies) {
      allMovies = movies;
      grid.setAttribute("aria-busy", "false");
      var validGenres = ["All", "Action", "Comedy", "Drama", "Science Fiction"];
      render(validGenres.indexOf(initialGenre) !== -1 ? initialGenre : "All");
    }).catch(function () {
      grid.innerHTML = '<p class="error-msg">Films could not be loaded right now. Please try again shortly.</p>';
    });
  }

  /* ------------------------------------------------------------------
     6. Movie detail page
     ------------------------------------------------------------------ */
  function initMovieDetail() {
    var mount = document.getElementById("detail-mount");
    if (!mount) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");

    loadMovies().then(function (movies) {
      var movie = movies.filter(function (m) { return m.id === id; })[0];

      if (!movie) {
        mount.innerHTML =
          '<p class="error-msg">We couldn\'t find that film. It may have left our catalog.</p>' +
          '<a class="btn btn-outline" href="movies.html">Back to All Films</a>';
        document.title = "Film not found | NOW SHOWING";
        return;
      }

      var info = genreInfo(movie.genre);
      document.title = movie.title + " | NOW SHOWING";

      mount.innerHTML =
        '<p class="breadcrumb"><a href="index.html">Home</a> / <a href="movies.html">All Films</a> / <span aria-current="page">' + escapeHTML(movie.title) + "</span></p>" +
        '<div class="detail-layout">' +
          '<div class="detail-poster ' + info.poster + '" aria-hidden="true">' + initials(movie.title) + "</div>" +
          '<div class="detail-card">' +
            "<h1>" + escapeHTML(movie.title) + "</h1>" +
            '<div class="detail-meta-row">' +
              '<span class="badge ' + info.badge + '">' + escapeHTML(movie.genre) + "</span>" +
              '<span class="rating">\u2605 ' + escapeHTML(movie.rating) + " / 10</span>" +
            "</div>" +
            '<dl class="detail-facts">' +
              "<div><dt>Release year</dt><dd>" + escapeHTML(movie.year) + "</dd></div>" +
              "<div><dt>Runtime</dt><dd>" + escapeHTML(movie.runtime) + " min</dd></div>" +
              "<div><dt>Director</dt><dd>" + escapeHTML(movie.director) + "</dd></div>" +
              "<div><dt>Genre</dt><dd>" + escapeHTML(movie.genre) + "</dd></div>" +
            "</dl>" +
            '<hr class="detail-divider" aria-hidden="true">' +
            '<p class="synopsis">' + escapeHTML(movie.synopsis) + "</p>" +
            '<div class="detail-actions">' +
              '<a class="btn btn-primary" href="form.html?movie=' + encodeURIComponent(movie.title) + '">Write a review</a>' +
              '<a class="btn btn-outline" href="movies.html">Back to All Films</a>' +
            "</div>" +
          "</div>" +
        "</div>";
    }).catch(function () {
      mount.innerHTML = '<p class="error-msg">Something went wrong loading this film. Please try again shortly.</p>';
    });
  }

  /* ------------------------------------------------------------------
     7. Review form: populate movie select + validate on submit
     ------------------------------------------------------------------ */
  function initReviewForm() {
    var form = document.getElementById("review-form");
    if (!form) return;

    var movieSelect = document.getElementById("movie-select");
    var successBanner = document.getElementById("form-success");

    loadMovies().then(function (movies) {
      movies
        .slice()
        .sort(function (a, b) { return a.title.localeCompare(b.title); })
        .forEach(function (movie) {
          var opt = document.createElement("option");
          opt.value = movie.title;
          opt.textContent = movie.title + " (" + movie.year + ")";
          movieSelect.appendChild(opt);
        });

      // Pre-select a movie if the page was reached from a detail page.
      var params = new URLSearchParams(window.location.search);
      var preselect = params.get("movie");
      if (preselect) {
        var match = Array.prototype.slice.call(movieSelect.options).filter(function (o) { return o.value === preselect; })[0];
        if (match) movieSelect.value = preselect;
      }
    });

    var validators = {
      "reviewer-name": function (value) {
        return value.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters).";
      },
      "reviewer-email": function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value.trim()) ? "" : "Please enter a valid email address.";
      },
      "movie-select": function (value) {
        return value ? "" : "Please choose which film you're reviewing.";
      },
      "review-rating": function () {
        var checked = form.querySelector('input[name="review-rating"]:checked');
        return checked ? "" : "Please choose a star rating.";
      },
      "review-text": function (value) {
        return value.trim().length >= 15 ? "" : "Reviews need at least 15 characters so other visitors get real detail.";
      }
    };

    function showFieldError(fieldId, message) {
      var row = document.getElementById(fieldId).closest(".form-row");
      var errorEl = document.getElementById(fieldId + "-error");
      if (message) {
        row.classList.add("invalid");
        if (errorEl) errorEl.textContent = message;
      } else {
        row.classList.remove("invalid");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function validateField(fieldId) {
      var field = document.getElementById(fieldId);
      var value = field.type === "radio" ? "" : field.value;
      var message = validators[fieldId] ? validators[fieldId](value) : "";
      showFieldError(fieldId, message);
      return message === "";
    }

    ["reviewer-name", "reviewer-email", "movie-select", "review-text"].forEach(function (fieldId) {
      var field = document.getElementById(fieldId);
      field.addEventListener("blur", function () { validateField(fieldId); });
      field.addEventListener("input", function () {
        if (document.getElementById(fieldId).closest(".form-row").classList.contains("invalid")) {
          validateField(fieldId);
        }
      });
    });

    form.querySelectorAll('input[name="review-rating"]').forEach(function (radio) {
      radio.addEventListener("change", function () { validateField("review-rating"); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var fieldsValid = [
        validateField("reviewer-name"),
        validateField("reviewer-email"),
        validateField("movie-select"),
        validateField("review-rating"),
        validateField("review-text")
      ];

      var allValid = fieldsValid.every(Boolean);

      if (!allValid) {
        successBanner.classList.remove("visible");
        var firstInvalid = form.querySelector(".form-row.invalid input, .form-row.invalid select, .form-row.invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      successBanner.textContent = "Thanks! Your review of \u201c" + movieSelect.value + "\u201d has been submitted.";
      successBanner.classList.add("visible");
      successBanner.setAttribute("tabindex", "-1");
      successBanner.focus();
      form.reset();
    });
  }

  // Small helper since not all browsers had Element.closest early on.
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var el = this;
      while (el) {
        if (el.matches && el.matches(selector)) return el;
        el = el.parentElement;
      }
      return null;
    };
  }

  /* ------------------------------------------------------------------
     8. Boot
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initHomeFeatured();
    initAllFilms();
    initMovieDetail();
    initReviewForm();
  });
})();
