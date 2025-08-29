const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const siteSchema = new Schema ( {

    site_url : {
        type: String,
        required: true,
    },
     status: { type: String, default: "pending" }, 
    progress: { type: Number, default: 0 },
})


module.exports = mongoose.model("site_url", siteSchema);