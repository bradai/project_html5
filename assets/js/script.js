var cachedFileSystemTest = function () {
    var LOCAL_FILE_BASEURL = "filesystem:" + window.location.origin + "/persistent/";
    //var LOCAL_FILE_BASEURL = "filesystem:" + window.location.origin + "/temporary/";
    //var type = window.TEMPORARY;
    var type = window.PERSISTENT;
    var initFileSystem = function (callback) {
            console.log("initFileSystem:");

            function onInitFs(fs) {
                console.log('Opened file system: ' + fs.name);
                LOCAL_FILE_BASEURL = fs.root.toURL();
                callback();
            }
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            navigator.persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage;
            navigator.persistentStorage.requestQuota(20 * 1024 * 1024 /*5MB*/ , function (grantedBytes) {
                window.requestFileSystem(type, grantedBytes, onInitFs, errorHandler);
            }, errorHandler);
        },
        /* -------------------------- */
        loadImageToFileSystem = function (callback) {
            var tab_img = [
                "img1.jpg",
                "img2.jpg",
            ];
            //  alert('RAPPEL : ' + tab_img[1]);
            var a = tab_img[0];
            var b = tab_img[1];
            xhrDownloadImage(a, function (imageAsBlob) {
                saveImageToFileSystem(imageAsBlob, a, function () {
                    // alert(a);
                    // console.log(imageAsBlob);
                    callback();
                });
            });
            xhrDownloadImage(b, function (imageAsBlob) {
                saveImageToFileSystem(imageAsBlob, b, function () {
                    // alert(a);
                    // console.log(imageAsBlob);
                    callback();
                });
            });
        },
        /* -------------------------- */
        displayImage = function (callback) {
            //   console.log("displayImage:");
            loadImage1(function (image) {
                $("#imgContainer").empty().append(image);
                callback();
            });
            loadImage2(function (image) {
                $("#imgContainer2").empty().append(image);
                callback();
            });
        },
        clearFileSystemEntries = function (callback) {
            console.log("clearFileSystemEntries:");
            window.requestFileSystem(type, 5 * 1024 * 1024 /*5MB*/ , function (fs) {
                fs.root.getFile('img2.jpg', {
                    create: false
                }, function (fileEntry) {
                    fileEntry.remove(function () {
                        console.log("'img2.jpg' has been deleted");
                        callback();
                    }, errorHandler);
                }, errorHandler);
            }, errorHandler);
        };

    function errorHandler(e) {
        var msg = '';
        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }
        console.log('Error: ' + msg);
    }
    var loadImage1 = function (callback) {
        var img = new Image();
        img.onload = function () {
            callback(img);
        };
        img.src = LOCAL_FILE_BASEURL + "img1.jpg" + "?rnd=" + new Date().getTime();
        // img2.src = LOCAL_FILE_BASEURL + "img2.jpg" + "?rnd=" + new Date().getTime();
    };
    var loadImage2 = function (callback) {
        var img2 = new Image();
        img2.onload = function () {
            callback(img2);
        };
        // img.src = LOCAL_FILE_BASEURL + "img1.jpg" + "?rnd=" + new Date().getTime();
        img2.src = LOCAL_FILE_BASEURL + "img2.jpg" + "?rnd=" + new Date().getTime();
    };
    var xhrDownloadImage = function (url, callback) {
        //   console.log(callback);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onerror = function (e) {
            console.log("Error: " + e)
        };
        xhr.onabort = function (e) {
            console.log("Abort: " + e)
        };
        xhr.onload = function () {
            console.log("onload");
            var result;
            if (xhr.status === 200) {
                // image as blob
                result = xhr.response;
            } else {
                result = null;
            }
            callback(result);
            //  saveImageToFileSystem(callback(result), url);
        };
        console.log(xhr.send());
    };
    var saveImageToFileSystem = function (imageAsBlob, imagename, callback) {
        window.requestFileSystem(type, 5 * 1024 * 1024 /*5MB*/ , function (fs) {
            fs.root.getFile(imagename, {
                create: true
            }, function (fileEntry) {
                console.log(fileEntry);
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        console.log("image successfully written to filesystem.");
                        callback();
                    };
                    var blob = new Blob([imageAsBlob], {
                        type: imageAsBlob.type
                    });
                    fileWriter.write(blob);
                }, errorHandler);
            }, errorHandler);
        }, errorHandler);
    };
    return {
        initFileSystem: initFileSystem,
        loadImageToFileSystem: loadImageToFileSystem,
        displayImage: displayImage,
    };
}();
$(document).ready(function () {
    cachedFileSystemTest.initFileSystem(function () {});
    cachedFileSystemTest.loadImageToFileSystem(function () {});
    cachedFileSystemTest.displayImage(function () {});
});