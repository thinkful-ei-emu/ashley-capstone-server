const GalleryArtworkService = {
  getAllGalleries(knex) {
    return knex  
    .from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id')
    .select(
      'gallery_id',
      'galleries.name AS gallery_name',
      'galleries.owner AS gallery_owner', 
      'artwork.title AS artpiece_title',
      'artwork.artpiece_image AS artpiece_image',
      'artwork.artist AS artpiece_artist',
      'artwork.uploaded AS artpiece_uploaded')  
    .where({'gallery_artwork.public': true })
  },
  getById(knex, gallery_id) {
    return knex
    .from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    .select( 'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'gallery_artwork.gallery_id': gallery_id})
  },
  getByOwner(knex, gallery_owner) {
    return knex.from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    .select( 'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'galleries.owner': gallery_owner})
  },
  getByName(knex, gallery_name) {
    return knex.from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    .select( 'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'galleries.name': gallery_name})
  },
  getByArtist(knex, artist) {
    return knex.from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    .select( 'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'artwork.artist': artist})
  },
  getByTitle(knex, artpiece_title) {
    return knex.from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    .select( 'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'artwork.title': artpiece_title})
  },

}

module.exports = GalleryArtworkService;