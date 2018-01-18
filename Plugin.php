<?php
namespace FvaAdmin;

use MapasCulturais\app;
use MapasCulturais\ApiQuery;
use MapasCulturais\Entities;
require __DIR__ . '/vendor/autoload.php';

class Plugin extends \MapasCulturais\Plugin {

    public function _init() {
        $app = App::i();
        $self = $this;
        
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
                $app->view->enqueueScript('app', 'bundle', '/bundle.js');
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

        $app->hook('POST(panel.generate-xls)', function() use($app, $self) {
            $objPHPExcel = new \PHPExcel();

            // JSON dos museus a serem inclusos no relatório
            $museusRelatorio = json_decode(file_get_contents('php://input'));

            // Propriedades do Documento
            $objPHPExcel->getProperties()->setCreator("IBRAM")
            ->setLastModifiedBy("IBRAM")
            ->setTitle("Relatório de Respostas do FVA Corrente")
            ->setSubject("Relatório de Respostas do FVA Corrente")
            ->setDescription("Relatório de Respostas do FVA Corrente")
            ->setKeywords("Relatório FVA")
            ->setCategory("Relatório");
        
            // Legenda das Colunas da Planilha
            $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', 'Museu')
            ->setCellValue('B1', 'Responsavel')
            ->setCellValue('C1', 'Email Responsavel')
            ->setCellValue('D1', 'Telefone Responsavel')
            ->setCellValue('E1', 'Primeira Participação no FVA')
            ->setCellValue('F1', 'Motivos Por Não Participar das Edições Anteriores')
            ->setCellValue('G1', 'Outros Motivos Por Não Participar das Edições Anteriores')
            ->setCellValue('H1', 'A Instituição realiza contagem de público?')
            ->setCellValue('I1', 'Técnicas de Contagem Utilizadas')
            ->setCellValue('J1', 'Outras Técnicas de Contagem Utilizadas')
            ->setCellValue('K1', 'Justificativa Baixa Visitação')
            ->setCellValue('L1', 'Total de Visitações')
            ->setCellValue('M1', 'Observações Sobre Visitação')
            ->setCellValue('N1', 'Meios Pelos Quais Soube do FVA')
            ->setCellValue('O1', 'Outras Mídias FVA')
            ->setCellValue('P1', 'Opinião Sobre o Questionário FVA');
                        
            // Preenche a planilha com os dados
            $self->writeSheetLines($museusRelatorio, $objPHPExcel, $self);
    
            // Nomeia a Planilha
            $objPHPExcel->getActiveSheet()->setTitle('Relatório FVA 2017');
  
            // Seta a primeira planilha como a ativa
            $objPHPExcel->setActiveSheetIndex(0);
    
            // Headers a serem enviados na resposta (Excel2007)
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="01simple.xls"');
            header('Cache-Control: max-age=0');
            // Necessário para o IE9
            header('Cache-Control: max-age=1');
    
            header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Não expira
            header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // sempre modificado
            header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
            header ('Pragma: public'); // HTTP/1.0
    
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
            
            //Salva a planilha no buffer de saída
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

    /**
     * Escreve cada linha da exportação dos dados do FVA em planilha em suas respectivas colunas
     *
     * @param array $museus
     * @param obj $objPHPExcel
     * @param pointer $self
     * @return void
     */
    private function writeSheetLines($museus, $objPHPExcel, $self) {
        $line = 2; //A primeira linha destina-se aos cabeçalhos das colunas

        foreach($museus as $m) {
            $fva = json_decode($m->fva2017);
        
            $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue('A' . (string)$line, $m->name)
                        ->setCellValue('B' . (string)$line, $fva->responsavel->nome->answer)
                        ->setCellValue('C' . (string)$line, $fva->responsavel->email->answer)
                        ->setCellValue('D' . (string)$line, $fva->responsavel->telefone->answer)
                        ->setCellValue('E' . (string)$line, $fva->introducao->primeiraParticipacaoFVA->answer === true ? 'Sim' : 'Não')
                        ->setCellValue('F' . (string)$line, $self->assertBlockAnswers($fva->introducao->questionarioNaoParticipou->motivos))
                        ->setCellValue('G' . (string)$line, $fva->introducao->questionarioNaoParticipouOutros->answer !== false ? $fva->introducao->questionarioNaoParticipouOutros->text : '')
                        ->setCellValue('H' . (string)$line, $fva->visitacao->realizaContagem === true ? 'Sim' : 'Não')
                        ->setCellValue('I' . (string)$line, $self->assertBlockAnswers($fva->visitacao->tecnicaContagem))
                        ->setCellValue('J' . (string)$line, $fva->visitacao->tecnicaContagemOutros->answer !== false ? $fva->visitacao->tecnicaContagemOutros->text : '')
                        ->setCellValue('K' . (string)$line, $fva->visitacao->justificativaBaixaVisitacao->answer !== null ? $fva->visitacao->justificativaBaixaVisitacao->answer : '')
                        ->setCellValue('L' . (string)$line, $fva->visitacao->quantitativo->answer !== null ? $fva->visitacao->quantitativo->answer : '')
                        ->setCellValue('M' . (string)$line, $fva->visitacao->observacoes->answer !== null ? $fva->visitacao->observacoes->answer : '')
                        ->setCellValue('N' . (string)$line, $self->assertBlockAnswers($fva->avaliacao->midias))
                        ->setCellValue('O' . (string)$line, $fva->avaliacao->midiasOutros->answer !== false ? $fva->avaliacao->midiasOutros->text : '')
                        ->setCellValue('P' . (string)$line, $fva->avaliacao->opiniao->text !== null ? $fva->avaliacao->opiniao->text : '');
                        
        
            $line++;
        }
    }

    /**
     * Analisa um bloco de questões da exportação da planilha. Se tiver sido marcado como 'true', retorna o label da questão
     * e grava na respectiva linha
     *
     * @param array $questionario
     * @return string
     */
    private function assertBlockAnswers($questionario) {
        $answers = array();

        foreach($questionario as $questao) {
            if($questao->answer !== false) {
                $answers[] = $questao->label;
            }
        }
        $return = implode(", ", $answers);
        return $return;
    }

    public function register() {
        
    }
}
