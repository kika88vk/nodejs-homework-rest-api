import express from 'express';

import contactsService from "../../models/contacts.js";
import { HttpError } from '../../helpers/index.js';
import Joi from 'joi';


const router = express.Router()

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().required(),
})

router.get('/', async (res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);

  } catch (error) {
    next(error);
  }

})



router.get('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id}  not found`);
    }
    res.json(result);

  } catch (error) {
    next(error);

  }

})



router.post('/', async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Missing required name field")
    }

    const { error } = contactAddSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message)
    }

    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }

})



router.delete('/:contactId', async (req, res, next) => {

  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`)
    }
    res.json({
      message: "Contact deleted"
    })
  } catch (error) {
    next(error);
  }
})



router.put('/:contactId', async (req, res, next) => {

  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "All fields empty")
    }

    const { error } = contactAddSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message)
    }
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`)
    }

    res.json(result);

  } catch (error) {
    next(error);
  }

})

export default router;
