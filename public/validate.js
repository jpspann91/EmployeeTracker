const validator = require('validator');

const validatorObject = {
    isEqual(string1, string2){
        if(string1 === string2) return true;
    },
    validateString(string){
        return string !== '' || 'Enter in a valid response!';
    },
    validateSalary(number){
        if(validator.isDecimal(number)) return true;
        return 'Enter in a valid salary!';
    }
}
module.exports = validatorObject;