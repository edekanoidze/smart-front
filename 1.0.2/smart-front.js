/* global $ */
function SmartFront() {

    this.version = "1.1.0";
    this.language = 'ka';
    this.Exception = function (message) {
        this.message = message;
        this.name = "Exception";
    };

    this.viewModels = [];
    // this.refreshIgnoreList = ['viewName', 'refresh', 'isValid'];

    this.unbindEvents = function (vmName) {
        if (vmName === undefined) {
            $('[sf-event]').unbind();
        }
        else {
            $('[sf-vm="' + vmName + '"]')
                .find('[sf-event]')
                .unbind();
        }

    };

    this.registerDomRefresh = function (viewDom, model) {
        $(viewDom).find('input, textarea').bind("keypress keyup", function () {
            var self = this;
            setTimeout(function () {
                model.refresh($(self));
            }, 10);
        });

        $(viewDom).find('select').bind("change", function () {
            var self = this;
            setTimeout(function () {
                model.refresh($(self));
            }, 10);
        });
    };

    this.validate = function (vmElement) {
        if (sf.validator !== undefined && sf.validator.validateVm !== undefined) {
            sf.validator.validateVm(vmElement);
        }
    };

    this.initializeVm = function (vm, model) {
        if (vm.init !== undefined && typeof (vm.init) === "function") {
            vm.init(model);
        }
    };

    this.clear = function (vmNameArray) {
        if (vmNameArray === undefined || vmNameArray == null || vmNameArray.length === 0) {
            this.viewModels = [];
            this.unbindEvents();
            if (sf.validator !== undefined) {
                sf.validator.unbindEvents();
            }
        }
        else {
            for (var i = 0; i < vmNameArray.length ; i++) {
                var vmName = vmNameArray[i].toString();
                if (vmName.length > 0 && vmName !== "") {
                    this.unbindEvents(vmName);
                    if (sf.validator !== undefined) {
                        sf.validator.unbindEvents(vmName);
                    }
                }
            }
        }
    };
    this.registerViewModel = function (vmElement) {
        var e = $(vmElement);
        if (e.length === 0) {
            return;
        }
        var vmName = e.attr('sf-vm');
        this.clear([vmName.toString()]);
        var vm = sf.utils.createView(vmName);
        if (vm === undefined) {
            throw sf.Exception(vmName + "not founnd");
        }
        var model = SmartFrontModel(e);

        sf.registerEvents(e, vm);
        sf.registerDomRefresh(e, model);
        sf.initializeVm(vm, model);
        sf.validate(e);
        sf.viewModels.push(vmName);
        model.refresh();
        // console.log('register vm =>' + e);
    };

    this.registerViewModelRecursive = function (vmElement) {
        $f.registerViewModel(vmElement);
        var viewSelector = $(vmElement);
        var childVms = $(viewSelector).find("[sf-vm]");
        $.each(childVms, function (index, element) {
            var vmName = $(element).attr('sf-vm');
            $f.registerViewModel($("[sf-vm=" + vmName + "]"));
        });
    },
    this.init = function () {
        if (sf.viewModels.length > 0) {
            this.clear();
        }
        setTimeout(function () {
            $('[sf-vm]').each(function (index, element) {
                sf.registerViewModel(element);
            });
            sf.initCallback();
        }, 1);
    };
    this.initCallback = function () { };
    this.registerEvents = function (vmElement, vm) {
        var elements = $(vmElement).find("[sf-event]");

        $(elements).each(function (index, element) {
            var eventData = $(element).attr("sf-event");
            var eventsArray = eventData.split(',');

            for (var i = 0; i < eventsArray.length; i++) {

                var attrArray = eventsArray[i].split('=>');
                if (attrArray.length !== 2) {
                    continue;
                }

                var eventName = attrArray[0].toLowerCase().trim();
                var actionName = attrArray[1].trim();

                $(element).on(eventName, function () {
                    var self = this;
                    setTimeout(function () {

                        var model = SmartFrontModel(vmElement);
                        var paramsStr = $(self).attr('sf-args');
                        if (paramsStr === undefined) {
                            vm[actionName](model);
                        }
                        else {
                            var paramsObj = JSON.parse(paramsStr);
                            vm[actionName](model, paramsObj);
                        }

                    }, 10);
                });

            }
        });
    };

};