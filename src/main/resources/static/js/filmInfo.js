import axiosOMDBConfig from './axiosOMDBConfig.js';
import axiosConfig from './axiosConfig.js';

function getCertImg(filmCert) {
    //console.log(filmCert.toUpperCase());
    let certImg = document.getElementById("filmCertImg");
    switch(filmCert.toUpperCase()) {
        case "PG":
            console.log("1");
            certImg.src = "./assets/classPG.png";
            break;
        case "U":
            console.log("2");
            certImg.src = "./assets/classU.png";
            break;
        case "12":
            console.log("3");
            certImg.src = "./assets/class12.png";
            break; 
        case "12A":
            certImg.src = "./assets/class12a.png";
            break;
        case "15":
            certImg.src = "./assets/class15.png";
            break;
        case "18":
            certImg.src = "./assets/class18.png";
            break;
    }
    return;
}

function screenTimes(filmID){


    console.log(filmID);
    axiosConfig.get("/getAllStandardScreens")
        .then(response => {
            for (let i = 0; i < response.data.length; i++){
                if (response.data[i].films.filmsID == filmID){
                    let date = new Date(response.data[i].standardScreenDate);
                    let trueDate = date.toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric"});
                    let time = response.data[i].standardScreenScreeningTime;
                    let minutes = Math.round((time % 1)* 100);
                    if (minutes < 10) { minutes = "0" + minutes;}
                    let trueTime = "" + (Math.floor(time)) + ":" + minutes;
                    let output = trueDate + " @ " + trueTime;
                    let screenDiv = document.getElementById("standardScreen");
                    let p1 = document.createElement("p");
                    p1.innerHTML = output;
                    screenDiv.appendChild(p1);
                }
            }
        })
        .catch(error => {

        })
    
    axiosConfig.get("/getAllDeluxeScreens")
        .then(response => {
            //console.log(response);
            for (let i = 0; i < response.data.length; i++){
                if (response.data[i].films.filmsID == filmID){
                    console.log(response.data[i]);
                    let date = new Date(response.data[i].deluxeScreenDate);
                    let trueDate = date.toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric"});
                    console.log(trueDate);
                    let time = response.data[i].deluxeScreeningTime;
                    console.log(time);
                    let minutes = Math.round((time % 1)* 100);
                    if (minutes < 10) { minutes = "0" + minutes;}
                    let trueTime = "" + (Math.floor(time)) + ":" + minutes;
                    console.log(trueTime);
                    let output = trueDate + " @ " + trueTime;
                    console.log(output);
                    let screenDiv = document.getElementById("deluxeScreen");
                    let p1 = document.createElement("p");
                    p1.innerHTML = output;
                    screenDiv.appendChild(p1);
                }
            }
        })
        .catch(error => {

        })
}

function pageSetup(allOMDBInfo, allFilmInfo) {

    let ticketsButton = document.getElementById("filmTicketsButton");
    ticketsButton.href = "./bookingTickets.html?id=" + allFilmInfo.filmsID;
    //console.log(allOMDBInfo);
    //console.log(allFilmInfo);
    let title = document.getElementById("filmInfoTitle");
    title.innerHTML = allOMDBInfo.Title;
    let img1 = document.getElementById("filmPoster");
    img1.src = 'http://img.omdbapi.com/?i=' + allOMDBInfo.imdbID + '&h=600&apikey=f20b5cf1';
    let plot = document.getElementById("filmPlot");
    plot.innerHTML = allOMDBInfo.Plot;
    getCertImg(allFilmInfo.filmsClassification);

    let actor = document.getElementById("actorsInfo");
    let director = document.getElementById("directorInfo");
    let genre = document.getElementById("genreInfo");
    let date = document.getElementById("dateInfo");
    let runtime = document.getElementById("runtimeInfo");
    let rating = document.getElementById("imdbRatingInfo");

    actor.innerHTML = "Actors: " + allOMDBInfo.Actors;
    director.innerHTML = "Director: " + allOMDBInfo.Director;
    genre.innerHTML = "Genre: " + allOMDBInfo.Genre;
    date.innerHTML = "Release Date: " + allOMDBInfo.Released;
    runtime.innerHTML = "Runtime: " + allOMDBInfo.Runtime;
    rating.innerHTML = "IMDB Rating: " + allOMDBInfo.imdbRating;

    screenTimes(allFilmInfo.filmsID);
}

function OnStartUp() {
    const mainSection = document.getElementById("MainPage");

    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const filmOMDBID = urlParams.get('omdbid');
    const filmID = urlParams.get('id');
    console.log(filmOMDBID);

    axiosOMDBConfig.get("/?i=" + filmOMDBID + "&plot=full&apikey=f20b5cf1")
        .then(response => {
            //console.log(response.data);

            axiosConfig.get(`/getFilmsById/${filmID}`)
                .then(response2 => {
                    //console.log(response.data);
                    pageSetup(response.data, response2.data);
                })
                .catch(error => {
                    console.log()
                });

        })
        .catch(error => {
            console.log(error);
        });
}

window.onload = OnStartUp();