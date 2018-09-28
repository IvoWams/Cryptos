var picker =
    {

        open: function (options) {

            this.search = options.search || function(){ return true; };

            var $picker = $('popup[name=picker]');
            var $content = $picker.children('content');
            var $paginator = $picker.children('paginator');
            var $button_ok = $picker.find('button[name=ok]');
            var $button_cancel = $picker.find('button[name=cancel]');
            var $title = $picker.children('title');
            var $input_search = $picker.find('input[name=search]');

            $title.show().html(options.title ? options.title : get_string('PICKER'));          

            var selected = null;
            var paginator = null;
            var search_timeout = null

            $input_search
                .unbind('keydown')
                .bind('keydown', function(){
                    clearTimeout(search_timeout);
                    search_timeout = setTimeout(function(){ paginator.refresh(); }, 300);
                });

            popup.show('picker');

            if(options.items && options.source)
                console.warn('Both items and datasource provided');

            var that = this;

            var paginator = new Paginator({
                items: options.items || [],
                $content: $content,
                $paginator: $paginator,
                html_item: options.html,
                sort: options.sort,
                adjust_height: false,
                filter: function(obj){

                    var str_search = $input_search.val().toUpperCase();
                    if(str_search == '')
                        return true;

                    return that.search.some(function(field){
                        return eval('obj.'+ field).toUpperCase().indexOf(str_search) != -1;
                    });
                    
                },
                on_select: function(obj, $ui){
                    $content.children().removeClass('selected');
                    $ui.addClass('selected');
                    selected = obj;
                },
                grid: [10, 10],
                min_item_size: [200, 150]
            });

            var previous_size = [$content.width(), $content.height()];
            window.addEventListener('resize', function(){
                if($content.width != previous_size[0] || $content.height() != previous_size[1]){
                    paginator.adjustPageSize();
                    previous_size = [$content.width(), $content.height()];
                }
            }); 
            
            if(options.source)
                data.get({
                    path: options.source,
                    success: function(list){
                        paginator.items = list;
                        paginator.refresh();
                    }
                });

            $button_ok
                 .unbind('click')
                 .bind('click', function (e) {

                    if(!selected)
                        console.error('Nothing picked');

                    else
                        options.on_pick(selected);

                });

            $button_cancel
                .unbind('click')
                .bind('click', function (e) {
                    popup.hide();
                });

        }

    }
