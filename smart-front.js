

(function (window, undefined) {
    window.$f = {

        view: function (viewName) {
            return $f.selector($f.selectors.getVMSelector(viewName));
        },
        field: function (viewName, field) {
            return $f.selector($f.selectors.getVMSelector(viewName)).find("sf-field='" + field + "'");
        },
        selector: $,
        version: "1.0.2",
        Exception: function (message) {
            this.message = message;
            this.name = "Exception";
        },
        unbindevents: function () {
            $f.selector(this.selectors.getAllEvents()).unbind();
        },
        selectors: {
            getAllEvents: function () {
                return "[sf-event]";
            },
            getVMSelector: function (viewName) {
                return "[sf-vm='" + viewName + "']";
            },
        },

        jQueryInit: function () {
            if (jQuery === undefined) {
                throw new $f.Exception("jQuery undefined");
            }
            jQuery(document).ready(function () {
                $f.init();
            });
        },
        views: [],
        refreshIgnoreList: ['viewName', 'refresh', 'isValid'],
        refreshDom: function (viewDom, model) {
            $f.selector(viewDom).find('input, textarea').bind("keypress keyup", function () {
                var self = this;
                setTimeout(function () {
                    model.refresh($f.selector(self).attr('sf-field'));
                }, 10);
            });

            $f.selector(viewDom).find('select').bind("change", function () {
                var self = this;
                setTimeout(function () {
                    model.refresh($f.selector(self).attr('sf-field'));
                }, 10);
            });
        },
        validate: function (viewDom) {
            if ($f.validator !== undefined && $f.validator.autoValidator !== undefined) {
                $f.validator.autoValidator(viewDom);
            }
        },
        viewCallBack: function (createview, model) {
            if (createview.init !== undefined && typeof (createview.init) === "function") {
                createview.init(model);
            }
            model.refresh();
        },
        clear: function () {
            this.views = [];
            this.unbindevents();
            if ($f.validator !== undefined) {
                $f.validator.unbindevents();
            }
        },
        registerVM: function (elementVm, callback) {
            var viewSelector = $f.selector(elementVm);
            if ($f.selector(viewSelector).length > 0) {
                var viewDom = $f.selector(viewSelector);
                var viewName = $f.getVMName(viewSelector);
                var className = viewName.toString();
                var createview = new window[className]();
                if (viewDom.length > 0) {
                    $f.registerEvents(viewDom, createview);
                    var model = $f.getModel(viewDom);
                    $f.refreshDom(viewDom, model);
                    $f.viewCallBack(createview, model);
                    $f.validate(viewDom);
                    $f.views.push(className);
                    console.log('register vm =>' + elementVm);
                }
            }

        },
        registerVmRecursion: function (elementVm) {
            $f.registerVM(elementVm);
            var viewSelector = $f.selector(elementVm);
            var childVms = $(viewSelector).find("[sf-vm]");
            $.each(childVms, function (index, element) {
                var viewName = $(element).attr('sf-vm');
                $f.registerVM($f.selectors.getVMSelector(viewName));
            });

        },
        registerVMName: function (viewName) {
            this.registerVM($f.selectors.getVMSelector(viewName));
        },
        init: function () {
            if ($f.views.length > 0) {
                this.clear();
            }
            setTimeout(function () {
                $f.selector('[sf-vm]').each(function (index, viewSelector) {
                    $f.registerVM(viewSelector);
                });

                console.log('init views => \n' + $f.views);

            }, 1);
        },
        getVMName: function (view) {
            return $f.selector(view).attr('sf-vm');
        },
        getElementValue: function (element) {

            var tagName = $f.selector(element).prop("tagName").toLowerCase();
            if (tagName === undefined) {
                tagName = $(element)[0].nodeName;
                tagName = tagName.toLowerCase();
            }
            switch (tagName) {
                case 'select':
                case 'input':
                    return $f.selector(element).val();
                case 'textarea':
                    $f.selector(elem).text();
                case 'span':
                case 'p':
                    return $f.selector(element).html();
                default: $f.selector(element);
            }
            return undefined;
        },
        setElementValue: function (element, val) {

            element.each(function (index, elem) {
                var tagName = $f.selector(elem).prop("tagName").toLowerCase();

                if (val.length === 0) {
                    $f.selector(elem).removeClass('edited');
                }
                else {
                    $f.selector(elem).addClass('edited');
                }

                switch (tagName) {
                    case 'input':
                        $f.selector(elem).val(val);
                        break;
                    case 'textarea':
                        $f.selector(elem).text(val);
                        break;
                    case 'span':
                    case 'p':
                        $f.selector(elem).html(val);
                        break;
                }
            });
        },
        getModel: function (view) {
            var model = {};
            var viewName = $f.getVMName(view);
            var fields = $f.selector(view).find("[sf-field]");
            model["viewName"] = viewName.toString();
            model["refresh"] = function (fieldName) {
                if (fieldName !== undefined && fieldName.length > 0) {
                    var val = this[fieldName]();
                    this[fieldName](val);
                }
                else {
                    var viewName = this["viewName"];

                    var fields = $($f.selectors.getVMSelector(viewName)).find("[sf-field]");

                    for (var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        var _fieldName = $(field).attr('sf-field');
                        var val = $f.getElementValue(field);
                        this[_fieldName](val);
                    }

                }
            };

            model["isValid"] = function () {
                if ($f.validator !== undefined && $f.validator === "object") {
                    throw new $f.Exception("validator not init");
                }
                var returnValue = true;
                var fieldsArray = fields;
                $f.selector(fieldsArray).each(function (index, field) {
                    var fieldSelector = $f.selector(field);
                    if (fieldSelector !== undefined && fieldSelector.length > 0) {
                        var attrValidate = $f.selector(field).attr("sf-validate");
                        if (attrValidate !== undefined && attrValidate.length > 0) {
                            if ($f.validator === undefined) {
                                throw new $f.Exception("$f.validator not found");
                            }

                            returnValue = $f.validator.valid(fieldSelector, attrValidate);

                            if (returnValue === false) {
                                return false;
                            }
                        }
                    }
                });
                return returnValue;
            };

            $f.selector(fields).each(function (index, field) {
                var fieldName = $f.selector(field).attr("sf-field");

                model[fieldName] = function (value) {
                    var cntName = this["viewName"];
                    var fieldElement = $f.selector("[sf-vm='" + cntName + "']").find("[sf-field='" + fieldName + "']").first();
                    var bindElements = $f.selector("[sf-vm='" + cntName + "']").find("[sf-readonly='" + fieldName + "']");
                    if (value === undefined) {
                        return $f.getElementValue($f.selector(fieldElement));
                    }
                    else if (bindElements.length > 0) {
                        $f.setElementValue($f.selector(bindElements), value);
                        $f.setElementValue($f.selector(fieldElement), value);
                        return true;
                    }
                    return false;
                };
            });

            return model;
        },

        registerEvents: function (view, viewFunction) {
            var elements = $f.selector(view).children("[sf-event]");

            $f.selector(elements).each(function (index, element) {
                var eventData = $f.selector(element).attr("sf-event");
                var eventsArray = eventData.split(',');
                for (var i = 0; i < eventsArray.length; i++) {
                    var attrArray = eventsArray[i].split('=>');
                    if (attrArray.length === 2) {
                        var eventName = attrArray[0].toString().toLowerCase().trim();
                        var actionName = attrArray[1].toString().trim();

                        $f.selector(element).on(eventName, function () {
                            var self = this;
                            setTimeout(function () {
                                var model = $f.getModel(view);

                                var paramsStr = $(self).attr('sf-params');
                                if (paramsStr === undefined) {
                                    viewFunction[actionName](model);
                                }
                                else {
                                    var paramsObj = JSON.parse(paramsStr);
                                    viewFunction[actionName](model, paramsObj);
                                }

                            }, 10);
                        });
                    }
                }
            });
        },

    };
    window.SmartFront = $f;
    window.onload = function (e) {
        $f.jQueryInit();
    };
})(window);
