$( document ).ready(function() {
    $( ".deleteSound" ).click(function() {
        if(confirm('Delete this Sound?'))
        {   
            var container = $(this).parent();
            $.get(
                "/ajax/deleteSound/"+$(this).attr('soundId'),
                function(data) {
                    if (data==='success')
                    {
                        //container.remove();
                        container.slideUp('slow', function() {$(this).remove();});
                    }
                }
            );
        }
    });
});
