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
    'artwork.uploaded AS artpiece_uploaded',
    'gallery_artwork.public AS isPublic')
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
      'artwork.uploaded AS artpiece_uploaded',
      'gallery_artwork.public AS isPublic')  
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
    'artwork.uploaded AS artpiece_uploaded',
    'gallery_artwork.public AS isPublic')
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
  //this service will find all artwork with specified gallery id in gallery_artwork table and update privacy setting
  updateGalleryPrivacy(knex, gallery_id, newGalleryPrivacy, user_id) {
    return knex('gallery_artwork')
    .where({'gallery_id': gallery_id, 'user_id': user_id})
    .update(newGalleryPrivacy)
  },
  //this service will be used to update a single gallery/artwork combo's galleryId or privacy setting
  updateGalArtwork(knex, artpiece_id, newArtpiecePrivacy, user_id) {
    return knex('gallery_artwork')
    .where({'artpiece_id': artpiece_id, 'user_id': user_id})
    .update(newArtpiecePrivacy)
  }, 
  //this service will allow collectors to "purchase" artwork (essentially will be a post gallery_artwork table)
  insertGalleryArtwork(knex, newGalleryArtwork) {
    return knex
    .insert(newGalleryArtwork)
    .into('gallery_Artwork')
    .returning('*')
    .then(rows => {
      return rows[0];
    });
  },

}

module.exports = GalleryArtworkService;