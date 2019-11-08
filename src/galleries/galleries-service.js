const GalleriesService = {
  getAllGalleries(knex, id) {
    return knex
    .from('galleries')
    .select('*')     
    .where(
      {'user_id': id}      
    )    
  },
  getById(knex, id, user_id) {
    return knex
    .from('galleries')
    .select('*')
    .where({'id': id, 'user_id': user_id})
    .first();
  },
  insertGallery(knex, newGallery) {
    return knex
    .insert(newGallery)
    .into('galleries')
    .returning('*')
    .then(rows => {
      return rows[0];
    });
  },
  deleteGallery(knex, id, user_id) {
    return knex('galleries')
    .where({'id': id, 'user_id': user_id})
    .delete();
  },
  updateGallery(knex, id, newGalleryFields, user_id) {
    return knex('galleries')
    .where({'id': id, 'user_id': user_id})
    .update(newGalleryFields)
  }
}

module.exports = GalleriesService;