// Here should be several helpers for the UX

var popup =
    {
        
        show: function (element) {
            var $popups = $('popups');
            var $popup = typeof element == 'string' ? $popups.find('[name='+ element +']') : element;
            var $focus = $($popup.attr('focus'));

            $popups.children().hide();
            $popups.css('display', 'flex');
            $popup.show();
            $focus.focus();
            
            // Auto select content when autofocus is an input box
            if($focus.length != 0 && $focus[0].tagName == 'INPUT')
                $focus.select();
        },

        hide: function () {
            $('popups').hide();
        },

        confirm: function (options) {
            popup.show('confirm');
            $('[name=confirm] > p').html(options.message);
            $('[name=confirm_cancel]')
                .off('click')
                .on('click', function () {
                    popup.hide();
                    if (options.on_cancel)
                        options.on_cancel();
                });
            $('[name=confirm_ok]')
                .off('click')
                .on('click', function () {
                    popup.hide();
                    if (options.on_ok)
                        options.on_ok();
                });
        }

    }

$(document)
    .on('click', '[name=close_overlay]', popup.hide)
    ;