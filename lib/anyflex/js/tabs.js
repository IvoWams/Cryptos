$(document)

    .on('click', 'tabs > tab:not(.selected)', function(){

        if($($(this).attr('target')).length == 0)
            console.warn('Tab target not found', $(this).attr('tab_target'));

        // Deselect all sibling tabs and their targets
        $(this).siblings().each(function(){
            $(this).removeClass('selected');
            $($(this).attr('target')).hide();
        });

        // Re-enable tab click on
        $(this).addClass('selected');
        $($(this).attr('target')).show();

        // Run on_change event
        if($(this).attr('on_change'))
            eval($(this).attr('on_change'));
    })

    .on('click', 'tabs', function(){
        getSelection().removeAllRanges()
    })


    .ready(function(){

        if(window.location.hash != '')
            $('tab[name='+ window.location.hash.substr(1) +']').click();

        else {

            // Click first target
            $('tab:first').click();


        }

    })
    ;