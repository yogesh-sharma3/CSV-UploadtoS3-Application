require('dotenv').config()

const config = {
  MOUNT_POINT: process.env.MOUNT_POINT,
  SERVER: process.env.SERVER,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_POOL_MAXSIZE: process.env.DB_POOL_MAXSIZE,
  DB_POOL_MINSIZE: process.env.DB_POOL_MINSIZE,
  DB_POOL_ACQUIRE: process.env.DB_POOL_ACQUIRE,
  DB_POOL_IDLE: process.env.DB_POOL_IDLE,
  DB_CONNECT_TIMEOUT: process.env.DB_CONNECT_TIMEOUT,
  SERVICE_URL: process.env.SERVICE_URL,
  PROTOCOL: process.env.PROTOCOL,
  AUTH_URL: process.env.AUTH_URL,
  AUTH_MODE: process.env.AUTH_MODE,
  SERVER_NAME:process.env.SERVER_NAME,
  S3_BUCKET: process.env.S3_BUCKET,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  S3_ACL: process.env.S3_ACL,
  S3_PATH: process.env.S3_PATH,
  EXPIRES: process.env.EXPIRES,
  SIGNATURE_VERSION: process.env.SIGNATURE_VERSION,
  REGION: process.env.REGION
}

function checkIfAllEnvKeysPresent(config, scope="") {
  const configKeys = Object.keys(config);
  configKeys.forEach((key) => {
    if (!config[key]) {
      throw new Error(`"${scope} ${key}" is blank in .env or related configuration file`)
    }
    if(typeof config[key] === "object"){
      checkIfAllEnvKeysPresent({...config[key]}, key);
    }
  });
}

checkIfAllEnvKeysPresent(config);

module.exports = config;