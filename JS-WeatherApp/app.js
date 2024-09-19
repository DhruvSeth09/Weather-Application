const userTab=document.querySelector("[data-user-weather]");
const searchTab=document.querySelector("[data-search-weather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// initially variables need

let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(clickedTab){
    notFound.classList.remove("active");
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        clickedTab.classList.add("current-tab");
        currentTab=clickedTab;

        if(!searchForm.classList.contains("active")){
             //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
             //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
             //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUseWeatherInfo(coordinates);
    }
}

// const notFound=document.querySelector(".not-img");


const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

async function fetchUseWeatherInfo(coordinates) {
    const{lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        displayWeatherInfo(data);
    }
    catch(err){
    //     loadingScreen.classList.remove("active");
    //      userInfoContainer.classList.remove("active");
    // grantAccessContainer.classList.remove("active");
    // notFound.classList.add("active");
    loadingScreen.classList.remove('active');
    notFound.classList.add('active');
    errorImage.style.display = 'none';
    errorText.innerText = `${err?.message}`;
    errorBtn.style.display = 'flex';
    errorBtn.addEventListener("click", fetchUseWeatherInfo);
    }
}

function displayWeatherInfo(weatherInfo){
    //display weather info here
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");

    // fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessBtn=document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener('click',getLocation)

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position);
    }
    else{
        console.error("Geolocation is not supported by your browser");
    }
}

function position(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));;
    fetchUseWeatherInfo(userCoordinates);
}

// const grantAccessButton = document.querySelector("[data-grantAccess]");
// grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})



async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        displayWeatherInfo(data);
    }
    catch(err) {
        // loadingScreen.classList.remove('active');
        // userInfoContainer.classList.remove('active');
        // notFound.classList.add('active');
        // errorText.innerText = `${err?.message}`;
        // errorBtn.style.display = "flex";
        // errorBtn.addEventListener("click", fetchUseWeatherInfo);
        loadingScreen.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = 'flex';
        errorBtn.addEventListener("click",switchTab);
    }
}
