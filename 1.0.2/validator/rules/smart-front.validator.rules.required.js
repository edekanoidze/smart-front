/* sf-validate="required:true" */
sf.validator.rules.required = function (element, rule, vmName) {

    if ($(element).is('select')) {
        var selectedOption = $(element).find('option:selected');
        var selectOptionValue = undefined;
        if (selectedOption !== undefined) {
            selectOptionValue = $(selectedOption).val();
        }
        if (!selectedOption ||
            selectedOption.attr('data-empty-option') == 'true' ||
            !selectOptionValue ||
            selectOptionValue.length === 0 ||
            selectOptionValue <= 0) {
            var selectId = $(element).attr('[sf-field]');

            var picker = $('[sf-field="' + selectId + '"]');
            if (picker === undefined || picker.length === 0) {
                picker = element;
            }
            return this.error();
        }
    }
    else if ($(element).is('input') || $(element).is('textarea')) {
        if ($(element).val() === '') {
            return this.error();
        }
    }

    return this.success();
};