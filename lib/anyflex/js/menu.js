$(document)

    .on('mouseover', '.menu_item', function () {
        var $parent = $(this);
        var $submenu = $('[parent=' + $parent.attr('id') + ']');

        $('.sub_menu_block').hide();

        if ($submenu) {
            $submenu
                .css({
                    display: 'flex',
                    left: $parent.position().left,
                    top: $parent.position().top + $parent.outerHeight()
                });


        }
    })

    .on('click', '*', function (e) {
        $('.sub_menu_block').hide();
    })

    .on('click', '.menu_item,.sub_menu_item', function () {

        var path = $(this).attr('path');

        if (path == undefined)
            return;

        if (path == '')
            window.location = '/';

        else
            window.location = '/' + path + '/';

    })

    ;