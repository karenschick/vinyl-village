
# Kenzie MERN Starter Template

## Project Plan

Design a data model for a collection of vinyl record albums.
The data model must include these properties at a minimum:
For each album: album title, year, artist, song list
For each song: song title, duration (song length)
For each artist: artist name, list of member names (if a group instead of a solo artist)

Create an array of at least 6 albums in your JS program. The collection must include albums from at least 2 different artists.
Create an express endpoint at that will return the array of albums as JSON.
Call the created endpoint and display the results in the client application. Create a new Route and a new Component for this.






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



