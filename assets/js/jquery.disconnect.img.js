(function($) {
    $.fn.DesconnectImg = function(option) {   
        option = $.extend({
            version : "1.1.1",
            debug : true,
            modal : {},
            filesystem : {},
            consolelog :{
                css : 'background: #DDD; color: #F60'
            },
            callback : function() {}
        }, option || {});

        option.filesystem = $.extend({
            storage_type : 'persistent' // temporary
        },option.filesystem);

        

        this.initload = function(){
            console.log("xxxxxxxxxxx");
        };

        

        // traverse all nodes
        this.each(function() {

            // express a single node as a jQuery object
            var $this = $(this),
            LOCAL_FILE_BASEURL = "filesystem:" + window.location.origin + "/"+option.filesystem.storage+"/";

            $this.fn = {
                /**
                 * Log
                 *
                 * @author 2A
                 * @this {DesconnectImg}
                 * @function log
                 * @return {void} the DesconnectImg
                 */
                 log : function(msg){

                    if(option.debug)
                        try { console.log('%cREMOT LOG:', option.consolelog.css ,msg); } catch (e) { alert(msg) }
                },
                /**
                 * Init
                 *
                 * @author 2A
                 * @this {DesconnectImg}
                 * @function init
                 * @return {void} the DesconnectImg
                 */
                 init : function(){
                    $this.fn.log('Plugin "DesconnectImg" , methode "init"');

                },


            } 
            // end fn
            /**
             * $this.fn.Init
             *
             * @author 2A
             * @this {DesconnectImg}
             * @function invoke $this.fn.init
             * @return {void} the DesconnectImg
             */
             $this.fn.init();

         });

        // allow jQuery chaining
        return false;
    }

    
})(jQuery);

/**
 * index  module
 */

(function () {
    console.log('index js executed');
    $('img').DesconnectImg();
})();