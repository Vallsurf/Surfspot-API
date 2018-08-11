const mongoose = require('mongoose');

const spotsSchema = mongoose.Schema({
    spot_id: Number, 
    spot_name: String, 
    county_name: String,
    latitude: String,
    longitude: String, 
},
{
    timestamps: true,
});

const Spots = mongoose.model('Spots', spotsSchema);

module.exports = { Spots };