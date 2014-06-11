(function (window, $) {
    'use strict';
    $.fn.DesconnectImg = function (option) {
        option = $.extend({
            version : "1.1.1",
            debug : true,
            request_quota : 20, // 20Mo
            modal : {},
            filesystem : {},
            consolelog : {},
            callback : function () { return false; }
        }, option || {});

        option.consolelog = $.extend({
            css : 'background: #DDD; color: #F60'
        }, option.consolelog);

        option.filesystem = $.extend({
            storage_type : 'persistent' // temporary
        }, option.filesystem);

        var _bytes = 1024,
            _local_file_baseurl = "filesystem:" + window.location.origin + "/" + option.filesystem.storage_type + "/";

        this.extend({
            /**
             * Log
             *
             * @author 2A
             * @this {DesconnectImg}
             * @function log
             * @return {void} the DesconnectImg
             */
            log : function (msg) {
                if (option.debug) {
                    try { window.console.log('%cREMOT LOG:', option.consolelog.css, msg); } catch (e) { window.alert(msg); }
                }
            },
            /**
             * Init
             *
             * @author 2A
             * @this {DesconnectImg}
             * @function init
             * @return {void} the DesconnectImg
             */
            init : function () {
                this.log('Plugin "DesconnectImg" , methode "init"');
            },
            /**
             * GetRequestQuota
             *
             * @author 2A
             * @this {DesconnectImg}
             * @function getRequestQuota
             * @return {void} the DesconnectImg
             */
            getRequestQuota : function () {
                return option.request_quota * _bytes * _bytes;
            },
            /**
             * InitFileSystem
             *
             * @author 2A
             * @this {DesconnectImg}
             * @function initFileSystem
             * @return {void} the DesconnectImg
             */
            initFileSystem : function (callback) {
                this.log('Plugin "DesconnectImg" , methode "initFileSystem"');
                callback = callback || function () {};
                function onInitFs(fs) {
                    console.log('Opened file system: ' + fs.name);
                    _local_file_baseurl = fs.root.toURL();
                    return callback();
                }
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                navigator.persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage;
                navigator.persistentStorage.requestQuota( this.getRequestQuota() , function (grantedBytes) {
                    window.requestFileSystem(type, grantedBytes, onInitFs, errorHandler);
                }, errorHandler);
            },


        });

        this.init();

        // traverse all nodes
        this.each(function () {
            // express a single node as a jQuery object
            var $this = $(this);
            $this.fn = {
                /**
                 * Init
                 *
                 * @author 2A
                 * @this {DesconnectImg}
                 * @function init
                 * @return {void} the DesconnectImg
                 */
                init : function () {
                    this.log('Plugin "DesconnectImg" , methode "init"');
                }
            };
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
    };
})(window, jQuery);