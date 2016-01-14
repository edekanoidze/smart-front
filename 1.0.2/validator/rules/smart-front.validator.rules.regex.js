/* sf-validate="regex:true" */
sf.validator.rules.regex = function (element, rule, vmName) {

    var regex = rule.value.trim().toLowerCase();

    if (element === undefined && element.length === 0) {
        throw new sf.Exception("argumentnullexception element is null");
    }
    var objectRegex = new RegExp(regex);
    var isValid = objectRegex.test($(element).val());

    if (!isValid) {
        return this.error();
    }
    return this.success();
};