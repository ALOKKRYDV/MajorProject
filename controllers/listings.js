const listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
        let result = await listing.find({});
        res.render("listings/index.ejs", { result });
}

module.exports.renderNewListingForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    let result=await listing.findById(id).populate({path:'reviews',populate:{path:'author'},}).populate("owner");
    if (!result) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs",{result});
}

module.exports.createListing = async (req, res) => {
    let url= req.file.path;
    let filename = req.file.filename; 
    let {title,description,image,price,location,country,category}=req.body;
    const listingData = new listing({
        title: title,
        description : description,
        image: {
            filename: filename, // Use the filename from multer
            url: url // Use the path from multer
        },
        price : price,
        location : location,
        country : country,
        category:category
    })
    listingData.owner = req.user._id; // Set the owner to the currently logged-in user
      await listingData.save();
      req.flash('success', 'New listing created successfully!');
        res.redirect('/listings');
}

module.exports.editListing = async (req, res) => {
    let {id}=req.params;
    let result=await listing.findById(id);
    if (!result) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs',{result});
}

module.exports.updateListing = async (req, res) => {
    let {id}=req.params;
    let {title,description,price,location,country,category}=req.body;
       let Listing = await listing.findByIdAndUpdate(id, {
            title: title,
            description : description,
            
            price : price,
            location : location,
            country : country,
            category:category,
        },{ new: true, runValidators: true });
        if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = {
            filename: filename, // Use the filename from multer
            url: url // Use the path from multer
        };
        await Listing.save();
    }
        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id}=req.params;
   let deletedListing = await listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new expressError(404, 'Listing not found');
    }
    req.flash('success', 'Listing deleted successfully!');
     res.redirect('/listings');
}
