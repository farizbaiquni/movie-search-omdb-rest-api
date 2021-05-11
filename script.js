const divContent = document.querySelector('#content')
const divModal = document.querySelector('#modal')

//================================ AJAX ================================
async function fetchMoviesData(title){
    const response = await fetch("http://www.omdbapi.com/?apikey=28220618&s=" + title)
    if(!response.ok){
        return alert("Something Wrong... Error")
    }
    return await response.json()
}

async function fetchMovieDetail(imdbId){
    const response = await fetch('http://www.omdbapi.com/?apikey=28220618&p=full&i=' + imdbId)
    return await response.json()

}

//================================ ENTER INPUT SEARCH ================================
document.querySelector('#input-keyword').addEventListener('keyup', function(event){
    let html = '';
    if(event.key === "Enter"){
        divContent.innerHTML = ''
        fetchMoviesData(this.value).then(response => {
            response.Search.map(data => {
                divContent.insertAdjacentHTML("beforeend", templatingCardMovie(data))
                divModal.insertAdjacentHTML("beforeend", templatingModalMovie(data))
            })
        })
    }  
})


//================================ CLICK DETAIL BUTTON ================================
function clickDetailButton(element){
    movieId = element.getAttribute("data-imdbId")
    if(document.querySelector(`#contentModal${movieId} > .modal-content`) == null){
        fetchMovieDetail(movieId).then(data => { 
            document.querySelector(`#contentModal${data.imdbID}`).insertAdjacentHTML('beforeend', templatingModalMovieContent(data))
        })
    }
}



// =================================== TEMPLATING ===================================

function templatingCardMovie(movies){
    return `<div class="col-sm mb-3">
          <div class="card h-10 h-100" style="width:18rem; background-color : #383838; color : #E8E8E8;">
              <img src="${movies.Poster}" class="card-img-top h-100" alt="..." style="object-fit: cover">
              <div class="card-body" style ="position: relative">
                  <p style="font-size: medium;">${movies.Year} | ${movies.Type}</p>
                  <h5 class="card-title" style="font-size: large; line-height: 1;">${movies.Title}</h5>
                  <br/>
                  <button href="#" class="btn text-white buttonDetail" style="background-color:#A00000; font-weight: bold;" data-bs-toggle="modal" data-bs-target="#${movies.imdbID}" data-imdbId=${movies.imdbID} onclick="clickDetailButton(this)">Detail</button>
              </div>
          </div>
      </div>
    `
}

function templatingModalMovie(movies){
    return `
        <div class="modal fade" id="${movies.imdbID}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" id="contentModal${movies.imdbID}">
            </div>
        </div>
    `
}


function templatingModalMovieContent(movies){
    let genreButton = ''
    movies.Genre.split(', ').map(genre => genreButton+=`<button class="btn-sm" style="background-color: #880000; font-weight: bold; border-radius: 10px; color: #F5F5F5; margin-right: 5px;">${genre}</button>`)
    return `
        <div class="modal-content">
        <div class="modal-body" style="display: flex;">
        <img src="${movies.Poster}" class="card-img-top" style="width: 300px;" alt="...">
        <div style="display: flex; flex-direction: column; padding: 0 15px">
            <p style="font-size: small; line-height: 1;">   
            ${genreButton} 
            </p>
            <h5 class="card-title" style="font-size: large; line-height: 1;">${movies.Title}</h5>
            <p class="card-text mt-3" style="font-size: medium; line-height: 1;">${movies.Plot}</p>
            <p style="font-size: medium; line-height: 1;"> Duration : ${movies.Runtime} min | Year : ${movies.Year} | Type : ${movies.Type}</p>
            <p style="font-size: medium; line-height: 1;"> Actor : ${movies.Actors}</p>
        </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn text-white" style="background-color:#A00000; font-weight: bold;" data-bs-dismiss="modal">Close</button>
        </div>
    </div>
    `
}

