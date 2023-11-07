
# Kenzie MERN Starter Template

## Questions
how do i have only one title and release year?
how do i convert seconds to min:sec for duration?
look at how users is set up, to set up albums?
remove album
function to convert duration from seconds to minutes:seconds
album duration is reduce correct??? how do i map through track list duration to get duration array?


## Project Plan

1. Design a data model for a collection of vinyl record albums. Create file in models folder for moongoose schema.
 -albumTitle property with attributes type is string, unique is true required is true
 -releaseYear property with attributes type is string, required is true
 -artistName property with attributes type is string, required is true
 -bandMembers array with memberName is string and required is false
 -tracks array with trackTitle is string, trackNumber is Number, trackDuration is string, required is true

2. Create an array of at least 6 albums in your JS program. The collection must include albums from at least 2 different artists.
  -create file is server with albums array
  -use mongoose schema as template to build six albums in array giving values to the properties keys.

3. Create an express endpoint at that will return the array of albums as JSON.

4. Call the created endpoint and display the results in the client application. 

5. Create a new Route and a new Component for this.
 -albumDuration
 -durationConversion
 -handleRemoveAlbum

## Reflection

What different approaches or techniques did you consider when planning your implementation? What were the advantages and disadvantages of those alternatives?

_(Put your reflection answer here.)_


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

First, download the [MongoDB Community Server](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.6-signed.msi) MSI and install it.  You can use all of the default options. 

When that is finished installing, you can close "MongoDB Compass" if that pops up.  

Then you must start the MongoDB Service:

1. Click the start menu and type "services", Click the Services console.
2. From the Services console, locate the MongoDB service (The list is alphabetical)
3. Right-click on the MongoDB service and click Start.

Then download the [MongoDB Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-100.3.1.msi)

Those should download to a path like: `C:/Program Files/MongoDB/Tools/100/bin`  Take note of that path when you install them.

Next, open GitBash.  

cd to your home directory, `cd ~`

Then run 

`echo "PATH=$PATH/c/Program\ Files/MongoDB/Tools/100/bin" > .bashrc`

Where that path should match the path that you installed the MongoDB Database Tools.  This will make all of the tools accessible to you on GitBash.

and run:

`touch .bash_profile`

Now **close the GitBash window and re-open it before continuing**.

If you get stuck, you can reference the guide here: [Install MongoDB on Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)


## Running the application

This app is configured to run both the frontend and the backend from the root directory of this project.

First, install all of the dependencies.  You should only need to do this once.

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



