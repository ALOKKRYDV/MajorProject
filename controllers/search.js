const listings = require('../models/listing.js');

module.exports.searchListing=async (req, res) => {
    const {name} = req.query;
    try{
        const result = await listings.find({
            country: { $regex: name, $options: 'i' } // case-insensitive partial match
        });
       
        if (result.length === 0) {
            req.flash('error', 'No listings found for the given Country.');
            return res.redirect('/listings');
        }
       res.render("listings/index.ejs",{result});
       
    }catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while searching for listings.');
        res.redirect('/listings');
    }
}

module.exports.searchCategory=async(req,res)=>{
    let {category} = req.params;
    try{
        const result = await listings.find({
            category:category
        });
        if (result.length === 0) {
            req.flash('error', 'No listings found for the given name.');
            return res.redirect('/listings');
        }
        res.render("listings/index.ejs",{result});
    }catch(err){
        console.error(err);
        req.flash('error', 'An error occurred while searching for listings.');
        res.redirect('/listings');
    }
}
