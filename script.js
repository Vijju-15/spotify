let currentsong = new Audio();
let songs;
let currfolder;
async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3001/${folder}/`);
  let resp = await a.text();
  let div = document.createElement("div");
  div.innerHTML = resp;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1])
      console.log(element.href.split(`${folder}/`)[1]);
    }
  }
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
  for (const song of songs) {
    songUl.innerHTML += `<li> 
            <img class="invert" src="music.svg" alt="icon" />
            <div class="info">
              <div>${song.replaceAll("%20"," ")}</div>
              <div>Pavan</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="Play1.svg" alt="play" />
            </div>
             </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playsong(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playsong = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play();
    playy.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function albums(){
  let a = await fetch(`http://127.0.0.1:3001/songs/`);
  let resp = await a.text();
  let div = document.createElement("div");
  div.innerHTML = resp;
  let anchors = div.getElementsByTagName("a")
  Array.from(anchors).forEach(e=>{
    console.log(e.href.split("/").slice(-2)[0])
  })
  return songs
}
async function main() {
  albums()
  await getsongs("songs/modern");
  playsong(songs[0], true);

  var audio = new Audio(songs[0]);

  playy.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      playy.src = "pause.svg";
    } else {
      currentsong.pause();
      playy.src = "play.svg";
    }
  });
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentsong.currentTime
    )}
    /${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".ham").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  previous.addEventListener("click", () => {
    currentsong.pause();
    console.log("Previous Clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playsong(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    currentsong.pause();
    console.log("Next Clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length - 1) {
      playsong(songs[index + 1]);
    }
  });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("setting volume to", e.target.value, "/100");
      currentsong.volume = parseInt(e.target.value) / 100;
    });
}
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    })
})




main();