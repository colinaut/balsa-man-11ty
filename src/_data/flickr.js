require('dotenv').config();
const Cache = require("@11ty/eleventy-cache-assets");
const axios = require('axios');

const FLICKR_API_KEY = process.env.FLICKR_API_KEY
// const FLICKR_API_SECRET = process.env.FLICKR_API_SECRET
const flickrAPIurl = 'https://www.flickr.com/services/rest/'

function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}

async function getGroupPool(group) {

    const params = new URLSearchParams({
        method: 'flickr.groups.pools.getPhotos',
        api_key: FLICKR_API_KEY,
        group_id: group.id,
        format: 'json',
        nojsoncallback: 1,
        per_page: 100,
        extras: 'url_m,url_l,url_o,path_alias'
    })

    // Get photos and Cache
    const data = await Cache(flickrAPIurl + "?" + params, {
        duration: '4w',
        type: 'json', 
    })

    // Add link to photo on flickr
    const photos = data.photos.photo.map((photo) => {
        return {...photo, link: `https://www.flickr.com/photos/${photo.pathalias}/${photo.id}/in/pool-${group.slug}/`}
    })

    // Shuffle array and return only 6
    return photos.sort(() => Math.random() - 0.5).splice(0,6)
}

module.exports = async () => {

    const groups = {
        bm2008: {id:'875752@N23', slug:"balsaman2008"},
        bm2009: {id:'1215242@N23', slug:"balsaman2009"},
        bm2010: {id:'1520544@N22' , slug:"balsaman2010"},
        bm2011: {id:'1724898@N21', slug:"balsaman2011"},
        bm2012: {id:'2016261@N24', slug:"balsaman2012"}
    }

    const photoPools = {}
    photoPools.bm2008 = await getGroupPool(groups.bm2008)
    photoPools.bm2009 = await getGroupPool(groups.bm2009)
    photoPools.bm2010 = await getGroupPool(groups.bm2010)
    photoPools.bm2011 = await getGroupPool(groups.bm2011)
    photoPools.bm2012 = await getGroupPool(groups.bm2012)

    return photoPools
}