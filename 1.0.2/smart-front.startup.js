/* global jQuery */
window.sf = new SmartFront();
window.sf.data = new SmartFrontRepository();
window.sf.ui = new SmartFrontUI();
window.sf.utils = new SmartFrontUtils();
window.sf.validator = new SmartFrontValidator();
window.sf.validator.printer = new SmartFrontValidatorPrinter();

window.$f = window.sf;

if (jQuery === undefined) {
    throw new sf.Exception("jQuery undefined");
}
jQuery(document).ready(function () {
    sf.init();
});