const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.string().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        desc: Joi.string().required(),
    }).required()
});