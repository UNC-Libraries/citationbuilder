<?php
    include("find_include_dir.inc");

    $title = "UNC Citation Builder";
    $javascript = '<script data-main="js/opencite" src="js/require-jquery.js"></script>';

    include("$include_base/headers/new.inc");
?>

<h1>Citation Formats</h1>
<div id="citations"></div>

<?php
    include("$include_base/footers/new.inc");
?>