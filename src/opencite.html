<?php
    $locale = file_get_contents("styles/locales-en-US.xml");
    $locale = json_encode(array("en-US" => $locale));
    
    $styles = array(
        "APA" => "styles/apa.csl",
        "MLA" => "styles/mla.csl",
        "Chicago (Author-Date)" => "styles/cad.csl",
        "Chicago (Notes and Bibliography)" => "styles/cnb.csl"
    );
    
    foreach ($styles as $k => $v) {
        $style = file_get_contents($v);
        $styles[$k] = json_encode($style);
    }

    function recursive_filter($array) {
        foreach ($array as $k => &$v) {
            if (is_array($v)) {
                $v = recursive_filter($v);
                if (!$v) {
                    unset($array[$k]);
                }
            } else {
                $v = trim($v);
                if (!$v && !is_numeric($v)) {
                    //don't remove values of 0
                    unset($array[$k]);
                }
            }
        }
        return $array;
    }

    $item = array(
        "title" => $_GET['rft_title'],
        "author" => array(
            array(
                "family" => $_GET['rft_aulast'],
                "given" => $_GET['rft_aufirst'] . ' ' . $_GET['rft_aumiddle']
            )
        ),
        "publisher-place" => $_GET['rft_place'],
        "publisher" => $_GET['rft_pub'],
        "issued" => array(
            "raw" => $_GET['rft_date']
        ),
        "edition" => $_GET['rft_edition'],
        "container-title" => $_GET['rft_series'],
        "type" => "book",
        "id" => "ITEM-1"
    );
    $item = recursive_filter($item);
    
    $items = array(
        "ITEM-1" => $item
    );
    $bib = json_encode($items);
?>

<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <script src="js/jquery-1.7.1.min.js"></script>
        <script src="js/xmldom.js"></script>
        <script src="js/citeproc.js"></script>
        <script type="text/javascript">
            $(function() {
                var locale = <?php echo $locale; ?>;
                var items = <?php echo $bib; ?>;
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
                var cite, bib;
            <?php foreach ($styles as $k => $v) { ?>
                cite = new CSL.Engine(sys, <?php echo $v ?>);
                cite.updateItems(["ITEM-1"]);
                bib = cite.makeBibliography();
                $("body").append("<h2><?php echo $k ?></h2><div>"+bib[1][0]+"</div>");
            <?php } ?>
            });
        </script>
    </head>
    <body>
    </body>
</html>