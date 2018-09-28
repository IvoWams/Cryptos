/*
    Upload wrapper

    Handles the dom interaction (progress bar), interacts with data functions (uploads file to server)
    
*/

var upload = {
    start: function(param){

        var $progress_bar = $(param.progress_bar);

        // Provide either a file_list (js FileList object, from drag and drop), or files_elm (which is an input element).

        var form_data = param.file_list ? data.get_form_data(param.file_list) : data.get_file_data ($(param.files_elm));

        // var form_data = data.get_file_data($files);

        // The file uploaded will be stored for the following content
        if(param.content)
             form_data.append('content', param.content);

        data.upload(form_data, {
            progress: function(loaded, total){
                $progress_bar.show();
                var perc = Math.round(loaded * 100 / total) + '%';
                $progress_bar.children('fill').css('width', perc);
                $progress_bar.children('label').html(get_string('UPLOAD_BUSY'));
                $progress_bar.children('value').html(perc);
            },
            success: function(response){
                $progress_bar.hide();
                // $upload_button.show();
                param.success(JSON.parse(response));
            }
        });
        
    }
}