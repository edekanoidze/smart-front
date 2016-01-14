/* sf-validate="email:true" */
sf.validator.rules.email = function (element, rule, vmName) {

    if (element === undefined && element.length === 0) {
        throw new sf.Exception("argumentnullexception element is null");
    }

    var input = $(element).val();
    if (input === '') {
        return this.success();
    }

    var mailRegex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    var isValidMail = mailRegex.test(input);

    if (!isValidMail) {
        return this.error();
    }
    return this.success();
};