<?php
    include("find_include_dir.inc");
    $title = "UNC Citation Builder";
    $external_style = <<<EOT
        <link rel="stylesheet" href="css/custom-theme/jquery-ui-1.8.18.custom.css" type="text/css" />
        <link rel="stylesheet" href="css/style.css" type="text/css" />
EOT;

    $javascript = <<<'EOT'
        <script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.8.18.custom.min-new.js"></script>
        <script type="text/javascript" src="js/xmldom.js"></script>
        <script type="text/javascript" src="js/citeproc.min.js"></script>
        <script type="text/javascript" src="js/jquery.mustache.js"></script>
        <script type="text/javascript" src="js/jquery.placeholder.js"></script>
        <script type="text/javascript">
            $(function() {
                var params = {};
                $.each(location.search.slice(1).split("&"), function(k,v){
                    var param = v.split("=")[0];
                    var value = v.split("=")[1];
                    params[param] = value;
                });
                
                if (typeof params.source === "undefined") {
                    params['source'] = "book";
                }
                if (typeof params.style === "undefined") {
                    params['style'] = "apa";
                }

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

                function loadTemplate(tmpl, options) {
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
                                    $("body").append(data);
                                }
                            }));
                        });
                        $.when.apply($, xhr)
                        .done(function() {
                            dfd.resolve(options);
                        });
                    });
                }

                var cite = {};
                var $style = $.ajax({
                    url: 'styles/'+params.style+'.csl',
                    dataType: 'text',
                    context: cite,
                    success: function(data){
                        this.style = data;
                    }
                });
                var $locale = $.ajax({
                    url: 'styles/locales-en-US.xml',
                    dataType: 'text',
                    context: cite,
                    success: function(data) {
                        this.locale = {
                            "en-US": data
                        }
                    }
                });
                $.when(loadTemplate('templates/head.mustache', params)
                ).done(function(params){
                    $("#cite-nav").append($.mustache($("#tmpl-head").text(),{
                        style: params.style,
                        source: params.source
                    })).find("a[data-style="+params.style+"]").replaceWith(
                        $("a[data-style="+params.style+"]").text()
                    );
                });
                $.when(loadTemplate([
                    'templates/common.mustache',
                    'templates/'+params.style+'/'+params.source+'.mustache'])
                ).done(function(){
                    $("#tabs").append($.mustache($("#tmpl-"+params.source).text(), {}, {
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
                    e.preventDefault();
                    var $form = $(this);
                    $form
                        .find("input[name^=author],input[name^=editor],input[name^=translator]")
                            .remove().end()
                        .find(".contributor").each(function(){
                            var type = $(this).find('select[name="contrib-type"]').val();
                            var given = $(this).find('input[name="contrib-given"]').val() + " " +
                                $(this).find('input[name="contrib-middle"]').val();
                            var family = $(this).find('input[name="contrib-family"]').val();
                            if (family.replace(/\s/g, "")) {
                                var $last = $form.find("input[name^='"+type+"[']").last();
                                var name = $last.attr("name");
                                var num = (typeof name === "string") ?
                                        parseInt(name.charAt(name.indexOf("[") + 1)) + 1 :
                                        0;
                                $form.append('<input type="hidden" name="'+type+'['+num+'][given]" value="'+given+'" />');
                                $form.append('<input type="hidden" name="'+type+'['+num+'][family]" value="'+family+'" />');
                            }
                    });
                    
                    var formObject = $form.parseIntoObject();

                    var locale = e.data.locale;
                    var items = {"ITEM-1": formObject};
                    var Sys = function() {
                        return {
                            retrieveLocale: function(lang) {
                                return locale[lang];
                            },

                            retrieveItem: function(id) {
                                return items[id];
                            }
                        }
                    }

                    var sys = new Sys();
                    var cite = new CSL.Engine(sys, e.data.style);
                    cite.updateItems(["ITEM-1"]);
                    var bib = cite.makeBibliography();
                    var $dialog = $("#citation-dialog").length ? $("#citation-dialog") : $("<div id='citation-dialog'/>");
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
        </script>
EOT;
    include("$include_base/headers/new.inc");
?>
        <noscript><div class="noscript">Javascript is disabled in your browser. Citation Builder will not function correctly without it.</div></noscript>
        <h2><a href="index.html">Citation Builder</a></h2>
        <div id="cite-nav"></div>
        <div id="tabs"></div>
<?php
    include("$include_base/footers/new.inc");
?>