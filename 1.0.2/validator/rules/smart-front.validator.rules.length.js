/* sf-validate="min:5, max:7" or sf-validate="20"  */
sf.validator.rules.length = function (element, rule, vmName) {
    
    var ruleData = rule.value.split(":");
    var args = '';
    for (var i = 0; i < ruleData.length; i++) {
        args += ruleData[i].toString().trim().toLowerCase();
        if (i !== ruleData.length) {
            args += ':';
        }
    }

    var successMessage = "წარმატებით გაიარა ვალიდაცია";
    if (element === undefined && element.length === 0) {
        throw new sf.Exception("argument null exception: element is null");
    }
    if (args === undefined || args.length === 0) {
        throw new sf.Exception("argument null exception: args is null");
    }
    if (args.indexOf(':') > 0 || args.indexOf(',') > 0) {
        var parseArgs = args.split(',');
        if (parseArgs.length > 1) {
            throw new sf.Exception("validate exception: argument format incorect");
        }
        var tempInfoMinLength = parseArgs[0].toString().toLowerCase().trim();
        if (tempInfoMinLength === undefined || tempInfoMinLength.length === 0) {
            throw new sf.Exception("validate exception: argument format incorect");
        }
        tempInfoMinLength = tempInfoMinLength.split(':');
        if (tempInfoMinLength.length !== 2) {
            throw new sf.Exception("validate exception: argument format incorect");
        }
        var tempInfoMaxLength;
        if (parseArgs.length >= 2) {
            tempInfoMaxLength = parseArgs[1].toString().toLowerCase().trim();
            if (tempInfoMaxLength === undefined || tempInfoMaxLength.length === 0) {
                throw new sf.Exception("validate exception: argument format incorect");
            }
            tempInfoMaxLength = tempInfoMaxLength.split(':');
            if (tempInfoMaxLength.length !== 2) {
                throw new sf.Exception("validate exception: argument format incorect");
            }
        }



        var validateMinLength = tempInfoMinLength[1].toString().toLowerCase().trim();
        var minLengthErrorMessage = "სიმბოლოების რაოდენობა უნდა იყოს არანაკლებ " + validateMinLength;
        var validateMaxLength;


        var maxLengthErrorMessage = "სიმბოლოების რაოდენობა უნდა იყოს მაქსიმუმ  ";
        if (tempInfoMaxLength !== undefined) {
            validateMaxLength = tempInfoMaxLength[1].toString().toLowerCase().trim();
            maxLengthErrorMessage += validateMaxLength;
        }
        if (validateMinLength !== undefined &&
            $(element).val().length < validateMinLength) {
            return this.error(minLengthErrorMessage);
        }

        if (validateMaxLength !== undefined &&
            $(element).val().length > validateMaxLength) {
            return this.error(maxLengthErrorMessage);
        }
    }
    else {
        var validateLength = args.trim();
        var lengthErrorMessage = "სიმბოლოების რაოდენობა ზუსტად უნდა იყოს " + validateLength;
        if (validateLength !== undefined &&
            $(element).val().length !== validateLength) {
            return this.error(lengthErrorMessage);
        }
    }

    return this.success(successMessage);
}