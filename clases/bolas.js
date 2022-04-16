/////////////////////////////////////////////////////////////////////////////////
// clase Bolas
/////////////////////////////////////////////////////////////////////////////////
class Bolas {

    constructor() {
      this.diameter     = 15;
      this.x            = random( 10,windowWidth - 10 );
      this.y            = 10;
  
      this.altoFranja   = 100;
  
      this.margenVertI  = 40;
      this.margenVertD  = 90;
  
      this.myColor      = 'red';
      this.tipHeur      = 1;
  
      this.arrPosYTxtI  = new Array(10).fill(0);
      this.arrPosYTxtD  = new Array(10).fill(0);
      this.arrPorcen    = new Array(10).fill(0);
      this.cuentaTxts;

      this.buttExcel   ;

    }//fin constructor
  
    //cabeceraGeneral
    ///////////////////////////////////////////////////////////////////////
    cabeceraGeneral(){
  
      let posiYCabecera = 35;
      textFont('Roboto');

      this.buttExcel         = createButton('Descarga fichero Excel.');
      this.buttExcel.position(17, posiYCabecera + 20);
      this.buttExcel.mousePressed(ejecutaExcel);
      
      let blanco        = '    ';
      let cabeceraLin   = 
          'Nº Txs.: '       + (dataBlock[0].n_tx).toLocaleString("en-EN") + blanco +
          'Nº de Bloque: '  + (dataBlock[0].block_index).toLocaleString("es-ES") + blanco +
          'Peso: '          + (dataBlock[0].weight).toLocaleString("es-ES")+ blanco +
          'Time: '          + myTime(dataBlock[0].time) + blanco;

    
      let posiXCentrada = (width/2) - 300;
      textSize(18);
      text(cabeceraLin , posiXCentrada, posiYCabecera-10 );
      
    }//fin cabeceraGeneral
  
  
    //Textos
    ///////////////////////////////////////////////////////////////////////
    preparaTextos(){
      this.altoFranja = ( (windowHeight - margenInf) / 10 );
  
      for(let i=1; i<=cuentaTxts.length; i++) {
        this.arrPosYTxtI[i] = int((i+1) *  this.altoFranja) - (this.altoFranja ) ;
        this.arrPosYTxtD[i] = int((i+1) *  this.altoFranja) - (this.altoFranja/2);
        this.arrPorcen[i]   = ((this.cuentaTxts[i]/ this.cuentaTxts[0])*100).toFixed(1) + ' %' ;
  
      }// fin de for(let i=0; i<=cuentaTxts.leng
  
    }//fin preparaTextos
  
    displayTextos() {
      fill(0);
      textFont('Roboto');

      for(let i=1; i< cuentaTxts.length; i++) {
        textSize(18);
        textStyle(BOLD);
        text(i , 10, this.arrPosYTxtI[i]);
        textStyle(NORMAL);
        text(str(this.arrPorcen[i]) , windowWidth- 80, this.arrPosYTxtD[i]);
  
        textSize(15);
        text(literalHeur[i] , 30, this.arrPosYTxtI[i] );
        text( '( ' +(cuentaTxts[i]).toLocaleString("es-ES")+' Txs. )', textWidth(literalHeur[i]) +  40, this.arrPosYTxtI[i] );
        
            
      }//fin for(let i=1; i<=cuentaTxts.leng
  
    }//fin displayTextos()
  
  
    //Bolas
    ///////////////////////////////////////////////////////////////////////
    preparaBolas(){
  
      this.altoFranja = ( (windowHeight - margenInf) / 10 );
  
      this.y  = random( (( this.tipHeur + 0 ) * this.altoFranja ) + ((this.diameter/2) + 3 ) , 
                        (( this.tipHeur + 1 ) * this.altoFranja ) - ((this.diameter/2) + 12) ) ;
  
      this.x  = random(  ( this.diameter/2) + this.margenVertI , 
                           windowWidth - (this.diameter/2) - this.margenVertD );                      
  
    }//fin preparaBolas
  
    displayBolas() {
      strokeWeight(0.5);
      fill(this.myColor);
      ellipse(this.x, this.y, this.diameter, this.diameter);

    }//fin displayBolas


  
  }//fin class Bolas
  