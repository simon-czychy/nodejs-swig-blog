<?php

include_once "./modules/TwigRenderer.php";

$errorView = new TwigRenderer();
$errorView->render("error.html.twig", array('message'=> $_GET['message']));

?>