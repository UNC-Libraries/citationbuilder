require.config({
    baseUrl: 'js'
});
require(["jquery", "mustache", "order!xmldom", "order!citeproc",
         "jquery-ui", "jquery.placeholder",
         "jquery.parseintoobject", "jquery.appendtemplate"],
        function($, Mustache){

            var params = {},
                cite = {},
                sourcemap = {
                    book: "book (in entirety)",
                    chapter: "chapter or essay from a book",
                    magazine: "magazine article",
                    newspaper: "newspaper article",
                    journal: "scholarly journal article",
                    website: "web site"
                };

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
                };
            });

            $.when(
                $("body").appendTemplate('templates/head.mustache')
            ).done(function(){
                $("#cite-nav").append(Mustache.render($("#tmpl-head").html(),{
                    style: params.style,
                    source: params.source,
                    sourcefull: sourcemap[params.source]
                })).find("a[data-style="+params.style+"]").replaceWith(
                    $("a[data-style="+params.style+"]").text()
                );
            });

            $.when($("body").appendTemplate([
                'templates/common.mustache',
                'templates/'+params.style+'/'+params.source+'.mustache'])
                  ).done(function(){
                      $("#tabs").append(Mustache.render($("#tmpl-"+params.source).html(), {}, {
                          contributor: $("#tmpl-contributor").html(),
                          publication: $("#tmpl-publication").html(),
                          submit: $("#tmpl-submit").html(),
                          urldoi: $("#tmpl-urldoi").html(),
                          pages: $("#tmpl-pages").html(),
                          volume: $("#tmpl-volume").html(),
                          accessed: $("#tmpl-accessed").html(),
                          issued: $("#tmpl-issued").html()
                      }));
                      $("#tabs").tabs();
                      $("input[type=text]").placeholder();
                  });

            $("#tabs").on("submit", "form", function(e) {
                var $form = $(this),
                    formObject, locale, items, Sys, sys, bib, citation, $dialog;

                e.preventDefault();
                $form
                    .find("input[name^=author],input[name^=editor],input[name^=translator]")
                    .remove().end()
                    .find(".contributor").each(function(){
                        var type, given, family, $last, name, num;
                        type = $(this).find('select[name="contrib-type"]').val();
                        given = $.trim([$(this).find('input[name="contrib-given"]').val(),
                                        $(this).find('input[name="contrib-middle"]').val()].join(" "));
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

                locale = cite.locale;
                items = {"ITEM-1": formObject};
                Sys = function() {
                    return {
                        retrieveLocale: function(lang) {
                            return locale[lang];
                        },

                        retrieveItem: function(id) {
                            return items[id];
                        }
                    };
                };

                sys = new Sys();
                citation = new CSL.Engine(sys, cite.style);
                citation.updateItems(["ITEM-1"]);
                bib = citation.makeBibliography();
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
