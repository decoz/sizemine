// src from https://stackoverflow.com/questions/38428027/why-await-is-not-working-for-node-request-module

const request = require('request')

module.exports = async (value) =>
    new Promise((resolve, reject) => {
        request(value, (error, response, data) => {
            if(error) reject(error)
            else resolve(data)
        })
    })
