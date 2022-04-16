

/////////////////////////////////////////////////////////////////////////////
//Variables globales
/////////////////////////////////////////////////////////////////////////////

let canvas, txtData = '', bg;
let resBlock;

//Instancias de clase
let myConex           = new Conex();
let myHeuristic       = new Heuristic();
let myGeneraExcel     = new GeneraExcel();
let myCabeceraGen     ;
let myTextos          ;
let myBola            = Array();

let idBlockAnt        = "000000000000000000063f099b89fa4e237b90a23d286ab6e6826ae7d7012f77";
let idBlock           = "000000000000000000063f099b89fa4e237b90a23d286ab6e6826ae7d7012f77";
let arrTxsUnBlock     = Array();
let dataBlock         = Array();

let lengInputs        = 0;
let lengOut           = 0;

let resTxsHeurExcel   = Array();
  
let resTxsHeur1Excel  = Array();
let resTxsHeur2Excel  = Array();
let resTxsHeur3Excel  = Array();
let resTxsHeur4Excel  = Array();
let resTxsHeur5Excel  = Array();
let resTxsHeur6Excel  = Array();
let resTxsHeur7Excel  = Array();
let resTxsHeur8Excel  = Array();

let txtDeBloque;
let buttExcel;

let procesaBolas    = true;
let procesaHeur     = true;
let bola            = Array();

let cuentaTxts      = new Array(10).fill(0);  //Cuenta las 8 heurísticas + 9 = resto + 0 = total
    
let conHeurist      = false; //La Tx  salen con alguna heuristica

//Márgenes a la ventana general
let margenInf       = 60;
let margenDer       = 20;

let literalHeur     = [ '',
                       'Reutilización de direcciones.' ,            'Pago con números redondos.',
                       'Pago a direcciones con formato diferente.', 'Pago usando direcciones Taproot.',
                       'Pago a direcciones con scripts diferente.', 'Entrada innecesaria.',
                       'Salida con el monto mayor.',                'Versiones de las transacciones.',
                       'Transacciones sin heurística',
                      ];
let colorlHeur     = [ 
                       '',     'blue',   'red' ,  'green', 'purple',
                       'pink', 'yellow', 'cyan',  'white', 'gray',
                     ];



function preload(){
  // bg = loadImage('https://b2p5.github.io/imagenCielo-min.jpg');
}//gin preload

async function setup() {
  canvas = createCanvas(windowWidth-margenDer, windowHeight-margenInf);
  canvas.position(10, 50);    

  document.getElementById("txtData").value = idBlock;

  //Un frame por segundo
  frameRate(0.5);   

}//fin setup



async function draw(){
  

  if(txtData.length == 0){
        
    return;  //No hacemos nada

  }else { 
    if ((arrTxsUnBlock.length == 0) || 
        (idBlockAnt != idBlock)){


      background(200);

      
      idBlock     = txtData;
      idBlockAnt  = idBlock;

      arrTxsUnBlock     = Array();
      await myConex.getBlock ( idBlock );
      arrTxsUnBlock     = await myConex.respuesta.data.tx; 


      //Falta por tomar bloques previo y posterior
      //////////////////////////////////////////
      dataBlock = [{
        n_tx        : myConex.respuesta.data.n_tx,
        block_index : myConex.respuesta.data.block_index ,
        weight      : myConex.respuesta.data.weight ,
        time        : myConex.respuesta.data.time ,
        // prev_block  : myConex.respuesta.data.prev_block ,
        // next_block  : myConex.respuesta.data.next_block ,
      }];

    
      //Generar instancia de la clase Bola como Cabecera
      myCabeceraGen = new Bolas();
      myCabeceraGen.cabeceraGeneral();


      //Creamos las bolas. Comenzamos en 1 para evitar la Tx de minado
      for (let i = 1; i <= arrTxsUnBlock.length; i++) {
        myBola.push(new Bolas());
      }//fin for (let i = 1; i < arrTxsUnBlock.len
    
        
    }//fin if (arrTxsUnBlock.length == 0    

    // Procesa heurística y número de bolas
    if (arrTxsUnBlock.length > 0 && procesaHeur ){
        
      cuentaTxts        = new Array(10).fill(0);
      resTxsHeur1Excel  = Array();
      resTxsHeur2Excel  = Array();
      resTxsHeur3Excel  = Array();
      resTxsHeur4Excel  = Array();
      resTxsHeur5Excel  = Array();
      resTxsHeur6Excel  = Array();
      resTxsHeur7Excel  = Array();
      resTxsHeur8Excel  = Array();

      //Recorremos todas las Txs buscando las heurísticas 1 a 8
      ////////////////////////////////////////////////////////////////
      for(let i=0; i<arrTxsUnBlock.length; i++){

        cuentaTxts[0]           = cuentaTxts[0] + 1;
        conHeurist              = false;

        myGeneraExcel.hash      = arrTxsUnBlock[i].hash;
        myGeneraExcel.inputs    = arrTxsUnBlock[i].inputs;
        myGeneraExcel.out       = arrTxsUnBlock[i].out;

        myHeuristic.inputs      = arrTxsUnBlock[i].inputs;
        myHeuristic.out         = arrTxsUnBlock[i].out;

        lengInputs              = arrTxsUnBlock[i].inputs.length;
        lengOut                 = arrTxsUnBlock[i].out.length;


        //Comprobamos si es una Tx MINADA y la saltamos
        if( ( arrTxsUnBlock[i].inputs[0].prev_out.value == 0 ) &&
              lengInputs == 1 ){
              continue; 
        }//fin de if( ( myHeuristic.inputs[i].prev_o


        //1-Reutilización de direcciones.
        //////////////////////////////////////////////////////////////////
        myHeuristic.reutilizaDirecciones();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur1Excel.push(...resTxsHeurExcel);

          myBola[i].myColor       = colorlHeur[1];
          myBola[i].tipHeur       = 1;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[1]           = cuentaTxts[1] + 1;
          conHeurist              = true;

        }// fin de if if (myHeuristic.esOk){
      
        //2-Pago con números redondos.
        //////////////////////////////////////////////////////////////////
        myHeuristic.pagoNumeroRedondo();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur2Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[2];
          myBola[i].tipHeur     = 2;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[2]         = cuentaTxts[2] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){
      
        //3-Pago a direcciones con formato diferente.
        //////////////////////////////////////////////////////////////////
        myHeuristic.pagoFormatoDiferente();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur3Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[3];
          myBola[i].tipHeur     = 3;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[3]         = cuentaTxts[3] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){

        //4-Pago usando direcciones Taproot.
        //////////////////////////////////////////////////////////////////
        myHeuristic.pagoUsandoTaproot();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur4Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[4];
          myBola[i].tipHeur     = 4;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[4]         = cuentaTxts[4] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){

        //5-Pago a direcciones con scripts diferente.
        //////////////////////////////////////////////////////////////////
        myHeuristic.pagoADirScripDif();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur5Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[5];
          myBola[i].tipHeur     = 5;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[5]         = cuentaTxts[5] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){

        //6-Entrada innecesaria.
        //////////////////////////////////////////////////////////////////
        myHeuristic.entradaInnecesaria();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur6Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[6];
          myBola[i].tipHeur     = 6;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[6]         = cuentaTxts[6] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){

        //7-Salida con el monto mayor
        //////////////////////////////////////////////////////////////////
        myHeuristic.salidaMontoMayor();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur7Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[7];
          myBola[i].tipHeur     = 7;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[7]         = cuentaTxts[7] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){

        //8-Versiones de las transacciones.
        //////////////////////////////////////////////////////////////////
        myHeuristic.versionesDeTxs();
        if (myHeuristic.esOk){
          resTxsHeurExcel = myGeneraExcel.inputsOutToJson();
          resTxsHeur8Excel.push(...resTxsHeurExcel);

          myBola[i].myColor     = colorlHeur[8];
          myBola[i].tipHeur     = 8;
          myBola[i].preparaBolas();
          myBola[i].displayBolas();

          cuentaTxts[8]         = cuentaTxts[8] + 1;
          conHeurist            = true;

        }// fin de if (myHeuristic.esOk){



        //9-Txs sin heurística  OKKKKK
        //////////////////////////////////////////////////////////////////
        if(conHeurist  == false ){
            myBola[i].myColor     = colorlHeur[9];
            myBola[i].tipHeur     = 9;
            myBola[i].preparaBolas();
            myBola[i].displayBolas();

            cuentaTxts[9]         = cuentaTxts[9] + 1;
            conHeurist            = true;

        }//fin de if(conHeurist  == false )

      
      }// fin de for(let i=0; i<arrTxsUnBlock.length; i++)

      procesaHeur         = false;
    
      muestraTexto(cuentaTxts);

      noLoop();

    }//fin de  if (arrTxsUnBlock.length > 0 && procesaHeur

  }//fin if(txtData.length == 0
  
}//fin async function draw()



//////////////////////////////////////////////////////////////////////////////
//FUNCIONES
//////////////////////////////////////////////////////////////////////////////

//Teclas parte superior
////////////////////////////////////////////////////////////////////////
function getBlock(){
  txtData             = select("#txtData").value();
  idBlock             = txtData;
  
  arrTxsUnBlock       = Array();                              
  procesaBolas        = true;
  procesaHeur         = true;
  draw();
  
}//fin getBlock

async function goPrev(){
  resBlock = await myConex.getBlock ( idBlock );

  document.getElementById("txtData").value = resBlock.prev_block;
  idBlock             = resBlock.prev_block;
  txtData             = select("#txtData").value();

  arrTxsUnBlock       = Array();                              
  procesaBolas        = true;
  procesaHeur         = true;
  draw();
    
}//fin goPrev

async function goPost(){
  resBlock = await myConex.getBlock ( idBlock );

  //Si es el último bloque
  if (resBlock.next_block== ''){
    document.getElementById("txtData").value = idBlock;

  }else{
    document.getElementById("txtData").value = resBlock.next_block;
    idBlock             = resBlock.next_block;

  }//fin if (resBlock.next_block== '')

  txtData             = select("#txtData").value();

  arrTxsUnBlock       = Array();                              
  procesaBolas        = true;
  procesaHeur         = true;
  draw();

}//fin goPost


async function goLast(){
  idBlock = await myConex.getLastBlock (  );

  document.getElementById("txtData").value = idBlock;

  txtData             = select("#txtData").value();

  arrTxsUnBlock       = Array();                              
  procesaBolas        = true;
  procesaHeur         = true;
  draw();

}//fin goLast


//windowResized
/////////////////////////////////////////////////////////////////////////////
function windowResized() {
  resizeCanvas(windowWidth -20, windowHeight - 60 );
  arrTxsUnBlock       = Array();                              
  procesaBolas        = true;
  procesaHeur         = true;
  draw();

}//fin function windowResized

//ejecutaExcel
/////////////////////////////////////////////////////////////////////////////
function ejecutaExcel() {

  // Generamos el Excel de salida
  myGeneraExcel.idBlock         = idBlock;
  myGeneraExcel.literalHeur     = literalHeur;
  myGeneraExcel.generaExcel(  resTxsHeur1Excel, resTxsHeur2Excel, 
                              resTxsHeur3Excel, resTxsHeur4Excel,
                              resTxsHeur5Excel, resTxsHeur6Excel, 
                              resTxsHeur7Excel, resTxsHeur8Excel, 
                              );
  
  arrTxsUnBlock       = Array();                              
  procesaBolas        = true;
  procesaHeur         = true;
  draw();
  // noLoop();

}//fin function ejecutaExcel


//muestraTexto
/////////////////////////////////////////////////////////////////////////////
function muestraTexto(cuentaTxts){
    
    //Display textos laterales
    myTextos = new Bolas();
    myTextos.cuentaTxts = cuentaTxts;
    myTextos.preparaTextos();
    myTextos.displayTextos();

}//fin function muestraTexto(cuentaTxts


//myTime
/////////////////////////////////////////////////////////////////////////////
function myTime(time) {
  let date      = new Date(time * 1000);
  const months  = ["Ene.", "Feb.",  "Mar.",  "Abril", "Mayo", "Jun.", 
                   "Jul.", "Agos.", "Sept.", "Oct.",  "Nov.", "Dic." ];
    
  return date.getDate() + '/' + 
         months[date.getMonth()] +'/'+ 
         date.getFullYear() + ' ' +
         date.getHours() + ':' + 
         date.getMinutes();

}//fin myTime