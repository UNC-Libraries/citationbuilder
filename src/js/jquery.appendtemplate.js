
define(["jquery"], function($){
    $.fn.appendTemplate = function(tmpl) {
        var $el = $(this);
        if (typeof tmpl === "string") {
            tmpl = [tmpl];
        }
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
                dfd.resolve();
            });
        });
    }
});