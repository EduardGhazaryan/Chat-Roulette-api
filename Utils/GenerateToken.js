const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    const payload = {
        ...user
    };

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
        expiresIn: "14d"
    });

    return access_token;
};

module.exports = {
    generateAccessToken
};
