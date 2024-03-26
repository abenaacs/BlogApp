const validator = require('validator');

const password = (value, helpers) => {
  if (!validator.isStrongPassword(value)) {
    return helpers.message(
      'password should contain at least one: uppercase and lowercase letter, number, special charachter',
    );
  }
  return value;
};

const objectId = (value, helpers)=>{
  if(!value.match(/^[1-9a-fA-F]{24}$/)){
      return helpers.message("'{{#label}}' must be avalid mongo id..")
  }
  return value
}


module.exports = {
  password,
  objectId,
};
