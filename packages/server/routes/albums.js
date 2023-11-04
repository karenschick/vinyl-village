import express from 'express'
const router = express.Router()
import Album from '../models/album'

//route to get array of albums
router.get('/albums', async (req, res)=>{

    try{
        //fecth albums using mongoose model
     const albums = await Album.find()
     res.json(albums)
    } catch (error){
        console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
})

const express = require('express');
const app = express();

