/*
 * Paginator
 * Version: 0.1
 * Date: 10-2-2017
 * Author: i.wams@anyflex.nl
 * 
 * Javascript paginator implementation.
 * 
 * Use:
 * new Paginator(init)
 *  
 * For init:
 * on_select(obj, ui) - callback function when user clicked on a item tile
 * filter - filter function for the data
 * sort - sort items
 * item_min_size - minum size of item tiles
 *   if items are scaled smaller, the grid will be adjusted
 * grid - maximum amount of tiles
 * setItems(items) - set the items to be paginated
 * html_item - html view of the item
 * content - container element
 * 
 * 
 */

var Paginator = function (init) {

    // on_select will be called upon selection
    this.on_select = init.on_select;

    // After pressing a pagination button, this function will be called
    this.on_update = init.on_update || function () { };

    // Resizing
    this.on_resize = init.on_resize || function () { };

    // Collection to populate target container
    this.items = init.items || [];

    // viewer for the items
    this.html_item = init.html_item || function () { };

    // Apply filtering and sorting of items in the container
    this.filter = init.filter || function (a) { return true; };
    this.sort = init.sort || function (a, b) { return 1; };

    // Current selected page
    this.page = 0;

    // X and Y of item grid
    this.page_size = [0, 0];


    // Supply either jquery element or a selector
    if (init.$content) this.$content = init.$content;
    else {
        this.content = init.content;
        this.$content = $(this.content);
    }

    // Auto adjust height if container is height 0, or if forced
    this.adjust_height = this.$content.height() == 0 || init.adjust_height;

    if (this.$content.length == 0)
        return console.error('[Anyflex.Paginator] Container not found');

    // Either provide paginator element (jquery obj)
    if (init.$paginator) this.$paginator = init.$paginator;

    // Or point towards it in the DOM
    else this.$paginator = $('paginator[target=' + this.$content[0].id + ']');

    // Render methods:

    // Fixed width/height container
    // - Use predefined X/Y grid for the container
    // - Use predefined width height per item

    var that = this;

    var prev_content_size = [this.$content.width(), this.$content.height()];

    window.addEventListener('resize', function () {
        if (that.$content.width() != prev_content_size[0] || that.$content.height() != prev_content_size[1]) {
            that.adjustPageSize();
            prev_content_size = [that.$content.width(), that.$content.height()];
        }
    });

    if (init.grid) {

        this.render = 'grid';
        this.grid = init.grid;

        this.min_size = init.min_item_size || [300, 200];

        if (this.adjust_height)
            this.$content.height(this.min_size[1] * this.grid[1]);

        this.adjustPageSize();

    }

    // Pagination buttons
    this.page_buttons = [];

    // When a selected page is between MIN and MAX, try to show at least X pages around the current selected page
    this.paginator_range = init.paginator_range || 4;

    // Before paginator_simple_size threshold, all pages will be paginated
    this.paginator_simple_size = init.paginator_simple_size || 10;

    this.width = 0;
    this.height = 0;

    // Apply loading to container
    if (this.items.length == 0 && !init.show_loading_icon)
        this.$content.append('<loading/>');

    else
        this.refresh();

    var that = this;

    this.previous_width = that.$content.width();
    this.previous_height = that.$content.height();
}

Paginator.prototype.adjustPageSize = function () {

    // if this.render == grid ?
    this.item_size = [
        this.$content.width() / this.grid[0],
        this.$content.height() / this.grid[1]
    ];

    // Upper and lower limits ?
    if (this.item_size[0] < this.min_size[0])
        this.item_size[0] = this.min_size[0];

    if (this.item_size[1] < this.min_size[1])
        this.item_size[1] = this.min_size[1];

    // Adjust grid size

    this.page_size = [
        Math.floor(this.$content.width() / this.item_size[0]),
        Math.floor(this.$content.height() / this.item_size[1])
    ];

    // Always at least 1 column
    if (this.page_size[0] < 1)
        this.page_size[0] = 1;

    this.refresh();
}

Paginator.prototype.setItems = function (items) {
    this.items = items;
    // if (this.filter) this.items = this.items.filter(this.filter);
    if (this.sort) this.items = this.items.sort(this.sort);

    this.refresh();
}

Paginator.prototype.addItems = function (items) {
    this.items = this.items.concat(items)/* .filter(this.filter) */.sort(this.sort);
    this.refresh();
}

Paginator.prototype.setPageSize = function (x, y) {
    this.page_size = [x, y];
    this.refresh();
}

Paginator.prototype.refresh = function () {
    // Moved to create_page_buttons:
    // this.$paginator.empty();
    var current_page = this.page;

    this.$content.empty();

    // Number of pages the current set of items will take
    this.nr_pages = Math.ceil(this.items.filter(this.filter).length / (this.page_size[0] * this.page_size[1]));

    this.create_page_buttons();

    if (current_page > this.page_buttons.length - 1)
        current_page = this.page_buttons.length - 1;

    if (this.page_buttons.length > 0)
        this.set_page(this.page_buttons[current_page]);

    this.on_update();
}


Paginator.prototype.create_page_buttons = function () {
    var that = this;
    that.$paginator.empty();
    that.page_buttons = [];

    var fn_button = function (i) {
        var $btn = $('<button>' + (1 + i) + '</button>').toggleClass('selected', that.page == i);
        that.page_buttons.push($btn);
    }

    // Pagination

    // For Desktop:

    // Create a button for all page_size if size is small enough

    if (that.nr_pages < that.paginator_simple_size) {

        for (var i = 0; i < that.nr_pages; i++)
            fn_button(i);

    } else {


        // show first page
        fn_button(0);

        // If current page is at the start
        if (that.page <= that.paginator_range)
            for (var i = 1; i < that.paginator_range + that.page; i++)
                fn_button(i);

        else {

            // show 'inbetween'
            that.page_buttons.push($('<button_separator>...</button_separator>'));

            // Selected minus a few to selected and a few
            for (var i = that.page - that.paginator_range + 1; i < that.page + that.paginator_range && i < that.nr_pages; i++)
                fn_button(i);

        }

        // If still ways to go to last button
        if (that.page < that.nr_pages - that.paginator_range) {
            that.page_buttons.push($('<button_separator>&#133;</button_separator>'));
            fn_button(that.nr_pages - 1);
        }

    }

    // If just one button, hide the paginator
    this.$paginator.css('display', this.page_buttons.length > 1 ? 'flex' : 'none');

    this.page_buttons.forEach(function ($button) {
        that.$paginator.append($button);
        if ($button.prop('tagName') == 'BUTTON')         // Apply events for the buttons (not the separators)
            $button.click(function () {
                that.set_page($button);
                that.on_update();
            });
    });

}

Paginator.prototype.show_page = function () {
    var count = 0;
    var that = this;

    this.$content.empty();

    var list = that.items
        .filter(that.filter)
        .sort(that.sort);

    var add = function (item, width, height) {
        var $item = $(that.html_item(item));
        $item.prop('item', item);

        var marginLeft = parseInt($item.css('marginLeft'));
        var marginRight = parseInt($item.css('marginRight'));

        if (that.render == 'grid') {
            $item.css('width', width + '%');
            $item.css('height', height + '%');
        }

        if (that.on_select)
            $item.click(function () { that.on_select(item, $item); });

        that.$content.append($item);
    }

    // Todo: grid layout is ignored by flexbox, march 2017 will enable display: grid css in chrome
    for (var y = 0; y < this.page_size[1]; y++) {
        for (var x = 0; x < this.page_size[0]; x++) {
            var index = (this.page * this.page_size[0] * this.page_size[1]) + (y * this.page_size[0]) + x;
            if (list.length > index) add(list[index], 100 / this.page_size[0], 100 / this.page_size[1]);
        }
    }

    // Stretch parent container, if visible

    if (this.stretch_y && this.$content.is(':visible')) {
        if (this.$content.height() > this.height)
            this.height = this.$content.height();
        else
            this.$content.height(this.height);
    }
}

Paginator.prototype.set_page = function ($button) {

    this.$content.empty();

    this.page_buttons.forEach(function ($e) { $e.removeClass('selected'); });
    $button.addClass('selected');

    if (this.page_buttons.length == 1)
        $button.hide();

    this.page = parseInt($button.html()) - 1;

    this.show_page();
    this.on_update();

    // Update pagination
    this.create_page_buttons();
}
