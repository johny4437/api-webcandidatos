const knex = require('../../database/connection');

exports.createQuery = async (req, res) => {
    const user_id = req.params.user_id;
    const{query} = req.body;
    const search = {
        query,
        user_id
    }

   await  knex('search_query').insert(search)
   .then(() => {
       res.status(200).json({msg:"SEARCH WAS SAVED"})
   }).catch(() => {
       res.status(400).json({error:"SEARCH QUERY WAS NOT SAVED"})
   })
};
// PRA UM UNICO USUARIO
exports.readSearchQueries = async (req, res) => {
    const user_id = req.headers.user_id;
    await knex('search_query').where('user_id', user_id).select('*')
            .then(dataSearch => {
                if(dataSearch.length !== 0){
                    res.status(200).json(dataSearch)
                }else{
                    res.status(400).json({error:"THERE ARE NO SEARCH OF THIS USER"})
                }
            } )
}
// TODAS AS BUSCAS
exports.allSearchs = async(req, res) => {
    await knex('search_query').select('*')
            .then(dataSearch => {
                if(dataSearch.length !== 0){
                    res.status(200).json(dataSearch)
                }else{
                    res.status(400).json({error:"THERE ARE NO SEARCH OF THIS USER"})
                }
            } )
}