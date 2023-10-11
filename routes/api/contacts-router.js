import express from 'express';
import contactsController from '../../controllers/contacts-controller.js'
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from '../../models/Contact.js';
import { isValidId, isEmptyBody } from "../../middlewares/index.js";
import { validateBody } from '../../decorators/index.js';

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateValidate = validateBody(contactUpdateSchema);
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);

const router = express.Router()


router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, contactsController.getById);

router.post('/', isEmptyBody, contactAddValidate, contactsController.add);

router.delete('/:contactId', isValidId, contactsController.deleteById);

router.put('/:contactId', isValidId, isEmptyBody, contactUpdateValidate, contactsController.updateById);

router.patch('/:contactId/favorite', isValidId, isEmptyBody, contactUpdateFavoriteValidate, contactsController.updateFavorite);


export default router;
