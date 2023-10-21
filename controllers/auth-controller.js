import bcrypt from 'bcryptjs';
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import jwt from "jsonwebtoken";
import 'dotenv/config.js';
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

const avatarsPath = path.resolve("public", "avatars")

const { JWT_SECRET } = process.env;


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `${email} already in use`)
    }

    const avatarURL = gravatar.url(email, { s: '250', r: 'pg', d: "wavatar" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}


const login = async (req, res) => {
    const { email, password, } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async (req, res) => {
    const { subscription, email } = req.user;

    res.status(200).json({
        email,
        subscription,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
}


const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body);

    if (!result) {
        throw HttpError(404, "User not found")
    }

    res.status(200).json(result);
}


const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;

    const newPath = path.join(avatarsPath, filename);
    const avatar = await Jimp.read(oldPath);
    avatar.resize(250, 250);


    await fs.rename(oldPath, newPath);

    const avatarURL = path.join("avatars", filename);


    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });

}



export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}