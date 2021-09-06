const config = helper.config;
var fs = require("fs");
const path = require('path')
const aws = require("aws-sdk");
const mime = require('mime-types');
const moment = require("moment");
const knex = require("../../../models/knex").knexConn;
const papa = require('papaparse');
const {
    safePromise,
    getName
} = require('../../utilities')
const Redis = require('redis');
const redisClient = Redis.createClient();
redisClient.on('error', function (err) {
    console.log("Connection issue =>> ", err);
})
const S3_BUCKET = config.S3_BUCKET;
const ACL = config.S3_ACL;
const s3 = new aws.S3({
    computeChecksums: true,
    accessKeyId: config.ACCESS_KEY_ID,
    secretAccessKey: config.SECRET_ACCESS_KEY,
    signatureVersion: config.SIGNATURE_VERSION,
    Bucket: config.S3_BUCKET,
    region: config.REGION
});
const fileUploadPath = path.resolve(__dirname, "..", "..", "..", "data", "csv");
const redisQueue = "CSVList";
function csvUpload() {
    return new Promise(async (resolve, reject) => {
        let date = moment().format('YYYY/MM/DD');
        let key = date + "/" + getName() + ".csv";
        let fileName = key.split("/").pop();
        const signedUrlParams = {
            Bucket: S3_BUCKET,
            Key: key,
            Expires: +config.EXPIRES,
            ContentType: 'text/csv'
        }
        const [error, signedUrl] = await safePromise(s3.getSignedUrlPromise('putObject', signedUrlParams));
        if (error) {
            return reject("Error in Generating Signed URL!")
        }
        const result = {
            "signedUrl": signedUrl
        }
        resolve(result);
        setTimeout(function () {
            var getParams = {
                Bucket: S3_BUCKET,
                Key: key
            }
            s3.getObject(getParams, async function (err, data) {
                if (err) {
                    return reject(err);
                }
                let objectData = data.Body.toString('utf-8');
                let newFileName = fileUploadPath + "/" + fileName;
                fs.writeFile(newFileName, 'utf-8',objectData, (err) => { 
                    if (err)
                        return reject("Error while writing")
                    else {
                        redisClient.lpush(redisQueue, fileName, function (err) {
                            if (err) {
                                return reject("Error while L-Pushing")
                            }
                        })
                    }
                });
            })
        }, 25000);
        resolve("csv has been queued.")
    })
}
function dbInsert() {
    return new Promise(function (resolve, reject) {
        redisClient.rpop(redisQueue, function (err, result) {
            if (err) {
                return reject(err)
            }
            console.log("popped file is", result);
            const filePath = fileUploadPath + "/" + result;
            fs.readFile(filePath, 'utf-8', function (err, data) {
                if (err) {
                    return reject("Error reading the file");
                }
                const csvToJson = papa.parse(data, {
                    header: true
                });
                console.log(csvToJson.data)
                csvToJson.data.forEach(async (item) => {
                    const fileRow = Object.values(item);
                    const [error, result] = await safePromise(knex('uploadCsv').insert({
                        Date: fileRow[0],
                        Open: fileRow[1],
                        High: fileRow[2],
                        Low: fileRow[3],
                        Close: fileRow[4],
                        Volume: fileRow[5],
                        Name: fileRow[6]
                    }))
                    if (error) {
                        return reject(error)
                    }
                })
            })
        })
    })
}
module.exports = {
    csvUpload,
    dbInsert
};