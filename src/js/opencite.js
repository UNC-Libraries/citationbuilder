
require(["jquery",
    "text!../styles/apa.csl!strip",
    "text!../styles/mla.csl!strip",
    "text!../styles/cad.csl!strip",
    "text!../styles/cnb.csl!strip",
    "text!../styles/cse-ad.csl!strip",
    "text!../styles/locales-en-US.xml", "order!xmldom", "order!citeproc"],

function($, apa, mla, cad, cnb, cse, loc) {
    var styles, query, items, locale, i, pair, value,
        params = [],
        author = undefined;

    styles = [
        {
            style: "APA",
            csl: apa
        },
        {
            style: "MLA",
            csl: mla
        },
        {
            style: "Chicago (Author-Date)",
            csl: cad
        },
        {
            style: "Chicago (Notes and Bibliography)",
            csl: cnb
        },
        {
            style: "Council of Science Editors (Author-Date)",
            csl: cse
        }
    ];

    query = window.location.search.substr(1).split("&");
    params = [];

    for (i = 0; i < query.length; i++) {
        pair = query[i].split("=");
        value = pair[1].replace(/\+/g, " ");
        params[pair[0]] = decodeURIComponent(value);
    }

    if (params["rft.aulast"]) {
        var given = $.trim(
            [params["rft.aufirst"], params["rft.aumiddle"]].join(" ")) ||
            undefined;
        author = [{
            "family": params["rft.aulast"],
            "given": given
        }];
    }

    items = {
        "ITEM-1": {
            "title": params["rft.title"],
            "author": author,
            "publisher-place": params["rft.place"],
            "publisher": params["rft.pub"],
            "issued": {
                "raw": params["rft.date"]
            },
            "edition": params["rft.edition"],
            "container-title": params["rft.series"],
            "type": "book",
            "id": "ITEM-1"
        }
    };

    locale = {
        "en-US": loc
    };

    $(function() {
        var i, Sys, sys, cite, bib;

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

        sys = new Sys;
        for (i = 0; i < styles.length; i++) {
            cite = new CSL.Engine(sys, styles[i].csl);
            cite.updateItems(["ITEM-1"]);
            bib = cite.makeBibliography();
            $("#citations").append("<h2>"+styles[i].style+"</h2><div>"+bib[1][0]+"</div>");
        }
    });

});
