const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/Users');

require('dotenv').config();
const JWTSECRET = process.env.JWTSECRET
const JWTEXPIRE = "1h"

exports.signUp = async (req, res) => {
    const { email, password, username } = req.body;
    const userEmail = await User.findOne({ email });
    const userName = await User.findOne({ username })
    if (userEmail) {
        return res.status(402).end('Email already exists')
    }
    if (userName) {
        return res.status(401).end('Username already exists')
    }

    const saltRounds = 10;
    try {
        const hashed = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            username: username,
            email: email,
            hashedPassword: hashed
        });

        const result = await newUser.save();
        const token = jwt.sign({ id: result._id, email: result.email }, JWTSECRET, { expiresIn: JWTEXPIRE });

        res.status(200).json({ user: result, token });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' })
        }
        console.log(user)
        bcrypt.compare(password, user.hashedPassword, (err, result) => {
            if (result) {
                const payload = {
                    id: user._id,
                    email: user.email
                };

                jwt.sign(payload, JWTSECRET, { expiresIn: JWTEXPIRE }, (err, token) => {
                    if (err) throw err;

                    res.status(200).json({ user: user, token })
                })
            } else {
                res.status(401).json({ message: 'Invalid password' })
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}