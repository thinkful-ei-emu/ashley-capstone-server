const GalleryArtworkService = {
  getAllGalleries(knex) {
    return knex
    .select(
    'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded',   
    'public')  
    .from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    
  },

}

module.exports = GalleryArtworkService;