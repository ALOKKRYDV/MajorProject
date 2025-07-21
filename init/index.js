const mongoose = require('mongoose');
const initdata=require('./data.js');
const listing = require('../models/listing.js');
main().then(()=>{
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

 listing.deleteMany({}).then(() => {
    console.log('Chats deleted successfully') ;
}).catch(err => {
    console.error('Error saving chats:', err);  
});
 initdata.data= initdata.data.map((item) => {
    return {
        ...item,
        owner: '6877d1a67a65b29e2c2bd271' // Replace with the actual ObjectId of the user
    };
});
listing.insertMany(initdata.data).then(() => {
    console.log('Listings saved successfully') ;
}).catch(err => {
    console.error('Error saving listings:', err);  
});
 