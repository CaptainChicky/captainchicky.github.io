/**
 * Remember to minify this after making changes!!!
 */
(function(){
    var SS_LDR = window.SS_LDR || {};

    SS_LDR.init = function(){
        var do_methods = ['doSocializeIt', 'doFacebook', 'doPinIt', 'recaptcha'];

        do_methods.forEach(function(method){
            SS_LDR[method]();
        });
    };


    /**
     * Maybe add the socializeit.js script
     */
    SS_LDR.doSocializeIt = function(){

        if ( typeof SS_PARAMS.socializeit_onpage !== 'undefined' && SS_PARAMS.socializeit_onpage ) {

            (function(d,id){
                if (d.getElementById(id)) {return;}
                var x=d.createElement('script');x.async=true;x.defer=true;
                x.src="/ssjs/socializeit.js";x.id=id;d.getElementsByTagName('head')[0].appendChild(x);
            })(document, '_socializeit_script');
        }
    };


    /**
     * Maybe add the Facebook script.
     * This function (v3.1) is deprecated in favor of the v4.0 syntax.
     */
    SS_LDR.doFacebook = function(){

        if ( typeof window.fbAsyncInit !== 'undefined' ) {

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/"+SS_PARAMS.ssFBLang+"/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

    };

    /**
     * Maybe add the Pinterest script
     */
    SS_LDR.doPinIt = function(){

        if ( typeof SS_PARAMS.pinterest_enabled !== 'undefined' && SS_PARAMS.pinterest_enabled ){

            (function(d,id){
                if (d.getElementById(id)) {return;}
                var x=d.createElement('script');x.async=true;x.defer=true;
                x.src="//assets.pinterest.com/js/pinit.js";x.id=id;d.getElementsByTagName('head')[0].appendChild(x);
            })(document, '_pinterest_script');
        }
    };

// Recaptcha
    SS_LDR.recaptcha = function(){

        if ( typeof SS_PARAMS.recaptcha_callbackings !== 'undefined'  ){

            var recaptcha_callbackings = SS_PARAMS.recaptcha_callbackings;
            if ( recaptcha_callbackings ) {
                (function(recaptcha_callbackings){
                    window.recaptcha_callback = function() { for (i=0; i<recaptcha_callbackings.length; i++) { recaptcha_callbackings[i](); } };
                    var x = document.createElement('script'); x.async=true; x.defer=true;
                    x.src='https://www.google.com/recaptcha/api.js?onload=recaptcha_callback&render=explicit';
                    document.getElementsByTagName('head')[0].appendChild(x);
                })(recaptcha_callbackings);
            }
        }
    };

    /**
     * Kick it off!
     */
    SS_LDR.init();
})();

/* End of file: ldr.js */
/* Location: share/ssjs/ldr.js */
