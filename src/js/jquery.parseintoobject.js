
define(["jquery"], function($){
    $.fn.parseIntoObject = function(obj) {
        var obj = obj || {};
        function extract(obj, field, value) {
            var f = field.shift();
            if (field.length == 0) {
                if (f.length == 0 && obj.constructor == Array) {
                    obj.push(value);
                } else {
                    obj[f] = value;
                }
            } else {
                if (typeof obj[f] === "undefined") {
                    if (isNaN(field[0])) { //@todo: may need to convert "" to 0
                        obj[f] = {};
                    } else {
                        obj[f] = [];
                    }
                }
                extract(obj[f], field, value);
            }
        }
        $(this).find("input,select,textarea").each(function() {
            if ($(this).val().length != 0) {
                extract(obj, $(this).attr("name").replace(/\]/g,"").split("["), $(this).val());
            }
        })
        return obj;
    }
});