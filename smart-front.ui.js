$f.ui =
{
    showDialog: function (dialogHtml, vmName, onHide) {

        var dialogSelector = $f.selectors.getVMSelector(vmName);

        $(document.body).append(dialogHtml);
        $(dialogSelector).modal('show');


        $(dialogSelector).on('hidden.bs.modal', function (e) {
            $(dialogSelector).remove();
            $(document.body).removeClass('modal-open');

            if (onHide != undefined) {
                onHide(dialogSelector);
            }

        });
        if (dialogSelector.length > 0) {
            $f.registerVmRecursion(dialogSelector);
        }
    },
    closeDialog: function (dialogSelector) {
        if (!dialogSelector) {
            dialogSelector = '.modal';
        }

        $(dialogSelector).modal('hide');
    }

}
