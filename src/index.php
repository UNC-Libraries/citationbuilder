<?php
    include("find_include_dir.inc");
    $title = "UNC Citation Builder";
    $external_style = <<<EOT
        <link rel="stylesheet" href="css/custom-theme/jquery-ui-1.8.18.custom.css" type="text/css" />
        <link rel="stylesheet" href="css/style.css" type="text/css" />
EOT;

    $javascript = '<script data-main="js/main" src="js/require-jquery.js"></script>';
    include("$include_base/headers/new.inc");
?>
        <noscript><div class="noscript">Javascript is disabled in your browser. Citation Builder will not function correctly without it.</div></noscript>
        <h2><a href="index.html">Citation Builder</a></h2>
        <div id="cite-nav"></div>
        <div id="tabs"></div>
<?php
    include("$include_base/footers/new.inc");
?>