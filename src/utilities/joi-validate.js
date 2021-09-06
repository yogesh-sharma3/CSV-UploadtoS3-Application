const helper = global.helper;
const Joi = helper.module.Joi;

//Temp logger
const log = {
  error : () => {}
}

function joiValidate(payload, params, callback) {
  let schemaObj = {};
  let DataMap = {};
  let joiOperation = {};
  try {
    let pushToSchema = function (field, joiSchema, payloadData) {
      schemaObj[field] = joiSchema;
      DataMap[field] = payloadData
      return true;
    }
    let joiStringParse = function (data) {
      return Joi[data]().required();
    }
    let makeParentSchemaRequired = function (parentField, parentKey) {
      let joi = Joi['object']().required();
      if (schemaObj[parentField] === undefined || schemaObj[parentField]) {
        joi._inner['children'] = [];
        let dataKeys = Object.keys(parentKey);
        for (let i = 0; i < dataKeys.length; i++) {
          let childSchema = {
            key: dataKeys[i],
            schema: parentKey[dataKeys[i]]
          }
          joi._inner.children.push(childSchema)
        }
      }
      return joi;
    }
    let joiObjectParse = function (field, childrenField, data, isNested, parentKey) {
      let joi = Joi;
      let parentField = field;
      parentKey = parentKey !== undefined ? parentKey : {};
      if (typeof data === 'string') {
        parentKey[childrenField] = joiStringParse(data);
        parentKey = makeParentSchemaRequired(parentField, parentKey);
        pushToSchema(parentField, parentKey, payload[parentField]);
      }
      if (data.type) {
        for (let innerField in data) {
          if (Object.prototype.hasOwnProperty.call(data, innerField)) {
            if (innerField === 'type') {
              if (isNested) {
                parentKey[childrenField] = joi[data[innerField]]().required();
              } else {
                joi = joi[data[innerField]]().required();
              }
            } else {
              if (isNested) {
                parentKey[childrenField] = parentKey[childrenField][innerField](data[innerField]);
              } else {
                joi = joi[innerField](data[innerField])
              }
            }
          }
        }
        if (!isNested) {
          pushToSchema(parentField, joi, payload[parentField]);
        } else {
          parentKey = makeParentSchemaRequired(parentField, parentKey);
          pushToSchema(parentField, parentKey, payload[parentField]);
        }
      } else {
        if (typeof data !== 'string') {
          let dataKeys = Object.keys(data);
          for (let i = 0; i < dataKeys.length; i++) {
            parentKey[Object.keys(data)[i]] = {};
            joiObjectParse(parentField, Object.keys(data)[i], data[Object.keys(data)[i]], true, parentKey);
          }
        }
      }
      return true;
    }
  
    for (let field in params) {
      if (Object.prototype.hasOwnProperty.call(params, field)) {
        if (field === 'joiOperation') {
          joiOperation = params[field];
        } else {
          if (typeof params[field] === 'string') {
            schemaObj[field] = joiStringParse(params[field]);
            DataMap[field] = payload[field];
          }
          if (typeof params[field] === 'object') {
            joiObjectParse(field, null, params[field]);
          }
        }
      }
    }
  
  
    let schemaJoi;
    if (Object.keys(joiOperation).length) {
      let keyName = joiOperation;
      let opsKey = Object.keys(keyName);
      let stringArgs = keyName[opsKey[0]];
      let args = stringArgs.split(',');
      schemaJoi = Joi.object().keys(schemaObj)[opsKey[0]](...args);
    } else {
      schemaJoi = Joi.object().keys(schemaObj);
    }
    const result = schemaJoi.validate(DataMap);
    if (result.error) {
      const error = {
        success: false,
        msg: 'Insufficient params ' + result.error.details[0].message,
        data: result.error.details[0].path
      };
      if(callback && typeof callback === 'function'){
        return callback(error);
      }
      return Promise.reject(error);
    } else {
      const response =  {
        success: true,
        msg: 'All credentails are Valid',
        data: {
          status_message: 'Valid credentials',
          data: result
        }
      }
      if(callback && typeof callback === 'function'){
        return callback(null,response);
      }
      return Promise.resolve(response);
    }
  } catch (err) {
    log.error('Error validating Joi --> ::', err);
    const error = {
      success: false,
      msg: 'Parse error',
      error: 'Error validating Data using Joi'
    }
    if(callback && typeof callback === 'function'){
      return callback(error);
    }
    return Promise.reject(error);
  }
}
  
module.exports = joiValidate;
  