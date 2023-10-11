import { isValidObjectId } from "mongoose";

const isValidId = (req, res, next) => {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
        throw HttpError(404, `${contactId} not valid id`);
    }
    next();
}

export default isValidId;