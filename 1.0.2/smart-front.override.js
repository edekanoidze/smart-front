function componentReInit() {
   
}

function blockUi(selector) {

};
function unBlockUi(selector) {

};

$(document).ready(function () {
    $f.ui.deleteDialog = "deletedialog";
    $f.ui.blockUi = blockUi;
    $f.ui.unBlockUi = unBlockUi;
    $f.ui.initUi = componentReInit;
    $f.initCallback = componentReInit;
});