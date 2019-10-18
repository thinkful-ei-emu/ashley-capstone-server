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
  getArtist(knex, user_id){
    return knex
    .from('artwork')
    .leftJoin('users', 'users.id', 'artwork.user_id')
    .select()

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