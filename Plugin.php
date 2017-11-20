<?php
namespace FvaAdmin;

use MapasCulturais\app;
use MapasCulturais\ApiQuery;
use MapasCulturais\Entities;

class Plugin extends \MapasCulturais\Plugin {

    public function _init() {
        $app = App::i();
        // Fazer funcionar apenas no tema de museus:
        if (get_class($app->view) != 'MapasMuseus\Theme')
            return;

        //Painel do Admin FVA
        $app->hook('panel.menu:after', function() use ($app){
            if(!$app->user->is('admin') && !$app->user->is('staff'))
            return;

            $url = $app->createUrl('panel', 'fva-admin');
            echo "<li><a href='$url'><span class='icon icon-em-cartaz'></span>FVA</a></li>";
        });

        //Registra o js do painel admin
        $app->hook('mapasculturais.head', function() use($app){
            $controllerAtual = $app->view->getController();
            
            if(property_exists($controllerAtual, 'action') && $controllerAtual->action === 'fva-admin') {
                $app->view->enqueueScript('app', 'bundle', '../views/panel/bundle.js');
            }
        });

        //Apaga o FVA do museu do id fornecido
        $app->hook('POST(panel.resetFVA)', function() use($app){
            $this->requireAuthentication();

            $id = json_decode(file_get_contents('php://input'));
            $spaceEntity = $app->repo('Space')->find($id);
            $spaceFva = $spaceEntity->getMetadata('fva2017', true);
            $spaceFva->delete(true);
        });

        //Hook que carrega o HTML gerado pelo build do ReactJS
        $app->hook('GET(panel.fva-admin)', function() use ($app) {
            $this->requireAuthentication();
            
            if(!$app->user->is('admin') && !$app->user->is('staff')){
                $app->pass();
            }
            
            $this->render('fva-admin');
        });
    }

    public function register() {
        
    }
}
