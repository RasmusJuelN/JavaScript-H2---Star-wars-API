const SWAPIAPIURL = "https://swapi.dev/api/"

const menuBar = document.querySelector(".menuBar");
let cardId = 0;

fetch(SWAPIAPIURL)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    
    

    for (let key in data) {
        let menuItem = document.createElement("a");
        menuItem.className = "menuItem";
        menuItem.innerText = key;
        menuItem.href = data[key];
        menuItem.addEventListener("click", menuClick);
        menuBar.appendChild(menuItem);
    }
})
.catch(function (err) {
    console.log(err);
});

function menuClick(e) {
    e.preventDefault();
    document.querySelector(".active")?.classList.remove("active")
    e.target.classList.add("active");

    fetch(e.target.href)
        .then( response => {
            return response.json();
        })
        .then( data => {
            showData(data);
        })
}


function showData(data) {
    let content = document.querySelector(".content");
    clearContent(content);
    data.results.forEach(item => {
        let card = document.createElement("div");
        card.className = "card"
        cardId++;
        // sorterer de data fra jeg ikke vil vise
        for(const key in item) {
            if(typeof item[key] === "object" || key === "homeworld" || key === "created" || key === "edited" || key === "skin_color") {
                continue;
            }
            
            if(key === "url")
            {
            // giver værdi +1 hver gang den looper igennem keys
            let url = SWAPIAPIURL + "people/" + cardId;
            card.dataset.url = url;
            card.classList.add("clickable");
            card.dataset.url = item[key];
            card.addEventListener("click", async() => {
                const data = await getDataFromURL(card.dataset.url)
                showUserData(data)
            });
            }
            
            let p = document.createElement("p");
            p.className = "cardLine";
            p.innerHTML = "<span class='key-style'>"+key+"</span>" + ": " + item[key];

           

            card.appendChild(p);
        }                
        content.appendChild(card)               
    });
    document.querySelector(".headline")?.remove("headline");
}



function showUserData(item) {
    let content = document.querySelector(".content");
    const card = document.createElement("div");
    card.className = "card";
    card.classList.add("user-card")
    // looper gennem keys i item, og tjekker om en key er et array
    for(key in item) {    
        if(Array.isArray(item[key])){             
            let ul = document.createElement("ul");
            ul.className = "ul";
            ul.innerHTML = "<span class='key-style'>"+key+"</span>" + ":"
            card.appendChild(ul);
            
            for (const i of item[key]) {
                let li = document.createElement("li");
                li.className = "li";
                li.innerHTML = i;
                ul.appendChild(li);
            }
        }
        // fjerner de resterende objekter så de ikke vises to gange
        if(typeof item[key] === "object" ){
            continue;
        }
        // tilføjer p til card og viser data i card.
        let p = document.createElement("p");
        p.className = "cardLine";
        p.innerHTML = "<span class='key-style'>"+key+"</span>" + ": " + item[key];          
        card.appendChild(p);
    
        clearContent(content);         
        content.appendChild(card)
    document.querySelector(".headline")?.remove("headline");
}
}


function clearContent(elm){
    while (elm.firstChild){
        elm.removeChild(elm.firstChild);
    }
}

async function getDataFromURL(url) {
    const response = await fetch(url);
    return await response.json();
}
