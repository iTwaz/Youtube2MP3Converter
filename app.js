//Les packages requis
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//Créé le serveur express
const app = express();

//Le port du serveur
const PORT = process.env.PORT || 3000;

//Set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//needed to parse html data for POST request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoID;
    if(
        videoId === undefined ||
        videoId === "" ||
        videoId === null
    ){
        return res.render("index", {success : false, message : "Veuillez mettre l'id de votre vidéo"});
    }else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if(fetchResponse.status === "ok") {
            return res.render("index", {success : true, song_title: fetchResponse.title, song_link: fetchResponse.link});
        
                    
        }else
            return res.render("index", {success : false, message : fetchResponse.message});
    }
})

//Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur à démarrer sous le port ${PORT}`);
})
