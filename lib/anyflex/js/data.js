
var data =
    {

        // Deprecated :

        // Convert json object to base64 encoded string
        jtod: function (json) {
            console.warn('DEPRECATED');
            return btoa(JSON.stringify(json));
        },

        // Convert base64 encoded string back to json object
        dtoj: function (data) {
            console.warn('DEPRECATED');
            return JSON.parse(atob(data));
        },


        get_file_data: function ($elm) {
            var files = $elm.prop('files');
            return data.get_form_data(files);
        },

        get_form_data: function (file_list) {
            var form_data = new FormData();

            for (var i = 0; i < file_list.length; i++)
                form_data.append('file', file_list[i]);

            return form_data;
        },

        upload: function (form_data, status) {

            // Handle onreadystatuschange for handling errors coming from the server ?

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload/ajax/', true);

            if (status.progress)
                xhr.upload.onprogress = function (e) {
                    if (e.lengthComputable)
                        status.progress(e.loaded, e.total);
                }

            if (status.success)
                xhr.onload = function () {
                    if (xhr.readyState === xhr.DONE && xhr.status === 200 && status.success)
                        status.success(xhr.response);
                }

            // xhr.onerror handles network level errors, not errors reported by the server
            if (status.error)
                xhr.onerror = function () {
                    status.error('UPLOAD_NETWORK_ERROR');
                }

            xhr.send(form_data);
        },

        call: function (request_method, params) {

            $.ajax({
                type: request_method,
                url: params.path,
                data: params.data,
                timeout: params.timeout || 30000,
				cache: false,
                dataType: 'json',

                success: function (result) {

                    if (result.error) {
                        if (params.error) params.error(result.error);
                        else console.error(result.error);
                    }

                    else if (params.success) params.success(result);
                },
                error: function(jqxhr, textStatus, err){
                    if(params.error)
                        params.error(err);
                },
                failure: function (error) {

                    if (params.error)
                        params.error(error);

                    else
                        console.error(error);
                }
            });

        },

        // When POSTing data, convert javascript object to string
        post: function (params) {
            if(typeof params.data == 'object')
                params.data =  JSON.stringify(params.data);

            return data.call('POST', params);
        },


        // UPDATE resource
        put: function (params) {
            return data.call('PUT', params);
        },

        // Retrieve info (query string)
        get: function (params) {
            return data.call('GET', params);
        },

        // DELETE resource
        delete: function (params) {
            return data.call('DELETE', params);
        }



    }