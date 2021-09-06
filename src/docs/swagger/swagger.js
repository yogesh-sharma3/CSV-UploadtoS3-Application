const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const SOURCEDIR = path.join(__dirname, '..', '..', '..');
const swaggerPath = path.resolve(__dirname,'..','..','controllers/routes');
const swaggerUi = require('swagger-ui-express');


let swaggerMiddleware = (app) => {
  const { API_MOUNT_POINT, PORT, SERVER }  = global.helper.config;

  const swaggerDefinition = {
    info: {
      title: 'Express BoilerPlate',
      version: '1.0.0',
      description: 'Express BoilerPlate Structure',
    },
    host: `${SERVER}:${PORT}`,
    basePath: `${API_MOUNT_POINT}/`,
  };

  const options = {
    swaggerDefinition,
    apis: [`${swaggerPath}/**/*.yaml`],
  };

  const swaggerSpec = swaggerJSDoc(options);
  
  app.get(`${API_MOUNT_POINT}/swagger/json`, function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  app.use(`${API_MOUNT_POINT}/swagger`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerMiddleware;
