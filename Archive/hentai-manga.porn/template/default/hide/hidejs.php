jQuery( document ).ready(function() {
                jQuery(document).on('click', 'img.lock', function(e) {
                    var parent_block = jQuery(this).parent();
                    var id = $(this).attr('id');
                    var post_id = id.replace('p','')
                    var post_id_t = post_id.split('-');

                    domRect = document.getElementById(id).getBoundingClientRect();
                    x = e.clientX - domRect.left;
                    y = e.clientY - domRect.top;
                    var coords = x+'-'+y;

                    jQuery.ajax({
                        type: 'POST',
                        url: '/template/default/hide/ajax.php',
                        data: {
                            'coords': coords,
                            'post_id': post_id,
                        },
                        success: function(data) {
                            console.log(data);
                            var opt = '1'; 
                            if(data != '') data = JSON.parse(data);  
                            if(opt == 1){  
                                jQuery(parent_block).remove();
                                var i = 0;  
                                $(data).each(function(){
                                    var url = '';
                                    if(i == 0){
                                        jQuery(parent_block).prepend(this);
                                        url = jQuery(parent_block).find('a').attr('href')
                                    }else{
                                        jQuery(parent_block).find('a').eq(i-1).after(this);
                                        url = jQuery(parent_block).find('a').eq(i).attr('href')
                                    } 
                                    
                                    // var fo = url.split('/');
                                    // var data_src = 'https://'+fo[2]+'/js/preview.js';                   
                                    // var previewJs = document.createElement('script');
                                    // previewJs.setAttribute('src', data_src);
                                    // previewJs.setAttribute('data-width', '800px');
                                    // previewJs.setAttribute('data-height', '56.25%');
                                    // previewJs.dataset.url = url;
                                    
                                    try{
                                        document.getElementById('p'+post_id_t[0]+i).after(previewJs);
                                        $('#p'+post_id_t[0]+i).replaceWith(this);
                                    }catch(e) {
                                        $('#p'+post_id_t[0]+i).replaceWith(this);
                                    }
                                    i++;
                                    return true;
                                })
                            }else{
                                jQuery(parent_block).html('');
                                $(parent_block).html(data[0])
                            }
                            return false;
                        }
                    });
                return false;
            });
            $(document).ready(function() {
                $('a.goto').click(function() {
                  var elementClick = $(this).attr('href')
                  var destination = $(elementClick).offset().top;
                  jQuery('html:not(:animated),body:not(:animated)').animate({
                    scrollTop: destination-500
                  }, 800);
                  return false;
                });
              });
        });