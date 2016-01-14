function SmartFrontValidator() {

    this.messages = {};

    this.rules = {
        error: function () {
            return {
                success: false
            };
        },
        success: function () {
            return {
                success: true
            };
        }
    };

    this.unbindEvents = function (vmName) {
        if (vmName === undefined) {
            $('[sf-validate]').unbind();
        } else {
            $('[sf-vm="' + vmName + '"]')
                .find('[sf-validate]')
                .unbind();
        }

    };

    var bindEvents = function (validationData, field, vmName) {

        if (validationData === undefined ||
            validationData.validationRules === undefined ||
            validationData.validationEvents === undefined) {
            return;
        }

        var executeRulesArg = {
            rules: validationData.validationRules
        };

        for (var i = 0; i < validationData.validationEvents.length; i++) {

            var eventName = validationData.validationEvents[i];
            $(field).bind(eventName, executeRulesArg, function (event) {
                sf.validator.validateRules(event.data.rules, $(this), vmName);
            });
        }
    };

    this.validateVm = function (vmElement) {
        setTimeout(function () {

            var field = $(vmElement).find('[sf-field][sf-validate]');
            if (vmElement === undefined || vmElement.length === 0) {
                return;
            }
            var vmName = $(vmElement).attr('sf-vm');
            $(field).each(function (index, field) {
                var attr = $(field).attr('sf-validate');
                var validationData = parseValidationData(attr);
                bindEvents(validationData, field, vmName);
            });
        }, 1);
    };

    this.validateField = function (fieldElement, vmName) {

        var validationAttr = $(fieldElement).attr("sf-validate");
        if (validationAttr === undefined || validationAttr.length === 0) {
            return false;
        }

        var validationData = parseValidationData(validationAttr);
        return this.validateRules(validationData.validationRules, fieldElement, vmName);
    };

    var parseValidationData = function (attr) {
        var validatorData = {
            "validationRules": undefined,
            "validationEvents": undefined
        }
        if (attr === undefined || attr.length === 0) {
            return undefined;
        }

        var rulesAndEvents = attr.split("on:");


        var validationRules = [];
        var validationEvents = [];

        var rulesArray = rulesAndEvents[0].split(/[,;]+/);


        for (var i = 0; i < rulesArray.length; i++) {
            var rule = rulesArray[i];
            if (rule === undefined || rule.trim().length === 0) {
                continue;
            }
            validationRules.push(rule.trim());
        }

        validatorData.validationRules = validationRules;

        if (rulesAndEvents.length !== 2) {
            return validatorData;
        }
        var eventsArray = rulesAndEvents[1].split(/[,;]+/);

        for (var i = 0; i < eventsArray.length; i++) {
            var event = eventsArray[i];
            if (event === undefined || event.trim().length === 0) {
                continue;
            }
            validationEvents.push(event.trim());
        }

        return {
            "validationRules": validationRules,
            "validationEvents": validationEvents
        };
    }

    this.validateRule = function (ruleText, element, vmName) {

        var result = {
            success: false,
            message: '',
            rule: undefined
        };

        if (ruleText === undefined) {
            return result;
        }

        var ruleProperties = ruleText.split(":");
        if (ruleProperties.length === 0) {
            return result;
        }

        var rule = {
            name: ruleProperties[0].toString().trim().toLowerCase(),
            value: ruleProperties[1]
        }

        result = sf.validator.rules[rule.name](element, rule, vmName);
        result.rule = rule;

        return result;
    };

    this.validateRules = function (rules, field, vmName) {
        if (field === undefined && field.length === 0) {
            throw new sf.Exception("element is null");
        }
        var ruleResults = [];

        if (rules.length > 0) {

            for (var i = 0; i < rules.length; i++) {
                var ruleResult = sf.validator.validateRule(rules[i], field, vmName);
                ruleResults.push(ruleResult);
            }
        }

        var isValid = true;
        var firstErrorMessage = '';
        for (var i = 0; i < ruleResults.length; i++) {
            if (!ruleResults[i].success) {
                isValid = false;
                firstErrorMessage = ruleResults[i].message;
            }
        }

        var validationResult = {
            isValid: isValid,
            firstErrorMessage: firstErrorMessage,
            ruleResults: ruleResults
        };

        sf.validator.printer.print(field, validationResult, vmName);
        return isValid;
    };
};