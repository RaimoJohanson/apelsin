module.exports = function(res) {
    return function(err) {

        if (err.status_code) return res.status(err.status_code).end(err.message);

        res.status(412).json(err);
    };

};
