const helper = global.helper;
const express = helper.module.express;
const router = express.Router();
const {safePromise} = require('../../../utilities');
const path = require("path");
const {csvUpload} = require('../../../services');
const uploadPath = path.resolve(__dirname, "..", "..", "..", "..", "data", "csv");

router.post('/csvUpload', async (req, res, next) => {
        const [error, result] = await safePromise(csvUpload())
        if (error) {
            return res.json({
                success: false,
                error
            });
        }
        res.json({
            success: true,
            message: "Use Signed URL link to upload",
            res: {
                result
            }
        })
    })
module.exports = router;