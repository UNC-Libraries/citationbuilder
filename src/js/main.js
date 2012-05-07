
require.config({
    paths: {
        jqueryui: "jquery-ui-1.8.19.custom.min"
    }
});

require(["jquery", "jquery.mustache", "order!xmldom", "order!citeproc",
            "jqueryui", "jquery.placeholder",
            "jquery.parseintoobject", "jquery.appendtemplate"],
function($){
         
    $(function() {
        var params = {},
            cite = {};

        $.each(location.search.slice(1).split("&"), function(k,v){
            var param, value;
            param = v.split("=")[0];
            value = v.split("=")[1];
            params[param] = value;
        });
        
        if (!("source" in params)) {
            params['source'] = "book";
        }
        
        if (!("style" in params)) {
            params['style'] = "apa";
        }
        
        $.ajax({
            url: 'styles/'+params.style+'.csl',
            dataType: 'text'
        }).success(function(data) {
            cite.style = data;
        });
        
        $.ajax({
            url: 'styles/locales-en-US.xml',
            dataType: 'text'
        }).success(function(data) {
            cite.locale = {
                "en-US": data
            }
        });
        
        $.when(
            $("body").appendTemplate('templates/head.mustache')
        ).done(function(){
            $("#cite-nav").append($.mustache($("#tmpl-head").html(),{
                style: params.style,
                source: params.source
            })).find("a[data-style="+params.style+"]").replaceWith(
                $("a[data-style="+params.style+"]").text()
            );
        });
        
        $.when($("body").appendTemplate([
            'templates/common.mustache',
            'templates/'+params.style+'/'+params.source+'.mustache'])
        ).done(function(){
            $("#tabs").append($.mustache($("#tmpl-"+params.source).html(), {}, {
                contributor: $("#tmpl-contributor").text(),
                publication: $("#tmpl-publication").text(),
                submit: $("#tmpl-submit").text(),
                urldoi: $("#tmpl-urldoi").text(),
                pages: $("#tmpl-pages").text(),
                volume: $("#tmpl-volume").text(),
                accessed: $("#tmpl-accessed").text(),
                issued: $("#tmpl-issued").text()
            }));
            $("#tabs").tabs();
            $("input[type=text]").placeholder();
        });
        
        $("#tabs").on("submit", "form", cite, function(e) {
            var $form = $(this),
                formObject, locale, items, Sys, sys, cite, bib, $dialog;
            
            e.preventDefault();
            $form
                .find("input[name^=author],input[name^=editor],input[name^=translator]")
                    .remove().end()
                .find(".contributor").each(function(){
                    var type, given, family, $last, name, num;
                    type = $(this).find('select[name="contrib-type"]').val();
                    given = $(this).find('input[name="contrib-given"]').val() + " " +
                        $(this).find('input[name="contrib-middle"]').val();
                    family = $(this).find('input[name="contrib-family"]').val();
                    if (family.replace(/\s/g, "")) {
                        $last = $form.find("input[name^='"+type+"[']").last();
                        name = $last.attr("name");
                        num = (typeof name === "string") ?
                                parseInt(name.charAt(name.indexOf("[") + 1)) + 1 :
                                0;
                        $form.append('<input type="hidden" name="'+type+'['+num+'][given]" value="'+given+'" />');
                        $form.append('<input type="hidden" name="'+type+'['+num+'][family]" value="'+family+'" />');
                    }
            });
            
            formObject = $form.parseIntoObject();

            locale = e.data.locale;
            items = {"ITEM-1": formObject};
            Sys = function() {
                return {
                    retrieveLocale: function(lang) {
                        return locale[lang];
                    },

                    retrieveItem: function(id) {
                        return items[id];
                    }
                }
            }

            sys = new Sys();
            cite = new CSL.Engine(sys, e.data.style);
            cite.updateItems(["ITEM-1"]);
            bib = cite.makeBibliography();
            $dialog = $("#citation-dialog").length ? $("#citation-dialog") :
                    $("<div id='citation-dialog'/>");
            $dialog.html(bib[1][0]).dialog({modal: true, minWidth: 600, show: "clip", hide: "clip"});
        });
        
        $("#tabs").on("click", "input[name='addcontrib']", function(e){
            var $div = $(this).closest("form").find("div.contributor").last();
            $div.clone()
                .find("a").remove().end()
                .find("input").last()
                    .after('<a href="">Remove</a>').end()
                    .end()
                .find("input").val("").end()
                .insertAfter($div);
            return false;
        });
        
        $("#tabs").on("click", "div.contributor a", function(e){
            e.preventDefault();
            $(this).closest("div.contributor").remove();
        });
        
        $("#tabs").on("blur keyup", "input[name=URL],input[name=DOI]", function(e){
            var name = ($(this).attr("name") == "URL") ? "DOI" : "URL";
            if ($(this).val() != '') {
                $(this).closest("form").find("input[name="+name+"]").attr("disabled", "disabled");
            } else {
                $(this).closest("form").find("input[name="+name+"]").removeAttr("disabled");
            }
        });
                        
        $("#cite-nav").on("click", "#changesource", function(e){
            e.preventDefault();
            $("#sourcelist").slideDown(600);
        });
        
        $("#cite-nav").on("click", "#sourcelist a:last", function(e){
            e.preventDefault();
            $("#sourcelist").hide(400);
        });
    });
});