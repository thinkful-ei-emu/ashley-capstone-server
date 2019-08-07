const GalleriesService = {
  getAllGalleries(knex) {
    return knex.select('*').from('galleries');

  },
  getById(knex,id) {
    return knex.from('galleries').select('*').where('id', id).first();
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
  deleteGallery(knex, id) {
    return knex('galleries')
    .where({id})
    .delete();
  },
  updateGallery(knex, id, newGalleryFields) {
    return knex('galleries')
    .where({id})
    .update(newGalelryFields)
  }
}

module.exports = GalleriesService;