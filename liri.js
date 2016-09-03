
//Global Variables 
var fs = require('fs');
var keys = require('./key.js');
var action = process.argv[2];
var value = process.argv[3];
var colors = require('colors/safe');
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');

//Functions 
//Twitter

 function twitter() {

     var client = new Twitter({
         consumer_key: keys.twitterKeys.consumer_key,
         consumer_secret: keys.twitterKeys.consumer_secret,
         access_token_key: keys.twitterKeys.access_token_key,
         access_token_secret: keys.twitterKeys.access_token_secret
     });

     var params = { screen_name: 'bho223289', count: 21 };
     client.get('statuses/user_timeline', params, function(error, tweets, response) {
         if (!error) {

         	//grabs 20 tweets and displays the tweet text, tweet number,and timestamp	
             for (i = 1; i < 21; i++) {
             	var tweetTxt = tweets[i].text;
             	var tweetCreated = tweets[i].created_at;
             	var tweetDetails = function(){

             	 //logs tweet on terminal	
             	 console.log('TWEET#' + i);
                 console.log(colors.yellow(tweets[i].text));
                 console.log(tweets[i].created_at);
                 console.log(colors.green('================='));
             	}//end var detail

             	tweetDetails();

             	//this will push all the tweets onto log when i call it on command line
                 fs.appendFile('log.txt', "TWEET #" + i + ": \r" 
                 	+ tweetTxt + "\r" + tweetCreated + "\r\r");
             }//end for loop

         } else {
             console.log('error');
         } //end if else

     }); //end getting tweets

 }//end twitter

//=====Movies======


function movies(){
	request('http://www.omdbapi.com/?t='+ value +'&y=&plot=short&r=json', function (error, response, body) {
	 if (!error && response.statusCode == 200) {

	   var json = JSON.parse(body);
	   console.log("Title: "+ json.Title);
	   console.log("Release Year: "+json.Year);
	   console.log("Release Year: "+json.Country);
	   console.log("Release Year: "+json.Language);
	   console.log("Release Year: "+json.Plot);
	   console.log("Release Year: "+json.Actors);
	   console.log("imbd rating: "+json.imdbRating); 

       //this will push all the movies onto log when i call it on command line
       fs.appendFile('log.txt', "Movie: " + json.Title + "\r" 
     	+ "Country: " + json.Country + " \r" + "Language: "  + json.Language + "\r" + "Plot: "+ json.Plot + "\r" + 
		"Actors: " +json.Actors + "\r" + "Rating: " + json.imdbRating + "\r\r");
	 }
	})//end request
}//end movies

//Spotify

function spotifySong(){

	spotify.search({ type: 'track', query: value }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	    	var songInfo = data.tracks.items[0];
	    	// var songResult = console.log(songInfo.artists[0].name);
	    	console.log(colors.yellow('Result:'));
	    	console.log(songInfo.name);
	    	console.log(songInfo.artists[0].name);
	    	console.log(songInfo.album.name);
	    	console.log(songInfo.preview_url);
	    }

	                 	//this will push all the tweets onto log when i call it on command line
                 fs.appendFile('log.txt', "SONG:" + songInfo.name + " \r" + "Artist: "
                 	+ songInfo.artists[0].name + "\r" + "Album: " + songInfo.album.name + "\r" + "URL: " +songInfo.preview_url +"\r\r");
	    
	}); 	//end spotify function	
} //end Spotify song


//----Switch Function to read arguments passed in command line-----//

switch (action) {
//========Twitter ===========	
    case 'twitter':

		twitter();
		

    	break;

//=========Spotify ===========
    case 'spotify-this-song':

	//check to see if there is a value for song name
		if(value){
			spotifySong();
		}else{
			//if no input for song name, defaults to adele
			value = "hello";
			spotifySong(value);
		}	

    	break;

       
    case 'movie-this':

		movies();

        break;

//=========Do this!=========== 
    case 'do-what-it-says':
        //do what it says
		function doIt() {
		    fs.readFile('random.txt', "utf8", function(err, data) {
		    	//reassigns so that this equals the process.arg value assignments
		        data = data.split(',');
		        input = data[0];
		        value = data[1];
		        

		        if (input === "twitter"){
		        	twitter();
		        }else if(input === "spotify-this-song"){
		        	spotifySong();
		        }else if(input === "movie-this"){
		        	movies();
		        }else{
		        	console.log('I\'m sorry, I don\'t know what you are looking for');
		        }
  			
  				  //this will push all the tweets onto log when i call it on command line
                 fs.appendFile('log.txt', "What's in log.txt: " + data + "\r");
		    }); //end read file
		}//end do it function

		doIt();

        break;
} //end switch