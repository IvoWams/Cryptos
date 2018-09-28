var SecurityPopup = function (init) {
    var self = this;

    if (init.entity) self.entity = init.entity;
    else throw Error('Missing entity');

    if (init.id) self.id = init.id;
    else throw Error('Missing id');

    // Hook interface elements through jQuery
    self.$popup = $('[name=popup_security]');
    self.$input_account_search = self.$popup.find('input[name=account_search]');
    self.$container_security = self.$popup.find('content[name=security]');
    self.$container_accounts = self.$popup.find('content[name=accounts]');
    self.$buttons_security_options = self.$popup.find('buttons[name=security_options]');
    self.$button_security_delete = self.$popup.find('button[name=security_delete]');
    self.$button_security_save = self.$popup.find('button[name=security_save]');

    // Expand flags ?
    self.$checkbox_security_flag_read = self.$popup.find('input[name=security_flag_read]');
    self.$checkbox_seucirty_flag_write = self.$popup.find('input[name=security_flag_write]');

    // Layout
    self.container_height = init.container_height | 10;

    var html_security = function (security) {
        if (security.account)
            return '\
                <item '+ (security.selected ? 'class="selected"' : '') + '>\
                    <background style="background-position: 2px 50%; background-size: contain; background-image: url(/images/interface/account.png);"></background>\
                    <background class="overlay"></background>\
                    <border class="elegant"></border>\
                    <title style="left: 40px;">'+ security.account.name + '</title>\
                </item>\
            ';

        else
            return '\
                <item '+ (security.selected ? 'class="selected"' : '') + '>\
                    <background style="background-position: 2px 50%; background-size: contain; background-image: url(/images/interface/account_group.png);"></background>\
                    <background class="overlay"></background>\
                    <border class="elegant"></border>\
                    <title style="left: 40px;">'+ security.account_group.name + '</title>\
                </item>\
            ';
    }

    var html_account = function (account) {
        return '\
            <item>\
                <background style="background-position: 2px 50%; background-size: contain; background-image: url(/images/interface/account'+ (account.login ? '' : '_group') + '.png);"></background>\
                <background class="overlay"></background>\
                <border class="elegant"></border>\
                <title style="left: 40px;">'+ account.name + '</title>\
            </item>\
        ';
    }

    var create_account_security = function (account, read, write) {    // flags
        return {
            'account': account,
            'object': self.entity,
            'id': self.id,
            'read': read,
            'write': write
        }
    }

    var create_group_security = function (account_group, read, write) {
        return {
            'account_group': account_group,
            'object': self.entity,
            'id': self.id,
            'read': read,
            'write': write
        }
    }

    self.paginator_security = new Paginator({

        $content: self.$container_security,
        grid: [1, self.container_height],
        min_item_size: [0, 40],
        html_item: html_security,

        on_select: function (security_account) {

            self.paginator_security.items.forEach(function (s) { s.selected = false; });
            security_account.selected = !security_account.selected;

            self.$buttons_security_options.toggle(security_account.selected);

            self.$checkbox_security_flag_read
                .prop('checked', security_account.read)
                .off('click')
                .on('click', function () {
                    security_account.read = $(this).prop('checked');
                })
                ;

            self.$checkbox_seucirty_flag_write
                .prop('checked', security_account.write)
                .off('click')
                .on('click', function () {
                    security_account.write = $(this).prop('checked');
                })
                ;

            self.paginator_security.refresh();
        },

        sort: function (a, b) {
            if (a.account && b.account_group)
                return 1;

            if (a.account_group && b.account)
                return -1;

            if (a.account && b.account)
                return a.account.name > b.account.name ? 1 : -1;

            return a.account_group.name > b.account_group.name ? 1 : -1;
        },
        filter: function (item) {
            return true;
        }
    });

    self.paginator_accounts = new Paginator({

        content: self.$container_accounts,
        grid: [1, self.container_height],
        min_item_size: [0, 40],
        html_item: html_account,

        on_select: function (account) {
            // remove this item from this list, add it to p_security
            self.paginator_security.addItems([account.login ? create_account_security(account, true, true) : create_group_security(account, true, true)]);
            self.paginator_security.refresh();
            self.paginator_accounts.refresh();
        },

        sort: function (a, b) {
            if (a.login && !b.login)
                return 1;

            if (!a.login && b.login)
                return -1;

            return a.name > b.name ? 1 : -1;
        },
        filter: function (item) {
            var is_account = item.login != undefined;

            for (sec_item_key in self.paginator_security.items) {
                var sec_item = self.paginator_security.items[sec_item_key];
                if ((sec_item.account && is_account && sec_item.account.id == item.id) ||
                    (sec_item.account_group && !is_account && sec_item.account_group.id == item.id))
                    return false;
            }

            var search = $('[name=p_accounts_search]').val().toUpperCase();
            if (search != '')
                return item.name.toUpperCase().search(search) != -1;

            return true;
        }
    });

    self.$container_accounts.addClass('loading');
    self.$container_security.addClass('loading');

    data.get({
        path: '/security/',
        data: {
            object: self.entity,
            id: self.id
        },
        success: function (list) {
            self.$container_security.removeClass('loading');

            self.paginator_security.setItems(list.groups.concat(list.accounts));
            self.paginator_accounts.refresh();

        },
        error: function (err) {
            // Error handler ?
        }
    });

    data.get({
        path: '/security/accounts/',
        success: function (result) {
            self.$container_accounts.removeClass('loading');
            self.paginator_accounts.setItems(result.accounts.concat(result.groups));
        },
        error: function (err) {
            // Might not have enough rights ...
        }
    });

    popup.show(self.$popup);
    // There is a bug somewhere with hidden containers
    self.paginator_accounts.adjustPageSize();
    self.paginator_security.adjustPageSize();

    // Delete security
    self.$button_security_delete
        .off('click')
        .on('click', function () {

            self.paginator_security.items = self.paginator_security.items.filter(function (security) { return !security.selected; });
            $('[name=security_options]').toggle(false);

            self.paginator_accounts.refresh();
            self.paginator_security.refresh();

        });

    // Saving changes
    self.$button_security_save
        .off('click')               // Rebinding because of static front end
        .on('click', function () {

            // Prevent double clicking (not a big deal)
            if (self.$button_security_save.hasClass('disabled'))
                return;

            self.$button_security_save.addClass('disabled');

            data.post({
                path: '/security/',
                data: {
                    entity: self.entity,
                    id: self.id,
                    security_items: self.paginator_security.items
                },
                success: function (result) {
                    self.$button_security_save.removeClass('disabled');
                    self.$buttons_security_options.hide();
                    popup.hide();
                },
                error: function (err) {
                    console.error(err);
                }
            });

        })
}

