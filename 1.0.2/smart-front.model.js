/* global $ */
/* global sf */
function SmartFrontModel(vmElement) {

    var model = {};
    var fields = $(vmElement).find("[sf-field]");

    var refresh = function (element) {

        var fieldName = $(element).attr('sf-field');

        if (fieldName !== undefined && fieldName.length > 0) {
            var val = sf.utils.getElementValue(element);
            this[fieldName](val, $(element));
        }
        else {
            var fields = $("[sf-vm='" + this["vmName"] + "']").find("[sf-field]");

            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var _fieldName = $(field).attr('sf-field');
                var val = sf.utils.getElementValue(field);
                this[_fieldName](val);
            }
        }
    };

    var isValid = function (fieldArgs) {
        if (sf.validator !== undefined && sf.validator === "object") {
            throw new sf.Exception("validator not found.");
        }
        var returnValue;
        var fieldsArray;
        var field;
        var vmName;
        if (fieldArgs === undefined || fieldArgs == null || fieldArgs.length === 0) {
            returnValue = true;
            fieldsArray = [];
            $(fields).each(function (index, field) {
                var validate = $(field).attr('sf-validate');
                if (validate != undefined && validate.length > 0) {
                    fieldsArray.push(field);
                }
            });
            for (var i = 0; i < fieldsArray.length; i++) {
                field = fieldsArray[i];
                vmName = model.vmName;
                returnValue = sf.validator.validateField($(field), vmName);
                if (returnValue === false) {
                    return false;
                }
            }
            return returnValue;
        }
        else {
            returnValue = true;
            fieldsArray = [];
            $(fields).each(function (index, field) {
                var validate = $(field).attr('sf-validate');
                if (validate != undefined && validate.length > 0) {
                    var fieldName = $(field).attr('sf-field');
                    for (var j = 0; j < fieldArgs.length; j++) {
                        if (fieldArgs[j].toString().toLowerCase() === fieldName.toString().toLowerCase()) {
                            fieldsArray.push(field);
                            continue;
                        }
                    }

                }
            });
            for (var i = 0; i < fieldsArray.length; i++) {
                field = fieldsArray[i];
                vmName = model.vmName;
                returnValue = sf.validator.validateField($(field), vmName);
                if (returnValue === false) {
                    return false;
                }
            }
            return returnValue;
        }
    };

    $(fields).each(function (index, field) {

        var fieldName = $(field).attr("sf-field");
        model[fieldName] = function (value, excludeElement) {
            var vmName = this["vmName"];
            var vm = $("[sf-vm='" + vmName + "']");
            var elements = vm.find("[sf-field='" + fieldName + "']");
            var firstElement = elements.first();

            if (value === undefined) {
                return sf.utils.getElementValue($(firstElement));
            }
            else if (elements.length > 0) {
                sf.utils.setElementValue(vm[0], $(elements), $(excludeElement), value);
                return true;
            }
            return false;
        };
    });

    model["refresh"] = refresh;
    model["isValid"] = isValid;
    model["vmName"] = $(vmElement).attr('sf-vm');
    model["vmElement"] = vmElement;
    return model;
};