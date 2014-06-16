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
            css : 'background: #53C2F0; color: #FFF',
            css_error : 'background: #E13D45; color: #FFF'
        }, option.consolelog);

        option.filesystem = $.extend({
            storage_type : 'temporary' // temporary || persistent || unlimited 
        }, option.filesystem);

        var glob__bytes = 1024,
            glob__local_file_baseurl = "filesystem:" + window.location.origin + "/" + option.filesystem.storage_type + "/";

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
                this.extend({
                    // trace un info
                    info : function () {
                        if (option.debug) {
                            try { window.console.log('%cREMOT LOG :', option.consolelog.css, msg); } catch (e) { window.alert(msg); }
                        }
                    },
                    // trace un error
                    error : function (msg) {
                        if (option.debug) {
                            try { window.console.log('%cREMOT ERROR :', option.consolelog.css_error, msg); } catch (e) { window.alert(msg); }
                        }
                    }
                });
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
                this.log.info('Plugin "DesconnectImg" , methode "init"');
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
                return option.request_quota * glob__bytes * glob__bytes;
            },
            /**
             * GetFileSystemType
             *
             * @author 2A
             * @this {DesconnectImg}
             * @function GetFileSystemType
             * @return {void} the DesconnectImg
             */
            getFileSystemType : function () {
                return (option.filesystem.storage_type === 'temporary') ? window.TEMPORARY : window.PERSISTENT;
            },
            errorHandler : function (e) {
                var msg = '';
                switch (e.code) {
                case window.FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                    break;
                case window.FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                    break;
                case window.FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                    break;
                case window.FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                    break;
                case window.FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                    break;
                default:
                    msg = 'Unknown Error';
                    break;
                }
                this.log.error(msg);
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
                this.log.info('Plugin "DesconnectImg" , methode "initFileSystem"');
                callback = callback || function () { return true; };
                function onInitFs(fs) {
                    glob__local_file_baseurl = fs.root.toURL();
                    return callback();
                }
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                window.navigator.persistentStorage = window.navigator.persistentStorage || window.navigator.webkitPersistentStorage;
                window.navigator.persistentStorage.requestQuota(this.getRequestQuota(), function (grantedBytes) {
                    window.requestFileSystem(this.getFileSystemType(), grantedBytes, onInitFs, errorHandler);
                }, errorHandler);
            }
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
                    this.log.info('Plugin "DesconnectImg" , methode "init"');
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