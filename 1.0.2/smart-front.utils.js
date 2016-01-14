/* global $ */

function SmartFrontUtils() {

    function htmlEncode(value) {
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
        return $('<div/>').text(value).html();
    }
    this.createView = function(vmName)
    {
        try {
            var vm = new window[vmName]();
            return vm;
        } catch (e) {
            console.error(vmName + ' function not founnd');
            console.error(vmName + ' function create');
            return undefined;
        }
    };
    this.unbindevents = function () {
        $('[sf-event]').unbind();
    };
    this.NewGuid = function () {
        function n() {
            return Math.floor((1 + Math.random()) * 65536)
                .toString(16)
                .substring(1);
        }
        return n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n()

    },
    this.GuidIsEmpty = function(guid) {
        if (guid === undefined ||
            guid == null ||
            guid === "" ||
            guid.length === 0 ||
            guid === "00000000-0000-0000-0000-000000000000") {
            return true;
        }
        return false;
    },
    this.getElementValue = function (element) {
        var tagName = $(element).prop("tagName").toLowerCase();
        if (tagName === undefined) {
            tagName = $(element)[0].nodeName;
            tagName = tagName.toLowerCase();
        }
        switch (tagName) {
            case 'select':
                return $(element).val();
            case 'input':
                {
                    if ($(element).is(":checkbox")) {
                        return $(element).is(":checked");
                    }
                    else {
                        return $(element).val();
                    }

                }
            case 'textarea':
            case 'label':
                return $(element).text();
            case 'div':
            case 'span':
            case 'p':
                return $(element).html();
            default: $(element);
        }
        return undefined;
    };

    this.setElementValue = function (vm, elements, excludeElement, val) {

        for (var index = 0; index < elements.length; index++) {

            var element = elements[index];

            // Skip operation if element equals to excludeElement
            if (excludeElement !== undefined &&
                excludeElement.length === 1 &&
                element === excludeElement[0]) {
                continue;
            }

            var tagName = $(element).prop("tagName").toLowerCase();
            if (val === null || val.length === 0) {
                $(element).removeClass('edited');
            }
            else {
                $(element).addClass('edited');
            }

            switch (tagName) {
                case 'select':
                    {
                        if ($(element).hasClass("select-picker")) {
                            $(element).selectpicker('val', val);
                        }
                        else {
                            $(element).find('option').each(function () {
                                if ($(this).val() === val) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        }

                    }; break;
                case 'input':
                    if ($(element).is(':checkbox')) {
                        var value = JSON.parse(val.toString());
                        $(element).prop("checked", value);
                    } else {
                        $(element).val(htmlEncode(val));
                    }
                    break;
                case 'textarea':
                case 'label':
                    $(element).text(htmlEncode(val));
                    break;
                case 'div':
                case 'span':
                case 'p':
                case 'b':
                    $(element).html(htmlEncode(val));
                    break;
            }
        }
    };

};