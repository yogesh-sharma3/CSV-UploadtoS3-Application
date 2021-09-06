const helper = global.helper;
const express = helper.module.express;
const router = express.Router();
const middlewares = require('../../../middlewares');
const services = require('../../../services');
const rules = require('../../../../rules');

const validate = middlewares.validate;
const sanitize = middlewares.sanitize;
const isAuthorized = middlewares.isAuthorized;
const welcome = services.welcome;

router.get('/welcome',isAuthorized, (req, res, next) => {
    welcome()
      .then(result => res.json(result))
      .catch(error => res.status(500).json({error}));
  });

router.post('/welcome',sanitize, validate(rules.default), async (req, res, next) => {
    const body = req.body;
    const resp = await welcome(body).catch(error => {error});
    
    if(resp.error){
      return res.status(500).json({error});
    }
    res.json({
      message: 'Welcome API',
      data: resp
    })
});

module.exports = router;