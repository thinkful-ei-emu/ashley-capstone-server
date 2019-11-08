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
      'artwork.id AS artpiece_id',
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
    'artwork.id AS artpiece_id',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'gallery_artwork.gallery_id': gallery_id})
  },
  getUserGalleries(knex, user_id) {
    return knex  
    .from('galleries')
    .leftJoin('gallery_artwork', 'galleries.id', 'gallery_artwork.gallery_id')
    .leftJoin('artwork', 'gallery_artwork.artwork_id', 'artwork.id')
    .select(
      'galleries.id AS gallery_id',
      'galleries.name AS gallery_name',
      'galleries.owner AS gallery_owner',
      'artwork.id AS artpiece_id', 
      'artwork.title AS artpiece_title',
      'artwork.artpiece_image AS artpiece_image',
      'artwork.artist AS artpiece_artist',
      'artwork.uploaded AS artpiece_uploaded')  
    .where({'galleries.user_id': user_id })
  },
  getUserGalleryById(knex, gallery_id, user_id) {
    return knex
    .from('galleries')
    .leftJoin('gallery_artwork', 'galleries.id', 'gallery_artwork.gallery_id')
    .leftJoin('artwork', 'gallery_artwork.artwork_id', 'artwork.id')
    .select( 
    'galleries.id AS gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner',
    'artwork.id AS artpiece_id', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'gallery_artwork.gallery_id': gallery_id, 'galleries.user_id': user_id})
  },
  getByOwner(knex, gallery_owner) {
    return knex.from('gallery_artwork')
    .leftJoin('galleries', 'gallery_id', 'galleries.id')
    .leftJoin('artwork', 'artwork_id', 'artwork.id' )
    .select( 'gallery_id',
    'galleries.name AS gallery_name',
    'galleries.owner AS gallery_owner', 
    'artwork.title AS artpiece_title',
    'artwork.id AS artpiece_id',
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
    'artwork.id AS artpiece_id', 
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
    'artwork.id AS artpiece_id', 
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
    'artwork.id AS artpiece_id', 
    'artwork.title AS artpiece_title',
    'artwork.artpiece_image AS artpiece_image',
    'artwork.artist AS artpiece_artist',
    'artwork.uploaded AS artpiece_uploaded')
    .where({'artwork.title': artpiece_title})
  },

}

module.exports = GalleryArtworkService;