<?php
include_once "./modules/TwigRenderer.php";

$view = new TwigRenderer();
$view->render("login.html.twig", $_GET);

?>