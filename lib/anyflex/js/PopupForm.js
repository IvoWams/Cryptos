// Iterate concurrently through dom nodes to find by name
/*
Object.prototype.find_child = function(name){
    if(this.name == name)
        return this;

    if(!this.hasChildNodes())
        return false;

    for(var i = 0; i < this.childNodes.length; i++){
        var a = this.childNodes[i].find_child(name);
        if(a) return a;
    }

    return false;
}
*/

// Anyflex.PopupForm

var PopupForm = function (init) {
    var form = document.getElementsByName(init.form);
    if (form.length == 0)
        throw Error('Popup form element not found');
    this.form = form[0];

    var focus = document.getElementsByName(init.focus);
    if (focus.length > 0)
        this.focus = focus[0];

    this.select = init.select || false;
    this.auto_close = init.auto_close || true;

    // Get the confirm button
    var confirm = form.getElementsByTagName('CONFIRM');
    if (confirm.length == 0)
        throw Error('No confirm button found');

    var that = this;

    this.button_confirm = confirm[0];
    this.button_confirm.addEventListener('click', function () {
        // Gather data;
        init.on_confirm(this.get_data());
        if(that.auto_close) that.toggle(false);
    });

    // Get the cancel button
    var cancel = form.getElementsByTagName('CANCEL');
    if (cancel.length == 0)
        throw Error('No cancel button found');
    this.button_cancel = cancel;
    this.button_cancel.addEventListner('click', function () {
        that.toggle(false);
    });
}

// Retrieve data from the form
PopupForm.prototype.get_data = function () {

    var that = this;
    var data = [];

    // Of which we can get the value fields
    ['INPUT', 'TEXTAREA', 'SELECT'].forEach(function (tag_name) {
        that.form.getElementsByTagName(tag_name).forEach(function (obj) {
            data.push({
                name: obj.name,
                value: obj.value
            });
        });
    });

    // Radio
    that.form.getElementsByTagName('RADIO').forEach(function (obj) {
        if (obj.selected)
            data.push({
                name: obj.name,
                value: obj.value
            });
    });

    // Checkboxes
    that.form.getElementsByTagName('CHECKBOX').forEach(function (obj) {
        if (obj.checked)
            data.push({
                name: obj.name,
                value: obj.value
            });
    });

    return data;
}

PopupForm.prototype.toggle = function (bool) {
    this.form.style.display = bool ? 'block' : 'none';
}



var popup_form = new PopupForm({
    name: "test",
    focus: "input",
    select: true,
    // close_on_save: true,
    on_confirm: function (form_data) {

        var that = this;

        data.post({
            path: '/path/to/data_handler/',
            data: {
                form_data: form_data
            },
            success: 
        })

        var that = this;
        // data.post({path:'somewhere',{data: data}, success:{}, })
    }
})




/*

    PopupForm expects a layout like this:

    <popupform name="test">

        <title>
            Popup form title
        </title>

        <label for="input">Input</label>
        <input name="input"></input>

        <checkbox name="checkbox">Checkbox</checkbox>
        
        <radio name="radio" selected value="radio_1">radio 1</radio>
        <radio name="radio" value="radio_2">Radio 2</radio>
        <radio name="radio" value="radio_3">Radio 3</radio>

        <label for="textarea">Textarea:</textarea>
        <textarea name="textarea"></textarea>

        <buttons>
            <confirm>Ok</confirm>
            <cancel>Cancel</cancel>
        </buttons>

    </popupform>

*/