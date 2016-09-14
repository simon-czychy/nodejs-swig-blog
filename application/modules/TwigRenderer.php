<?php

require_once ('../vendor/autoload.php');

class TwigRenderer {
    
    private $loader;
    private $twig;
    
    function __construct() {
        $this->loader = new Twig_Loader_Filesystem('views');
        $this->twig = new Twig_Environment($this->loader);
    }
    
    function render($view, $viewVariables) {
        echo $this->twig->render($view , $viewVariables);
    }
    
}

?>