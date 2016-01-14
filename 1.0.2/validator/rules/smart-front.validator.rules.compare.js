/* sf-validate="compare:100" or sf-validate="compare:SmartFront" */
sf.validator.rules.compare = function (element, rule, vmName) {

    if (element === undefined && element.length === 0) {
        throw new sf.Exception("Element is null");
    }

    var compareValue = rule.value.trim().toLowerCase();
    if (compareValue === undefined) {
        throw new sf.Exception("Syntax error. Incorrect compare rule.");
    }

    var vmElement = $('[sf-vm="' + vmName + '"]');
    var compareElement = $(vmElement).find('[sf-field="' + compareValue + '"]').first();

    var sourceValue = sf.utils.getElementValue(element);

    if (compareElement.length === 0) {
        // element not found. Try to compare values directly

        if (sourceValue != compareValue) {
            return this.error();
        } else {
            return this.success();
        }

    } else {
        var compareElementValue = sf.utils.getElementValue(compareElement);
        if (sourceValue != compareElementValue) {
            return this.error();
        } else {
            return this.success();
        }
    }
};