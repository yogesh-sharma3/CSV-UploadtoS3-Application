const helper  = global.helper;
const express = helper.module.express;
const router  = express.Router();

router.use('/',require(`./welcome`));
router.use('/',require(`./csvUpload`));

//Write a loader here to avoid adding manual routes.

//index route
router.get('/', (req, res) => {
  res.json({
    ok: 'ok'
  });
});

router.get('/health-check', (req, res) => {
  res.json({
    alive: `${req.path}`
  });
});

module.exports = router;