sf.validator.rules.numeric = function (element, rule, vmName) {

    if (element === undefined && element.length === 0) {
        throw new sf.Exception("element is null");
    }

    var valStr = $(element).val();
    var val = parseInt(valStr);
    var isNumeric = val.toString() == valStr;

    if (isNaN(val) || !isNumeric) {
        return this.error();
    }
    return this.success();
};