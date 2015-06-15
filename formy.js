/* ***************** *
 * FORM HELPER CLASS *
 * ***************** */
function Formy(form) {
	this._form = form;
	this._eles = form.elements;
	this._reset = form.reset;
	this._submit = form.submit;
}
