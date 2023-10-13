import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import Contact from "../models/Contact.js";


const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "username email");
    res.json(result);
}

const getById = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    // const result = await Contact.findById(contactId);
    const result = await Contact.findOne({ _id: id, owner });

    if (!result) {
        throw HttpError(404, `Contact with id: ${contactId}  not found`);
    }

    res.json(result);
}

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
}

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    // const result = await Contact.findByIdAndDelete(contactId);
    const result = await Contact.findOneAndDelete({ _id: id });

    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`)
    }
    res.json({
        message: "Contact deleted"
    })
}

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    // const result = await Contact.findByIdAndUpdate(contactId, req.body);
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`)
    }

    res.status(200).json(result);
}

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    // const result = await Contact.findByIdAndUpdate( contactId, req.body);
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);

    if (!result) {
        throw HttpError(404, `Contact with ${contactId} not found`)
    }

    res.status(200).json(result);
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
}