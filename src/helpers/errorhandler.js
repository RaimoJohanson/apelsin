module.exports = function(res) {
    return function(err) {

        if (err.status_code) return res.status(err.status_code).json(err);

        res.status(412).json(err);
    };

};
