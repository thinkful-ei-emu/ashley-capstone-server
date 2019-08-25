const GalleryArtworkService = {
  getAllGalleries(knex) {
    return knex
    .select('*')  
    .from('gallery_artwork')
    
  },

}

module.exports = GalleryArtworkService;