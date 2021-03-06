let submitBtn = $("#submitBtn");
let songIdList = [];
let songContainer = $("#songContainer");
let saveBtn = $("#saveBtn");


function getToken(userGenre, userLength, userTempo) {
  const clientId = "4c2b7382b83842179f3780349cc8b6a6";
  const clientSecret = "7a5ae8c0d13d415a9e477549ba0cfb7b";
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      fetch(
        `https://api.spotify.com/v1/recommendations?limit=${userLength}&market=ES&seed_genres=${userGenre}&${userTempo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer  " + data.access_token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          showUserSelection (userGenre, userTempo);
          for (i = 0; i < data.tracks.length; i++) {
            songIdList.push(data.tracks[i].id);
          }
          showSongs();

          if (data.tracks.length < userLength) {
            showLengthMessage(userLength);
          }
        });
    });
}

function setGenre(sel){
  globalThis.selectedGenre = (sel.options[sel.selectedIndex].text);
}

function setEnergy(sel){
  globalThis.selectedEnergy = (sel.options[sel.selectedIndex].text);
}


function showUserSelection () {
  $("#lengthMessage").append(
    `<div>You chose ${selectedEnergy} ${selectedGenre}</div>`
  );
}

function showSongs() {
  for (i = 0; i < songIdList.length; i++) {
    $("#songContainer").append(
      `<li><iframe id="songPlayer" src="https://open.spotify.com/embed/track/${songIdList[i]}" width="300" height="100" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></li>`
    );
  }
}

$(document).ready(function () {
  getSavedPlaylist();

  $("#submitBtn").click(function (event) {
    event.preventDefault();
    let userGenre = $("#inlineFormCustomSelectPrefone").val();
    let userLength = $("#inlineFormCustomSelectPrefthree").val();
    let userTempo = $("#inlineFormCustomSelectPreftwo").val();
    $("#songContainer").text("");
    songIdList = [];
    getToken(userGenre, userLength, userTempo);
    $("#lengthMessage").text("");
    $("#form").addClass("d-n");
    $("#createNewBtn").removeClass("d-n");
    $("#saveBtn").removeClass("d-n");
    $("#clearBtn").removeClass("d-n");
  });
});

function showLengthMessage(userLength) {
  $("#lengthMessage").append(
    `<div>There are less than ${userLength} songs that match your criteria!</div>`
  );
}

$("#saveBtn").on("click", savePlaylist);
$("#clearBtn").on("click", clearPlaylist);
$("#createNewBtn").on("click", showForm);

function showForm() {
  $("#form").removeClass("d-n");
  hideButton();
}

function hideButton() {
  $("#createNewBtn").addClass("d-n");
}

function savePlaylist(event) {
  event.preventDefault();
  let savedPlaylist = songIdList;
  localStorage.setItem("playlist", JSON.stringify(savedPlaylist));
}

function getSavedPlaylist() {
  let oldSavedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
  if (oldSavedPlaylist.length > 0) {
    for (i = 0; i < oldSavedPlaylist.length; i++) {
      $("#songContainer").append(
        `<li><iframe id="songPlayer" src="https://open.spotify.com/embed/track/${oldSavedPlaylist[i]}" width="300" height="100" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></li>`
      );
    }
    $("#clearBtn").removeClass("d-n");
  } else {
    for (i = 0; i < oldSavedPlaylist.length; i++) {
      $("#songContainer").append(
        `<li><iframe id="songPlayer" src="https://open.spotify.com/embed/track/${oldSavedPlaylist[i]}" width="300" height="100" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></li>`
      );
    }
  }
}

function clearPlaylist(event) {
  event.preventDefault();
  localStorage.clear();
  songIdList = [];
  $("#songContainer").text("");
  $("#lengthMessage").text("");
  $("#saveBtn").addClass("d-n");
  $("#clearBtn").addClass("d-n");
}
