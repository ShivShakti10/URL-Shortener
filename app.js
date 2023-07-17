const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const shortid = require("shortid");
const app = express();

const PORT = process.env.PORT || 5001 ;

app.set( "view engine" , "ejs" );

const url = process.env.MONGODB_URL ;

mongoose.connect(url).then(() =>{
    console.log("Connection Successfull");
}).catch((err) =>{
    console.log(err);
});

const UrlSchema = new mongoose.Schema({
    fullurl:{
        type : "string",
        required : true,
        unique: true,
        index: true,
        sparse: true
    },

    shorturl:{
        type : "string",
        required : true,
        unique: true,

    }


});

const URL = mongoose.model("URL",UrlSchema );

app.use(express.urlencoded({extended : false}));


app.get("/",(req,res) =>{
    res.send("Welcome to URL Shortener");
})

app.get("/urlshortener", (req, res) =>{
    res.render("index");
})

app.post("/urlshortener",async (req, res) =>{

    let url =await req.body.url;
    
    if(!url){
        console.log("No url found")
    }
    else{
         URL.findOne({fullurl:url})
          .then(user=>{
          
            if(user) {console.log("URL already exists");
            res.redirect("/urlshortener");



        } else{
            var shortID = shortid(url);

        let newURL = new URL({
            fullurl:url,
            shorturl:shortID,
            
        })

          newURL.save()
        .then(()=>{
            res.send(`Short URL generated:: localhost:5001/:${shortID}`);
        }).catch((err)=>{
            console.log(err)
        })

        console.log(shortID);
        }
        })
        
    }
});

app.get("/:shorturl" , async(req, res) =>{
    let shorturl = req.params.shorturl;

    const entry = await URL.findOne({
        shorturl
    })

    res.redirect(entry.fullurl);
})



app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`);
})