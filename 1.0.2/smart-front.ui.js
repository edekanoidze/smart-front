
function SmartFrontUI() {
    this.rootPath = "/SmartFront/RenderView";

    this.deleteDialog = "[Message]";
    this.showDialog = function (dialogHtml, onHide, callback) {

        var id = $(dialogHtml).attr('id');
        if (id === undefined) {
            id = sf.utils.NewGuid();
        }
        id = 'dialog' + id;
        dialogHtml = $(dialogHtml).attr('id', id);

        $(document.body).append(dialogHtml);

        var dialogSelector = '#' + id;
        $(dialogSelector).modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });

        $(dialogSelector).on('hidden.bs.modal', function () {
            $(dialogSelector).remove();
            $(document.body).removeClass('modal-open');

            if (onHide != undefined) {
                onHide(dialogSelector);
            }
        });

        var viewModels = $(document.body).find('#' + id).find('[sf-vm]');
        for (var i = 0; i < viewModels.length; i++) {
            sf.registerViewModel(viewModels[i]);
        }
        this.initUi();

        return id;
    };

    this.closeDialog = function (vmElement) {
        if (vmElement !== undefined) {
            var modal = $(vmElement).parent('.modal');
            if (modal.length > 1) {
                modal = $(modal)[0];
            }
            if (modal.length === 0) {
                modal = $(vmElement).closest('.modal').first();
            }
            if (modal.length === 1) {
                $(modal).modal('hide');
            }
        } else {
            $(".modal").modal('hide');
        }
    };

    this.blockUi = function () { console.warn("override this method") };
    this.unBlockUi = function () { console.warn("override this method") };
    this.lockUi = function (callback,args) {
        this.blockUi();
        try {
            if (typeof (callback) === "function") {
                if (args !== undefined) {
                    callback(args);
                }
                else {
                    callback();
                }
            }
            this.unBlockUi();
        } catch (e) {
            this.unBlockUi();
            console.warn(e);
        }
    };
    this.promptDeleteUi = function (message, okfunction) {
        if (message.length === 0) {
            throw sf.Exception("message is undefined");
        }
        if (typeof (okfunction) !== "function") {
            throw sf.Exception("function is undefined");
        }
        var html = this.deleteDialog.replace("[Message]", message);
        var id = this.showDialog(html);
        $("#" + id + ' .dialog-delete-btn').unbind('click');
        $("#" + id).on('click', ' .dialog-delete-btn', function (e) {
            sf.ui.lockUi(function () {
                okfunction();
                sf.ui.closeDialog($("#" + id));
            });

        });
    };
    this.renderView = function (viewName, model, callback) {
        if (typeof (model) !== "object") {
            model = JSON.parse(model);
        }
        var data = {
            viewName: viewName,
            model: JSON.stringify(model)
        };
        $Ajax.invoke({
            autoInitializer: false,
            url: this.rootPath,
            type: 'POST',
            data: data,
            callback: function (result) {
                if (result.Status === 1) {
                    if (callback == undefined) {
                        sf.ui.renderString(result.Content);
                    }
                    else {
                        callback(result.Content);
                    }
                    sf.ui.initUi();
                }
                else {
                    console.warn("renderView Error => \n" + result);
                }
            }
        });
    };
    this.renderString = function (content) {
        if (content.length > 0) {
            var contentId = $(content).attr('Id');
            if (contentId === undefined) {
                return;
            }
            var domElement = $('#' + contentId);
            if (domElement.length > 0) {
                $(domElement).html(content);
                var domElementParent = $(domElement).parent('div').first();
                if (domElementParent !== undefined) {
                    var viewModels = $(domElementParent).find('[sf-vm]');
                    if (viewModels.length === 0) {
                        viewModels = $(domElementParent).closest('[sf-vm]');
                    }
                    for (var i = 0; i < viewModels.length; i++) {
                        sf.registerViewModel(viewModels[i]);
                    }
                }

            }
        }
    };
    this.initUi = function () { console.warn("override this method") };
};