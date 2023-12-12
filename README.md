# Kenzie MERN Starter Template

## Sources

Tim 1:1
Cody 

## Project Plan Intermediate Challenge

1. Move album collection data into MongoDB database
   -using postman add each album to mongoDB
   -remove albumId from album schema
   -in displayAlbums.jsx change all instances of `albumId` to `_id` so that you are now grabing the object id provided by mongoDB
   -remove ablumgDB.js file
   -in HomePage.jsx change `useApiFetch("/sample")` to `useApiFetch("/albums")`
   -in app.js on server side change change `app.use(keys.app.apiEndpoint, router)` to `app.use(keys.app.apiEndpoint, albumRouter)`
   -create an POST endpoint in albumRouter with `"/albums"`path with an async handler function that has `req` and `res` arguments.
     -inside a try/catch:
       -create a variable to store the request data from `req.body`
       -create a variable to store a new album in the db using the create method pausing execution with await because it's an async execution
       -send 201 response if successful and convert new album to JSON `json(newAlbum)`
       -500 response and error message 

2. Have albums displayed alpabetically by title
   -update existing GET endpoint
    -path to endpoint of `"/albums"` with an async handler function that has `req` and `res` arguments.
    -inside a try/catch:
       -create variable `albums` to retrieve album collection using `find()` and sorting in ascending order with `1` by `albumTitle`, pausing execution with await.
       -send 200 response if successful and convert retrieved albums to JSON `json(albums)`
       -500 response and error message 

## Reflection Intermediate

I could have used something like the `seedDatabase()` in snippets to store my collection of albums in MongoDB instead of manually using Postman's POST request. Two advantages of seeding are that it's quicker to populate rather than manually adding each entry through Postman and it provides a reproducible set of data for testing. A disadvantage of seeding is that it could become outdated if data model structure changes. I chose to not seed because I was dealing with a small amount of POST entries and wanted more practice with Postman and wanted the system to catch any errors I could make.

## Project Plan Basic

1. Design a data model for a collection of vinyl record albums. Create file in models folder for moongoose schema.
   -title property with attributes type is string, unique is true required is true
   -releaseYear property with attributes type is string, required is true
   -artistName property with attributes type is string, required is true
   -bandMembers array with memberName is string and required is false
   -tracks array with trackTitle is string, trackNumber is Number, trackDuration is string, required is true

2. Create an array of at least 6 albums in your JS program. The collection must include albums from at least 2 different artists.
   -create file is server with albums array
   -use mongoose schema as template to build six albums in array giving values to the properties keys.

3. Create an express endpoint at that will return the array of albums as JSON.      
   -`albumRouter.get('/albums')` put `res.json(albums)` in a try catch

4. Call the created endpoint and display the results in the client application.
   Create a new Route and a new Component for this.
   -response object of albums
   -set displayedAlbums state as initial of empty array
   -create useEffect that sets displayed alubums to the response with a dependency of the response
   -albumDuration
    -use reduce method on album with parameters total and track
     -return `total + parseInt(track.trackDuration, 10)`
   -durationConversion with paramater duration
    -assign `Math.floor(duration/60)` to varaible `minutes`
    -assign `duration % 60` to varaible `remainingSeconds`
    -create display using template literal to set minutes and remaining seconds
    -call toString()
    -use padStart to ensure second is always displayed astwo digits
   -handleRemoveAlbum
  -display album
    -map through `response` array. use logical `&&` to check if truthy
    -map through `tracks` array (nested array) for `trackTitle` for each album
    -display each `trackNumber` and `trackTitle`
    -call `durationConversion(track.trackDuration)`
    -map though `bandMembers` array (nexted array) for `memberName` for each album and display each `memberName` and add a comma and space except last member to avoid extra comma



## Reflection Basic

What different approaches or techniques did you consider when planning your implementation? What were the advantages and disadvantages of those alternatives?

I initially planned to make the styling using CSS but decided to use Bootstrap as it was simpler. I also envisioned constructing albumSchema differently. Originally I had the bandMembers as and array of objects but simplfied to a array of strings. I considered making the artistName and bandMembers as a separate schema as they are associate with multiple albums, but at them moment they are simple and I don't know of plans to add more properties in the future so no need to make it it's own schema.



## Questions

how do i convert seconds to min:sec for duration?
look at how users is set up, to set up albums?
remove album
function to convert duration from seconds to minutes:seconds
album duration is reduce correct??? how do i map through track list duration to get duration array?
create conditional for bandMember -`album.bandMembers.length . 1 ? ( <> (` + map through bandmembers + `) </> ) : ("")`
why isn't handle remove album working?
-need to create arrow function and use `album.albumId`
modify album id - random?
bootstrap margins not working
-bootstrap css not imported
bootstrap card for each album
-card should replace div and have the key

//route to get array of albums
albumRouter.get('/albums', async (req, res) => {
try {
//fecth albums using mongoose model
//const albums = await Album.find();
res.json(albums);
} catch (error) {
console.error(error);
res.status(500).json({ error: "Internal Server Error" });
}
});

// router.get('/albums', async (req, res, next) => {

// let album = await Album.findOne({}).exec();

// if (!album) {
// const newalbum = new album({
// albumTitle: "",
// releaseYear: Number,
// artistName: "",
// bandMembers: [
// {
// memberName: "",
// },
// ],
// tracks: [
// {
// trackTitle: "",
// trackNumber: Number,
// trackDuration: "",

// },
// ],
// });

// album = await newalbum.save()
// }

// res.status(200).send(user)
// })



// const albums = [
//   [
    // {
    //   "albumTitle": "An Evening with Silk Sonic",
    //   "releaseYear": 2021,
    //   "artistName": "Silk Sonic",
    //   "bandMembers": [
    //     { "memberName": "Bruno Mars" },
    //     { "memberName": "Anderson .Paak" }
    //   ],
    //   "tracks": [
    //     { "trackTitle": "Silk Sonic Intro", "trackNumber": 1, "trackDuration": "63" },
    //     { "trackTitle": "Leave The Door Open", "trackNumber": 2, "trackDuration": "242" },
    //     { "trackTitle": "Fly As Me", "trackNumber": 3, "trackDuration": "219" },
    //     { "trackTitle": "After Last Night", "trackNumber": 4, "trackDuration": "249" },
    //     { "trackTitle": "Smokin Out The Window", "trackNumber": 5, "trackDuration": "197" },
    //     { "trackTitle": "Put On A Smile", "trackNumber": 6, "trackDuration": "255" },
    //     { "trackTitle": "777", "trackNumber": 7, "trackDuration": "165" },
    //     { "trackTitle": "Skate", "trackNumber": 8, "trackDuration": "203" },
    //     { "trackTitle": "Love's Train", "trackNumber": 9, "trackDuration": "307" },
    //     { "trackTitle": "Blast Off", "trackNumber": 10, "trackDuration": "284" }
    //   ]
    // },
    // {
    //   "albumTitle": "Pearl",
    //   "releaseYear": 1971,
    //   "artistName": "Janis Joplin",
    //   "bandMembers": [
    //     { "memberName": "" }
    //   ],
    //   "tracks": [
    //     { "trackTitle": "Move Over", "trackNumber": 1, "trackDuration": "219" },
    //     { "trackTitle": "Cry Baby", "trackNumber": 2, "trackDuration": "236" },
    //     { "trackTitle": "A Woman Left Loney", "trackNumber": 3, "trackDuration": "207" },
    //     { "trackTitle": "Half Moon", "trackNumber": 4, "trackDuration": "231" },
    //     { "trackTitle": "Buried Alive In The Blues", "trackNumber": 5, "trackDuration": "144" },
    //     { "trackTitle": "My Baby", "trackNumber": 6, "trackDuration": "244" },
    //     { "trackTitle": "Me and Bobby McGee", "trackNumber": 7, "trackDuration": "269" },
    //     { "trackTitle": "Mercedes Benz", "trackNumber": 8, "trackDuration": "106" },
    //     { "trackTitle": "Trust Me", "trackNumber": 9, "trackDuration": "195" },
    //     { "trackTitle": "Get It While You Can", "trackNumber": 10, "trackDuration": "203" }
    //   ]
    // },
    // {
    //   "albumTitle": "Ain't That Good News",
    //   "releaseYear": 1964,
    //   "artistName": "Sam Cooke",
    //   "bandMembers": [
    //     { "memberName": "" }
    //   ],
    //   "tracks": [
    //     { "trackTitle": "Ain't That Good News", "trackNumber": 1, "trackDuration": "148" },
    //     { "trackTitle": "Meet Me At Mary's Place", "trackNumber": 2, "trackDuration": "160" },
    //     { "trackTitle": "Good Times", "trackNumber": 3, "trackDuration": "145" },
    //     { "trackTitle": "Rome Wasn't Built In A Day", "trackNumber": 4, "trackDuration": "150" },
    //     { "trackTitle": "Another Saturday Night", "trackNumber": 5, "trackDuration": "147" },
    //     { "trackTitle": "Tennessee Waltz", "trackNumber": 6, "trackDuration": "190" },
    //     { "trackTitle": "A Change Is Gonna Come", "trackNumber": 7, "trackDuration": "190" },
    //     { "trackTitle": "Falling In Love", "trackNumber": 8, "trackDuration": "160" },
    //     { "trackTitle": "Home", "trackNumber": 9, "trackDuration": "147" },
    //     { "trackTitle": "Sittin' In The Sun", "trackNumber": 10, "trackDuration": "192" },
    //     { "trackTitle": "No Second Time", "trackNumber": 11, "trackDuration": "180" },
    //     { "trackTitle": "The Riddle Song", "trackNumber": 12, "trackDuration": "148" }
    //   ]
    // },
    // {
    //   "albumTitle": "Foo Fighters Greatest Hits",
    //   "releaseYear": 2009,
    //   "artistName": "Foo Fighters",
    //   "bandMembers": [
    //     { "memberName": "Dave Grohl" },
    //     { "memberName": "Pat Smear" },
    //     { "memberName": "Nate Mendel" },
    //     { "memberName": "Taylor Hawkins" },
    //     { "memberName": "Chris Shiflett" }
    //   ],
    //   "tracks": [
    //     { "trackTitle": "All My Life", "trackNumber": 1, "trackDuration": "264" },
    //     { "trackTitle": "Best Of You", "trackNumber": 2, "trackDuration": "256" },
    //     { "trackTitle": "Everlong", "trackNumber": 3, "trackDuration": "250" },
    //     { "trackTitle": "The Pretender", "trackNumber": 4, "trackDuration": "268" },
    //     { "trackTitle": "My Hero", "trackNumber": 5, "trackDuration": "259" },
    //     { "trackTitle": "Learn To Fly", "trackNumber": 6, "trackDuration": "236" },
    //     { "trackTitle": "Times Like These", "trackNumber": 7, "trackDuration": "268" },
    //     { "trackTitle": "Monkey Wrench", "trackNumber": 8, "trackDuration": "233" },
    //     { "trackTitle": "Big Me", "trackNumber": 9, "trackDuration": "134" },
    //     { "trackTitle": "Breakout", "trackNumber": 10, "trackDuration": "202" },
    //     { "trackTitle": "Long Road To Ruin", "trackNumber": 11, "trackDuration": "228" },
    //     { "trackTitle": "This Is A Call", "trackNumber": 12, "trackDuration": "235" },
    //     { "trackTitle": "Skin And Bones", "trackNumber": 13, "trackDuration": "244" },
    //     { "trackTitle": "Wheels", "trackNumber": 14, "trackDuration": "278" },
    //     { "trackTitle": "Word Forward", "trackNumber": 15, "trackDuration": "229" },
    //     { "trackTitle": "Everlong (Acoustic)", "trackNumber": 16, "trackDuration": "251" }
    //   ]
    // },
    // {
    //   "albumTitle": "Funky Divas",
    //   "releaseYear": 1992,
    //   "artistName": "En Vogue",
    //   "bandMembers": [
    //     { "memberName": "Terry Ellis" },
    //     { "memberName": "Cindy Herron" },
    //     { "memberName": "Maxine Jones" },
    //     { "memberName": "Dawn Robinson" }
    //   ],
    //   "tracks": [
    //     { "trackTitle": "This Is Your Life", "trackNumber": 1, "trackDuration": "305" },
    //     { "trackTitle": "My Lovin' (You're Never Gonna Get It)", "trackNumber": 2, "trackDuration": "282" },
    //     { "trackTitle": "Hip Hop Lover", "trackNumber": 3, "trackDuration": "313" },
    //     { "trackTitle": "Free Your Mind", "trackNumber": 4, "trackDuration": "292" },
    //     { "trackTitle": "Desire", "trackNumber": 5, "trackDuration": "241" },
    //     { "trackTitle": "Giving Him Something He Can Feel", "trackNumber": 6, "trackDuration": "236" },
    //     { "trackTitle": "It Ain't Over Till The Fat Lady Sings", "trackNumber": 7, "trackDuration": "253" },
    //     { "trackTitle": "Give It Up, Turn It Loose", "trackNumber": 8, "trackDuration": "310" },
    //     { "trackTitle": "Yesterday", "trackNumber": 9, "trackDuration": "150" },
    //     { "trackTitle": "Hooked On Your Love", "trackNumber": 10, "trackDuration": "215" },
    //     { "trackTitle": "Love Don't Love You", "trackNumber": 11, "trackDuration": "236" },
    //     { "trackTitle": "What Is Love", "trackNumber": 12, "trackDuration": "259" },
    //     { "trackTitle": "Thanks/Prayer", "trackNumber": 12, "trackDuration": "43" }
    //   ]
    // },
    // {
    //   "albumTitle": "Sailing The Seas Of Cheese",
    //   "releaseYear": 1991,
    //   "artistName": "Primus",
    //   "bandMembers": [
    //     { "memberName": "Les Claypool" },
    //     { "memberName": "Larry LaLonde" },
    //     { "memberName": "Tim Alexander" },
    //     { "memberName": "Jay Lane" },
    //     { "memberName": "Mike Bordin" },
    //     { "memberName": "Matt Winegar" },
    //     { "memberName": "Tom Waits" },
    //     { "memberName": "Trouz" }
    //   ],
    //   "tracks": [
    //     { "trackTitle": "Seas Of Cheese", "trackNumber": 1, "trackDuration": "72" },
    //     { "trackTitle": "Here Come The Bastards", "trackNumber": 2, "trackDuration": "173" },
    //     { "trackTitle": "Sgt. Baker", "trackNumber": 3, "trackDuration": "253" },
    //     { "trackTitle": "American Life", "trackNumber": 4, "trackDuration": "253" },
    //     { "trackTitle": "Jerry Was A Race Car Driver", "trackNumber": 5, "trackDuration": "191" },
    //     { "trackTitle": "Eleven", "trackNumber": 6, "trackDuration": "258" },
    //     { "trackTitle": "Is It Luck ?", "trackNumber": 7, "trackDuration": "207" },
    //     { "trackTitle": "Grandad's Little Ditty", "trackNumber": 8, "trackDuration": "37" },
    //     { "trackTitle": "Tommy The Cat", "trackNumber": 9, "trackDuration": "254" },
    //     { "trackTitle": "Sathington Waltz", "trackNumber": 10, "trackDuration": "102" },
    //     { "trackTitle": "Those Damned Blue-Collar Tweekers", "trackNumber": 11, "trackDuration": "318" },
    //     { "trackTitle": "Fish On (Fisherman Chronicles, Chapter II)", "trackNumber": 12, "trackDuration": "465" },
    //     { "trackTitle": "Los Bastardos", "trackNumber": 12, "trackDuration": "159" }
    //   ]
    // }
//   ]
  
// ];

// export default albums







## Getting Started

You will need to install the following tools:

### MongoDB

You can use a MongoDB Atlas instance for your database. However, if you would like to use a locally run MongoDB database on your own system, you can follow the instructions in this README to do so.

Install MongoDB and start your server: [MongoDB instructions](https://docs.mongodb.com/manual/administration/install-community/)

#### Mac OS

Run these commands:

```bash
xcode-select --install
```

If you get an error message saying that you've already installed these command line tools, that's not a problem.

Continue with the rest of these commands:

```bash
brew tap mongodb/brew
brew install mongodb-community@4.4
brew services start mongodb-community@4.4
```

Or, follow the guide here: [Install MongoDB on MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

#### Windows

First, download the [MongoDB Community Server](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.6-signed.msi) MSI and install it. You can use all of the default options.

When that is finished installing, you can close "MongoDB Compass" if that pops up.

Then you must start the MongoDB Service:

1. Click the start menu and type "services", Click the Services console.
2. From the Services console, locate the MongoDB service (The list is alphabetical)
3. Right-click on the MongoDB service and click Start.

Then download the [MongoDB Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-100.3.1.msi)

Those should download to a path like: `C:/Program Files/MongoDB/Tools/100/bin` Take note of that path when you install them.

Next, open GitBash.

cd to your home directory, `cd ~`

Then run

`echo "PATH=$PATH/c/Program\ Files/MongoDB/Tools/100/bin" > .bashrc`

Where that path should match the path that you installed the MongoDB Database Tools. This will make all of the tools accessible to you on GitBash.

and run:

`touch .bash_profile`

Now **close the GitBash window and re-open it before continuing**.

If you get stuck, you can reference the guide here: [Install MongoDB on Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

## Running the application

This app is configured to run both the frontend and the backend from the root directory of this project.

First, install all of the dependencies. You should only need to do this once.

```
npm install
```

You can start the entire application by doing:

```
npm run dev
```

_Note that you must be in the root folder of this repository to run both the front and backend!_

### Folder structure

The front and backend are held inside of `packages/client/` and `packages/server/`

If you `cd` into those folders, you can run them individually by using `npm run dev`.

### Adding packages

During development, you can add dependencies to the frontend or backend from the root folder:

```
npm install react-router-dom -w client
npm install mongoose -w server
```

This would add a "react-router-dom" dependency to the frontend, and a "mongoose" dependency to the backend.
