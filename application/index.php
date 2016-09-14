<?php

include_once "./modules/TwigRenderer.php";
$viewVariables = $_GET;
$view = new TwigRenderer();
$view->render("index.html.twig", $viewVariables);

?>