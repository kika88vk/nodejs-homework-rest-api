import { Schema, model } from "mongoose";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import Joi from 'joi';

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact']
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    avatarURL: {
        type: String,
    },
}, { versionKey: false, timestamps: true })

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "missing required name field",
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        "any.required": "missing required email field",
    }),
    phone: Joi.string().required().messages({
        "any.required": "missing required phone field",
    }),
    favorite: Joi.boolean()
})

export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
}).or("name", "email", "phone");

export const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

const Contact = model("contact", contactSchema);

export default Contact;