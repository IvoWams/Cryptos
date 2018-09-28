var nice =
    {
        duration: function (value) {

            return (
                value >= 3600 ? Math.floor(value / 3600)
                    + ':'
                    + String('00' + Math.floor((value % 3600) / 60)).slice(-2) : Math.floor((value % 3600) / 60)) + ':' + String('00' + (value % 60)).slice(-2);
        },
        file_size: function (value) {
            if (value > 1000000000) return Math.floor(value / 10000000) / 100 + ' GB';
            if (value > 1000000) return Math.floor(value / 10000) / 100 + ' MB';
            if (value > 1000) return Math.floor(value / 10) / 100 + ' KB';
            return value + ' B';
        },
        boolean: function (bool) {
            return bool ? 'Ja' : 'Nee';
        },
        // Passthrough?
        integer: function (nr) {
            return nr;
        },
        string: function (str) {
            return str;
        }
    }

var escape =
    {

        entityMap:
        {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        },

        html: function (string) {
            return String(string).replace(/[&<>"\/]/g, function (s) {
                return escape.entityMap[s];
            });
        },

        string: function (string) {
            return String(string).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
        }

    }