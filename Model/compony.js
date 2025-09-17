    const mongoose = require("mongoose");
    const Schema = mongoose.Schema;



    const componySchema = Schema ( {
        name: {
            type: String,
            required: true,
        },
        user_name: {
            type: String,
            required: true,
        },
        company_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: [6, "minimum must be 6 character"],
            max: [14, "maximum 14 chaarter allowed"],
        },
        plain_password: {
            type: String,
            require: true
        },
        country: {
            type: String,
            required: true,
        },
        phone_number: {
            type: Number,
            required: true,
        },
        plan: {
            type: String,
            required: true,
        },
        abbreviation: {
            type: String,
            required: true,
        },
        user: {
            type: Number,
            required: true,
        },
        company_address: {
            type: String,
            require: true,
        },
        site_url: {
            type: Schema.Types.ObjectId,
            ref: "site_url",
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },)

    module.exports = mongoose.model("compony", componySchema);