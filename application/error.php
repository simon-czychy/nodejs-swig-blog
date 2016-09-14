<?php

include_once "./modules/TwigRenderer.php";

$errorView = new TwigRenderer();
$errorView->render("error.html.twig", $_GET);

?>