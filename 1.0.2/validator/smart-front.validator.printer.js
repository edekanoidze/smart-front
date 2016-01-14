function SmartFrontValidatorPrinter() {

    var removeOldAttributes = function (field) {
        if (field === undefined && field.length === 0) {
            throw new sf.Exception("argumentnullexception element is null");
        }
        var formGroup = $(field).closest('.form-group');
        formGroup.removeClass('has-error');
        formGroup.removeClass('has-success');
        formGroup.addClass('has-info');
    };

    var error = function (field, message) {

        removeOldAttributes(field);

        var formGroup = $(field).closest('.form-group');
        formGroup.removeClass('has-info');
        formGroup.removeClass('has-success');
        formGroup.addClass('has-error');

        var helpBlock = formGroup.find('.help-block');
        var oldMessage = helpBlock.html();
        if (oldMessage !== message) {
            helpBlock.html(message);
        }
    };
    var success = function (field, message) {

        removeOldAttributes(field);

        var formGroup = $(field).closest('.form-group');
        formGroup.removeClass('has-info');
        formGroup.removeClass('has-error');
        formGroup.addClass('has-success');

        var helpBlock = formGroup.find('.help-block');
        var oldMessage = helpBlock.html();
        if (oldMessage !== message) {
            helpBlock.html(message);
        }
    };

    // Result object: {
    //     isValid,
    //     firstErrorMessage,
    //     ruleResults: [
    //         {
    //             success,
    //             message,
    //             rule:{
    //                  name,
    //                  value
    //              }
    //         }
    //     ]
    //  };
    this.print = function (field, result, vmName) {

        var vm = new window[vmName]();
        var fieldName = $(field).attr('sf-field');
        var language = sf.language;
        var firstError = getFirstError(result.ruleResults);
        if (firstError != null) {
            var ruleName = firstError.rule.name;

            var ruleDictionary = getRuleDictionary(vm, language, fieldName, ruleName);

            // if custom message is not specified, then use generic message
            if (ruleDictionary == undefined) {
                ruleDictionary = sf.validator.messages[language][ruleName];
            }

            if (ruleDictionary != null) {
                error(field, ruleDictionary.error);
            }
        }
        else {
            success(field, "");
        }
    };

    function getFirstError(ruleResults) {

        for (var i = 0; i < ruleResults.length; i++) {
            var rule = ruleResults[i];
            if (!rule.success) {
                return rule;
            }
        }
        return null;
    };


    function getRuleDictionary(vm, language, fieldName, ruleName) {
        var vmDictionary = vm.messages;
        if (vmDictionary === undefined) {
            return undefined;
        }

        var languageDictionary = vmDictionary[language];
        if (languageDictionary === undefined) {
            return undefined;
        }

        var fieldDictionary = languageDictionary[fieldName];
        if (fieldDictionary === undefined) {
            return undefined;
        }

        return fieldDictionary[ruleName];
    };

};