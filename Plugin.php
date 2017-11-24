<?php
namespace FvaAdmin;

use MapasCulturais\app;
use MapasCulturais\ApiQuery;
use MapasCulturais\Entities;
require __DIR__ . '/vendor/autoload.php';

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

        $app->hook('POST(panel.generate-xls)', function() use($app) {
            // Create new PHPExcel object
            $objPHPExcel = new \PHPExcel();
        
            // Set document properties
            $objPHPExcel->getProperties()->setCreator("IBRAM")
            ->setLastModifiedBy("IBRAM")
            ->setTitle("Relatório de Respostas do FVA Corrente")
            ->setSubject("Relatório de Respostas do FVA Corrente")
            ->setDescription("Relatório de Respostas do FVA Corrente")
            ->setKeywords("relatório FVA")
            ->setCategory("Relatório");
        
            // Add some data
            $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', 'Nome')
            ->setCellValue('B1', 'Endereço')
            ->setCellValue('C1', 'Telefone')
            ->setCellValue('D1', 'email');
    
            // Miscellaneous glyphs, UTF-8
            $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A2', 'Miscellaneous glyphs')
            ->setCellValue('B2', 'Rua da Treta')
            ->setCellValue('C2', '66554422338899')
            ->setCellValue('D2', 'contato@ibram.com.br');
    
            // Rename worksheet
            $objPHPExcel->getActiveSheet()->setTitle('Relatório FVA 2017');
  
    
            // Set active sheet index to the first sheet, so Excel opens this as the first sheet
            $objPHPExcel->setActiveSheetIndex(0);
    
    
            // Redirect output to a client’s web browser (Excel2007)
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="01simple.xls"');
            header('Cache-Control: max-age=0');
            // If you're serving to IE 9, then the following may be needed
            header('Cache-Control: max-age=1');
    
            // If you're serving to IE over SSL, then the following may be needed
            header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
            header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
            header ('Pragma: public'); // HTTP/1.0
    
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
            
            ob_start();
            $objWriter->save("php://output");
            $xlsData = ob_get_contents();
            ob_end_clean();
            
            $response =  array(
                'file' => "data:application/vnd.ms-excel;base64,".base64_encode($xlsData)
            );
            
            echo json_encode($response);
        });
    }

    public function register() {
        
    }
}
