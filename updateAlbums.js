const mongoose = require('mongoose');
const Album = require('./packages/server/models/album');

const User = require('./packages/server/models/user');
const keys = require('./packages/server/config/keys');

mongoose.connect(keys.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function updateAlbums() {
    try {
        // Fetch all users or a subset based on your criteria
        const users = await User.find();
        // Fetch all albums
        const albums = await Album.find();

        for (const album of albums) {
            // Assign each album to a user
            // This example assigns users randomly. Modify as per your needs.
            const randomUser = users[Math.floor(Math.random() * users.length)];
            album.user = randomUser._id;
            await album.save();
        }

        console.log('Albums have been updated with user references.');
    } catch (error) {
        console.error('Error updating albums:', error);
    }
}

updateAlbums().then(() => {
    mongoose.disconnect();
});
