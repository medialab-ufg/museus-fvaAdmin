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
            $spaceFva = $spaceEntity->getMetadata('fva2018', true);
            $spaceFva->delete(true);
        });

        //Grava a flag que FVA está disponível para ser respondido
        $app->hook('POST(panel.openFVA)', function() use($app, $self){
            $fvaCurrentStatus = json_decode(file_get_contents('php://input'));
            $fvaEntity = $app->repo('SubsiteMeta');
            $fvaEntity->statusFva = $fvaCurrentStatus;
            //$fvaEntity->yearsAvailable = array('fva2016', 'fva2017');
            $fvaAtual = $self->getCurrentFva();


            //Verifica se a entidade 'SubsiteMeta' já tem o array referente aos anos de aplicação do FVA
            if(property_exists($fvaEntity, 'yearsAvailable')) {
                if(!in_array($fvaAtual, $fvaEntity->yearsAvailable)) {
                    $fvaEntity->yearsAvailable[] = $fvaAtual;
                }
            }
            else {
                $fvaEntity->yearsAvailable = array($fvaAtual);
            }

            //echo json_encode($fvaEntity);die;
            $fvaEntity->save(true);
        });

        //Retorna os anos disponíveis para consulta FVA
        $app->hook('GET(panel.getYearsAvailable)', function() use($app, $self){
            $fvaEntity = $app->repo('SubsiteMeta');

            echo json_encode($fvaEntity->yearsAvailable);die;
        });




        //Retorna os agentes como rascunho
        $app->hook('GET(panel.getAgentsDraft)', function() use($app, $self){

            $agents = $app->repo('Agent')->findBy(array('status' => 0),array('id' => 'DESC'));

            $_agents = [];
            foreach ($agents as $indice => $agent) {
                $_agents[$indice] = array(
                    'id'        => $agent->id,
                    'name'      => $agent->name,
                    'endereco'  => $agent->endereco,
                    'singleUrl' => $agent->singleUrl

                );
            }
            echo json_encode($_agents);
            die;

        });



        //Hook que carrega o HTML gerado pelo build do ReactJS
        $app->hook('GET(panel.fva-admin)', function() use ($app) {

            $this->requireAuthentication();

            if(!$app->user->is('admin') && !$app->user->is('staff')){
                $app->pass();
            }

            $this->render('fva-admin');
        });

        //Geração da planilha de museus que responderam FVA
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
            ->setCellValue('B1', 'Código Museu')
            ->setCellValue('C1', 'Responsavel')
            ->setCellValue('D1', 'Email Responsavel')
            ->setCellValue('E1', 'Telefone Responsavel')
            ->setCellValue('F1', 'Primeira Participação no FVA')
            ->setCellValue('G1', 'Motivos Por Não Participar das Edições Anteriores')
            ->setCellValue('H1', 'Outros Motivos Por Não Participar das Edições Anteriores')
            ->setCellValue('I1', 'A Instituição realiza contagem de público?')
            ->setCellValue('J1', 'Técnicas de Contagem Utilizadas')
            ->setCellValue('K1', 'Outras Técnicas de Contagem Utilizadas')
            ->setCellValue('L1', 'Justificativa Baixa Visitação')
            ->setCellValue('M1', 'Total de Visitações')
            ->setCellValue('N1', 'Observações Sobre Visitação')
            ->setCellValue('O1', 'Meios Pelos Quais Soube do FVA')
            ->setCellValue('P1', 'Outras Mídias FVA')
            ->setCellValue('Q1', 'Opinião Sobre o Questionário FVA');

            // Preenche a planilha com os dados
            $self->writeSheetLines($museusRelatorio, $objPHPExcel, $self);

            // Nomeia a Planilha
            $objPHPExcel->getActiveSheet()->setTitle('Relatório FVA 2018');

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
     * Informa a versão Fva do ano corrente
     *
     * @return string
     */
    private function getCurrentFva(){
        $ano = \date('Y');
        $currentFva = "fva$ano";

        return $currentFva;
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
            $fva = json_decode($m->fva2018);

            $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue('A' . (string)$line, $m->name)
                        ->setCellValue('B' . (string)$line, $m->mus_cod)
                        ->setCellValue('C' . (string)$line, $fva->responsavel->nome->answer)
                        ->setCellValue('D' . (string)$line, $fva->responsavel->email->answer)
                        ->setCellValue('E' . (string)$line, $fva->responsavel->telefone->answer)
                        ->setCellValue('F' . (string)$line, $fva->introducao->primeiraParticipacaoFVA->answer === true ? 'Sim' : 'Não')
                        ->setCellValue('G' . (string)$line, $self->assertBlockAnswers($fva->introducao->questionarioNaoParticipou->motivos))
                        ->setCellValue('H' . (string)$line, $fva->introducao->questionarioNaoParticipouOutros->answer !== false ? $fva->introducao->questionarioNaoParticipouOutros->text : '')
                        ->setCellValue('I' . (string)$line, $fva->visitacao->realizaContagem === true ? 'Sim' : 'Não')
                        ->setCellValue('J' . (string)$line, $self->assertBlockAnswers($fva->visitacao->tecnicaContagem))
                        ->setCellValue('K' . (string)$line, $fva->visitacao->tecnicaContagemOutros->answer !== false ? $fva->visitacao->tecnicaContagemOutros->text : '')
                        ->setCellValue('L' . (string)$line, $fva->visitacao->justificativaBaixaVisitacao->answer !== null ? $fva->visitacao->justificativaBaixaVisitacao->answer : '')
                        ->setCellValue('M' . (string)$line, $fva->visitacao->quantitativo->answer !== null ? $fva->visitacao->quantitativo->answer : '')
                        ->setCellValue('N' . (string)$line, $fva->visitacao->observacoes->answer !== null ? $fva->visitacao->observacoes->answer : '')
                        ->setCellValue('O' . (string)$line, $self->assertBlockAnswers($fva->avaliacao->midias))
                        ->setCellValue('P' . (string)$line, $fva->avaliacao->midiasOutros->answer !== false ? $fva->avaliacao->midiasOutros->text : '')
                        ->setCellValue('Q' . (string)$line, $fva->avaliacao->opiniao->text !== null ? $fva->avaliacao->opiniao->text : '');


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
