<?php
    $locale = file_get_contents("styles/locales-en-US.xml");
    $locale = json_encode(array("en-US" => $locale));
    $style = file_get_contents("styles/cnb.csl");
    $style = json_encode($style);

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
                "given" => $_GET['rft_aufirst']
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
        <script type="text/javascript" src="../js/jquery-1.7.1.min.js"></script>
        <script type="text/javascript" src="js/xmldom.js"></script>
<!--        <script type="text/javascript; e4x=1" src="../js/xmle4x.js"></script>-->
        <script type="text/javascript" src="js/citeproc.js"></script>
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
                var apa = <?php echo $style; ?>;
                var cite = new CSL.Engine(sys, apa);
                cite.updateItems(["ITEM-1"]);
                var bib = cite.makeBibliography();
                $("body").append("<div>"+bib[1][0]+"</div>");
            });
        </script>
    </head>
    <body>
    </body>
</html>