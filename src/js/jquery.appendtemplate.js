
define(["jquery"], function($){
    $.fn.appendTemplate = function(tmpl, options) {
        if (typeof tmpl === "string") {
            tmpl = [tmpl];
        }
        var $el = $(this);
        return $.Deferred(function(dfd){
            var xhr = [];
            $.each(tmpl, function(k,v) {
                xhr.push($.ajax({
                    url: v,
                    dataType: 'text',
                    success: function(data) {
                        $el.append(data);
                    }
                }));
            });
            $.when.apply($, xhr)
            .done(function() {
                dfd.resolve(options);
            });
        });
    }
});