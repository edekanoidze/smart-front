$f.validator =
{
    print: {
        clear: function (element) {
            if (element === undefined && element.length === 0) {
                throw new $f.Exception("argumentnullexception element is null");
            }
            var formGroup = $f.selector(element).closest('.form-group');
            formGroup.removeClass('has-error');
            formGroup.removeClass('has-success');
            formGroup.addClass('has-info');

            //$f.selector(element).removeAttr('title');

            //var helpBlock = formGroup.find('.help-block');
            //helpBlock.html('');
        },

        error: function (element, message) {
            this.clear(element);
            var formGroup = $f.selector(element).closest('.form-group');
            formGroup.removeClass('has-info');
            formGroup.removeClass('has-success');
            formGroup.addClass('has-error');

            var helpBlock = formGroup.find('.help-block');
            var oldMessage = helpBlock.html();
            if (oldMessage != message) {
                helpBlock.html(message);
            }
        },
        success: function (element, message) {
            this.clear(element);

            var formGroup = $f.selector(element).closest('.form-group');
            formGroup.removeClass('has-info');
            formGroup.removeClass('has-error');
            formGroup.addClass('has-success');

            var helpBlock = formGroup.find('.help-block');
            var oldMessage = helpBlock.html();
            if (oldMessage != message) {
                helpBlock.html(message);
            }
        }
    },
    selectors: {
        getValidateQuery: "[sf-validate]",
    },
    unbindevents: function () {
        $f.selector(this.selectors.getValidateQuery).unbind();
    },
    events: {
        bindEvent: function (input, eventName) {
            if (eventName !== undefined && eventName.length > 0) {
                $f.selector(input).bind(eventName, function () {
                    var self = $f.selector(this);
                    var thisAttr = $f.selector(self).attr("sf-validate");
                    if (thisAttr !== undefined && thisAttr.length > 0) {
                        var commendArray = $f.validator.parseAttr(thisAttr);
                        if (commendArray.length > 0) {
                            $f.validator.executeCommands(commendArray, self);
                        }

                    }
                });
            }
        },

        register: function (eventArray, input) {
            if (eventArray !== undefined && eventArray.length > 0) {
                $f.selector(eventArray).each(function (index, eventName) {
                    // bind event
                    $f.validator.events.bindEvent(input, eventName);
                });
            }
        }
    },
    autoValidator: function (controllerSelector) {
        setTimeout(function () {
            var validField = $f.selector(controllerSelector).find('[sf-field][sf-validate]');
            if (controllerSelector != undefined && controllerSelector.length > 0) {
                $f.selector(validField).each(function (index, input) {
                    var attr = $f.selector(input).attr('sf-validate');
                    var eventArray = $f.validator.parseAttrEvents(attr);
                    $f.validator.events.register(eventArray, input);
                });
            }

        }, 1);
    },

    valid: function (fieldSelector, attrString) {
        var commandArray = this.parseAttr(attrString);
        return this.executeCommands(commandArray, fieldSelector);

    },

    clearAttr: function (attr) {
        var clearAttr = attr.trim().replace(/[\r\n]+/g, "");
        clearAttr = clearAttr.replace(" ", "");
        clearAttr = clearAttr.replace("\n", "");
        clearAttr = clearAttr.replace("\s", "");
        clearAttr = clearAttr.replace(/[\r\n]+/g, "");

        return clearAttr;
    },

    parseAttr: function (attr) {
        var clearAttr = this.clearAttr(attr);
        if (clearAttr !== undefined && clearAttr.length > 0) {
            var validCommandsArray = [];
            var tempArray = clearAttr.split("on:");
            if (tempArray.length >= 1 && tempArray[0].length > 0) {
                $f.selector(tempArray[0].split(";")).each(function (index, value) {
                    if (value != undefined && value.trim().length > 0) {
                        validCommandsArray.push(value);
                    }
                });
                if (validCommandsArray.length > 0) {
                    return validCommandsArray;
                }
            }
        }
        return undefined;
    },

    parseAttrEvents: function (attr) {
        var clearAttr = this.clearAttr(attr);
        if (clearAttr !== undefined && clearAttr.length > 0) {
            var validCommandsArray = [];
            var tempArray = clearAttr.split("on:");
            if (tempArray.length >= 2 && tempArray[1].length > 0) {
                $f.selector(tempArray[1].split(",")).each(function (index, value) {
                    if (value != undefined && value.trim().length > 0) {
                        validCommandsArray.push(value);
                    }
                });
                if (validCommandsArray.length > 0) {
                    return validCommandsArray;
                }
            }
        }
        return undefined;
    },

    exeuteCommand: function (commend, element) {
        var returnValue = true;
        if (commend.length > 0 && commend.indexOf(':') > 0) {
            var parseCommend = commend.split(":");
            var commandName = parseCommend[0].toString().trim().toLowerCase();

            if (parseCommend.length === 2 || (commandName === 'maxlength' && parseCommend.length >= 2)) {

                var arg = parseCommend[1].toString().trim().toLowerCase();
                switch (commandName) {
                    case "req":
                        {
                            if (Boolean(arg) === true) {

                                returnValue = $f.validator.rules.isRequard(element);
                            }
                        };
                        break;
                    case "number":
                        {
                            if (Boolean(arg) === true) {

                                returnValue = $f.validator.rules.isNumber(element);
                            }
                        };
                        break;
                    case "maxlength":
                        {
                            arg = '';
                            for (var i = 1; i < parseCommend.length; i++) {
                                arg += parseCommend[i].toString().trim().toLowerCase();
                                if (i !== parseCommend.length - 1) {
                                    arg += ':';
                                }
                            }
                            returnValue = $f.validator.rules.Length(element, arg);
                        };
                        break;
                    case "mail":
                        {
                            if (Boolean(arg) === true) {

                                returnValue = $f.validator.rules.isMail(element);
                            }
                        };
                        break;
                    case "regex":
                        {

                            returnValue = $f.validator.rules.testRegex(element, arg);
                        };
                        break;
                    case "compare":
                        {

                            returnValue = $f.validator.rules.compare(element, arg);
                        };
                        break;


                }
                if (returnValue === false) {
                    return returnValue;
                }
            }
        }
        return returnValue;
    },

    executeCommands: function (commands, element) {
        if (element === undefined && element.length === 0) {
            throw new $f.Exception("element is null");
        }
        var validationResult = {};

        if (commands.length > 0) {

            for (var i = 0; i < commands.length; i++) {
                var result = $f.validator.exeuteCommand(commands[i], element);
                validationResult = result;
                if (!validationResult.success) {
                    break;
                }
            }
        }

        if (validationResult.success) {
            $f.validator.print.success(element, '');
        }
        else {
            $f.validator.print.error(element, validationResult.message)
        }

        return validationResult.success;
    },
    rules: {
        error: function (message) {
            return {
                success: false,
                message: message
            };
        },
        success: function (message) {
            return {
                success: true,
                message: message
            };
        },
        /* sf-validate="req:true" */
        isRequard: function (element) {
            var errorMessage = "აუცილებელია";
            var successMessage = "წარმატებით გაიარა ვალიდაცია";
            if ($f.selector(element).is('select')) {
                var selectedOption = $f.selector(element).find('option:selected');
                var selectOptionValue = undefined;
                if (selectedOption !== undefined) {
                    selectOptionValue = $f.selector(selectedOption).val();
                }
                if (!selectedOption ||
                    selectedOption.attr('data-empty-option') == 'true' ||
                    !selectOptionValue ||
                    selectOptionValue.length === 0 ||
                    selectOptionValue <= 0) {
                    var selectId = $f.selector(element).attr('[sf-field]');

                    var picker = $f.selector('[sf-field="' + selectId + '"]');
                    if (picker === undefined || picker.length === 0) {
                        picker = element;
                    }
                    return this.error(errorMessage);
                }
            }
            else if ($f.selector(element).is('input') || $f.selector(element).is('textarea')) {
                if ($f.selector(element).val() === '') {
                    return this.error(errorMessage);
                }
            }
            return this.success(successMessage);
        },

        isNumber: function (element) {
            if (element === undefined && element.length === 0) {
                throw new $f.Exception("element is null");
            }
            var successMessage = "წარმატებით გაიარა ვალიდაცია";
            var errorMessage = "არ არის რიცხვი";

            var valStr = $f.selector(element).val();
            var val = parseInt(valStr);
            var isNumeric = val.toString() == valStr;

            if (isNaN(val) || !isNumeric) {
                setTimeout(function () {
                    $f.validator.print.error(element, errorMessage);
                }, 1);

                return this.error(errorMessage);
            }
            $f.validator.print.success(element, successMessage);

            return this.success(successMessage);
        },
        /* sf-validate="min:5 , max:7" or sf-validate="20"  */
        Length: function (element, args) {
            var successMessage = "წარმატებით გაიარა ვალიდაცია";
            if (element === undefined && element.length === 0) {
                throw new $f.Exception("argument null exception: element is null");
            }
            if (args === undefined || args.length === 0) {
                throw new $f.Exception("argument null exception: args is null");
            }
            if (args.indexOf(':') > 0 || args.indexOf(',') > 0) {
                var parseArgs = args.split(',');
                if (parseArgs.length > 1) {
                    throw new $f.Exception("validate exception: argument format incorect");
                }
                var tempInfoMinLength = parseArgs[0].toString().toLowerCase().trim();
                if (tempInfoMinLength === undefined || tempInfoMinLength.length === 0) {
                    throw new $f.Exception("validate exception: argument format incorect");
                }
                tempInfoMinLength = tempInfoMinLength.split(':');
                if (tempInfoMinLength.length !== 2) {
                    throw new $f.Exception("validate exception: argument format incorect");
                }
                var tempInfoMaxLength;
                if (parseArgs.length >= 2) {
                    tempInfoMaxLength = parseArgs[1].toString().toLowerCase().trim();
                    if (tempInfoMaxLength === undefined || tempInfoMaxLength.length === 0) {
                        throw new $f.Exception("validate exception: argument format incorect");
                    }
                    tempInfoMaxLength = tempInfoMaxLength.split(':');
                    if (tempInfoMaxLength.length !== 2) {
                        throw new $f.Exception("validate exception: argument format incorect");
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
                   $f.selector(element).val().length < validateMinLength) {
                    return this.error(minLengthErrorMessage);
                }

                if (validateMaxLength !== undefined &&
                    $f.selector(element).val().length > validateMaxLength) {
                    return this.error(maxLengthErrorMessage);
                }
            }
            else {
                var validateLength = args.trim();
                var lengthErrorMessage = "სიმბოლოების რაოდენობა ზუსტად უნდა იყოს " + validateLength;
                if (validateLength !== undefined &&
                  $f.selector(element).val().length !== validateLength) {
                    return this.error(lengthErrorMessage);
                }
            }

            return this.success(successMessage);
        },
        /* sf-validate="mail:true" */
        isMail: function (element) {
            var successMessage = "წარმატებით გაიარა ვალიდაცია";
            if (element === undefined && element.length === 0) {
                throw new $f.Exception("argumentnullexception element is null");
            }

            var validateMailErrorMessage = "mail format incorect";

            var input = $f.selector(element).val();
            if (input === '') {
                return this.success(successMessage);
            }

            var mailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/);
            var isValidMail = mailRegex.test(input);

            if (!isValidMail) {
                return this.error(validateMailErrorMessage);
            }

            return this.success(successMessage);
        },
        /* sf-validate="regex:true" */
        testRegex: function (element, regex) {
            if (element === undefined && element.length === 0) {
                throw new $f.Exception("argumentnullexception element is null");
            }
            var validateRegexErrorMessage = "მონაცემები არასწორია";

            var objectRegex = new RegExp(regex);
            var isValid = objectRegex.test($f.selector(element).val());

            if (!isValid) {
                return this.error(validateRegexErrorMessage);
            }
            return this.success();
        },
        /* sf-validate="compare:100" or sf-validate="compare:SmartFront" */
        compare: function (element, compareTo) {
            if (element === undefined && element.length === 0) {
                throw new $f.Exception("argumentnullexception element is null");
            }
            var validateCompareErrorMessage = "not equals " + compareTo;
            var successMessage = "წარმატებულად გაიარა ვალიდაცია";
            if (validateCompare != undefined) {

                if (compareTo != undefined) {
                    if ($f.selector(element).val() != compareTo) {
                        return this.error(validateCompareErrorMessage);
                    }
                }
            }
            return this.success(successMessage);
        }

    },

};
