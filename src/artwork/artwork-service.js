const ArtworkService = {
  getAllArtwork(knex, id) {
    return knex
    .from('artwork')
    .select('*')     
    .where(
      {'user_id': id}      
    )
  },
  getById(knex, id) {
    return knex.from('artwork').select('*').where('id', id).first();
  },
  insertArtpiece(knex, newArtpiece) {
    return knex
      .insert(newArtpiece)
      .into('artwork')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  deleteArtpiece(knex, id) {
    return knex('artwork')
      .where({ id })
      .delete();
  },
  updateArtpiece(knex, id, newArtpieceFields) {
    return knex('artwork')
      .where({ id })
      .update(newArtpieceFields);
  },
};

module.exports = ArtworkService;