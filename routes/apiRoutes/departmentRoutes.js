const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

router.get("/departments", (req, res) => {
    db.query("SELECT * FROM department", (err, results) => {
        if (err) {
        res.status(500).send(err);
        } else {
        res.status(200).json(results.rows);
        }
    });
})


module.exports = router;