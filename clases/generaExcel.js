
//Clases auxiliares
/////////////////////////////////////////////////////////////////////////
class GeneraExcel  {
  
    constructor(){

        this.idBlock            = '';
        this.tipo               = '';
        this.hash               = '';
        this.inputs             = {};
        this.out                = {};

        this.literalHeur        = Array();

        this.resTxsHeurExcel    = Array();

        this.fileName           = 'TxsHeur.xls';

  
    }//fin constructor
  


    /////////////////////////////////////////////////////////////////////////////////////////
    //Genera fichero excel de salida
    generaExcel(resTxsHeur1Excel, resTxsHeur2Excel, 
                resTxsHeur3Excel, resTxsHeur4Excel,
                resTxsHeur5Excel, resTxsHeur6Excel, 
                resTxsHeur7Excel, resTxsHeur8Excel,
              ){


                //Genera el Libro Excel
      const wb = new ExcelJS.Workbook();

      //Pestaña 1 Reutilización de direcciones
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws1 = wb.addWorksheet( '1-' + (literalHeur[1]).substring(0,28) );
      this.pestanaExcel('1' , ws1, resTxsHeur1Excel);

      //Pestaña 2-Pago con números redondos.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws2 = wb.addWorksheet( '2-' + (literalHeur[2]).substring(0,28) );
      this.pestanaExcel('2' , ws2, resTxsHeur2Excel);

      //Pestaña 3-Pago a direcciones con formato diferentes.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws3 = wb.addWorksheet( '3-' + (literalHeur[3].substring(0,28)) );
      this.pestanaExcel('3' , ws3, resTxsHeur3Excel);

      //Pestaña 4-Pago usando direcciones Taproot.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws4 = wb.addWorksheet( '4-' + (literalHeur[4]).substring(0,28) );
      this.pestanaExcel('4' , ws4, resTxsHeur4Excel);

      //Pestaña 5-Pago a direcciones con scripts diferente.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws5 = wb.addWorksheet( '5-' + (literalHeur[5]).substring(0,28) );
      this.pestanaExcel('5' , ws5, resTxsHeur5Excel);

      //Pestaña 6-Entrada innecesaria.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws6 = wb.addWorksheet( '6-' + (literalHeur[6]).substring(0,28) );
      this.pestanaExcel('6' , ws6, resTxsHeur6Excel);

      //Pestaña 7-Salida con el monto mayor.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws7 = wb.addWorksheet( '7-' + (literalHeur[7]).substring(0,28) );
      this.pestanaExcel('7' , ws7, resTxsHeur7Excel);

      //Pestaña 8-Versiones de las transacciones.
      ///////////////////////////////////////////////////////////////////////////////////////////////
      const ws8 = wb.addWorksheet( '8-' + (literalHeur[8]).substring(0,28) );
      this.pestanaExcel('8' , ws8, resTxsHeur8Excel);


      //Descargar Excel 
      wb.xlsx.writeBuffer()
          .then(buffer => saveAs(new Blob([buffer]), `${Date.now()}_${this.fileName}`))
          .catch(err => console.log('Error writing excel export', err))


    }//fin de generaExcel


    /////////////////////////////////////////////////////////////////////////////////////////
    //Transforma hash de Tx, imputs y out en json en columnas
    inputsOutToJson(){
      this.resTxsHeurExcel    = Array();

      lengInputs              = this.inputs.length;
      lengOut                 = this.out.length;
  
      // Línea con la Tx
      this.resTxsHeurExcel.push({
                            tipo        : '' ,
                            input_addr  : 'Tx: ' + this.hash,
                            input_value : '',
                            sep         : '',
                            out_addr    : '',
                            out_value   : '',
                          });
  
      //recorremos inputs out montando el excel de salida
      for(let i=0; i<max(lengInputs,lengOut); i++) {
  
        var tipo = '';
        if( i == 0 ) {
          tipo  = this.tipoTransaccion ( lengInputs, lengOut );
        }
        var input_addr = ' ';
        if( i < lengInputs ) {
          input_addr  = this.inputs[i].prev_out.addr;
        }
        var input_value = ' ';
        if( i < lengInputs ) {
          input_value = this.inputs[i].prev_out.value;
        }
        var out_addr = ' ';
        if( i < lengOut ) {
          out_addr = this.out[i].addr;
        }
        var out_value = ' ';
        if( i < lengOut ) {
          out_value = this.out[i].value;
        }
        
        //Líneas con inputs, out
        this.resTxsHeurExcel.push({
                                    tipo        : tipo,
                                    input_addr  : input_addr,
                                    input_value : input_value,
                                    sep         : '',
                                    out_addr    : out_addr,
                                    out_value   : out_value,
                                  });
       
        // 2 líneas en blanco
        if(i == max(lengInputs,lengOut)-1){
          this.resTxsHeurExcel.push({
                                      tipo        : '',
                                      input_addr  : '',
                                      input_value : '',
                                      sep         : '',
                                      out_addr    : '',
                                      out_value   : '',
                                    });
          this.resTxsHeurExcel.push({
                                      tipo        : '',
                                      input_addr  : '',
                                      input_value : '',
                                      sep         : '',
                                      out_addr    : '',
                                      out_value   : '',
                                    });

        }//fin de if(i == max(lengInputs,lengOut)
  
      }// fin de for (let i=0 ; i<max(lengInputs,lengOut); i++)                        
      
      return this.resTxsHeurExcel;


    }//fin de inputsOutToJson

    
    /////////////////////////////////////////////////////////////////////////////////////////
    //pestanaExcel
    pestanaExcel(tipoHeur, myWS, resTxsHeurExcel){
      var fila        = 1;
      var letras      = ['A','B','C','D','E','F']
      const numFmtStr = '_("sats"* #,##0_)'; 

      //////////////////////////////////////////////////////////////////
      //Cabecera del informe

      //Logo   -   b2 
      myWS.getRow(2).height = 30;
      myWS.getCell('A2').value = 'b2' ;
      myWS.getCell('A2').alignment = {
        vertical  : 'center',
        horizontal: 'center'
      };
      myWS.getCell( 'A2').font = {
        name: 'Arial Black',
        size: 15,
        bold: true,
        color: {
          argb: 'ED30FF',
        },
      };
      myWS.getCell( 'A2' ).fill = {
        type    : 'pattern',
        pattern : 'darkVertical',
        fgColor : {argb:'FFFFFF'}
      }; 

      //Logo   -   p5
      myWS.getRow(3).height = 17;
      myWS.getCell('A3').value = 'p5' ;
      myWS.getCell('A3').alignment = {
        vertical  : 'center',
        horizontal: 'center'
      };
      myWS.getCell( 'A3').font = {
        name: 'Arial Black',
        size: 15,
        bold: true,
        color: {
          argb: '859535',
        },
      };
      myWS.getCell( 'A3' ).fill = {
        type    : 'pattern',
        pattern : 'darkVertical',
        fgColor : {argb:'FFFFFF'}
      }; 

      //Título  -  merge a range of cells  -  formato
      myWS.getCell('B1').value = tipoHeur + ' - ' + literalHeur[tipoHeur]  + 
                                 String.fromCharCode(10) + String.fromCharCode(10) +
                                 this.idBlock  ;

      myWS.mergeCells('B1:F4');
      myWS.getCell('B1').alignment = {
                          vertical  : 'middle',
                          horizontal: 'center'
      };
      myWS.getCell( 'B' + fila ).font = {
        name: 'Calibri',
        size: 15,
        bold: true,
      }; 
      myWS.getCell('B' + fila).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      


      //Líneas en blanco
      fila = 5;
      myWS.addRows(Array(['']));
      fila++ ;
      fila++ ;


      //Literales de las cabeceras
      myWS.getCell( 'A'+fila ).value = 'Tipo Tx';
      myWS.getCell( 'B'+fila ).value = 'Input Addr';
      myWS.getCell( 'C'+fila ).value = 'Input Value';
      myWS.getCell( 'E'+fila ).value = 'Out Addr';
      myWS.getCell( 'F'+fila ).value = 'Out Value';
      
      myWS.columns = [
        { key: 'tipo',        width:  14 , },
        { key: 'input_addr',  width:  50 , },
        { key: 'input_value', width:  18 , },
        { key: '',            width:   5 , },
        { key: 'out_addr',    width:  50 , },
        { key: 'out_value',   width:  18 , },
      ]; 
      for(let i=0; i<letras.length; i++) {
        myWS.getCell( letras[i]+fila).font = {
                    name: 'Calibri',
                    size: 13,
                    bold: true
        };   
      }// fin de for(let i=0; i<letras.lengt
      

      //Línea subrrallado literales cabecera
      fila++;
      myWS.mergeCells('A'+fila+':F' + fila);
      myWS.getCell( 'B' + fila ).fill = {
        type    : 'pattern',
        pattern : 'darkVertical',
        fgColor : {argb:'000000'}
      }; 
      myWS.getRow(fila).height = 3;

      //Fila en blanco
      fila++;
      myWS.addRows(Array(['']));


      //////////////////////////////////////////////////////////////////
      //Cuerpo del informe
      fila++;
      for(let i=0; i<resTxsHeurExcel.length; i++) {

        var arrFila = Array();
        arrFila.push([
            resTxsHeurExcel[i].tipo,
            resTxsHeurExcel[i].input_addr, int(resTxsHeurExcel[i].input_value),
            resTxsHeurExcel[i].sep,
            resTxsHeurExcel[i].out_addr, resTxsHeurExcel[i].out_value,
        ]);

        myWS.addRows(arrFila);

        if ( (resTxsHeurExcel[i].input_addr).substr(0,4) == 'Tx: '){
          //Fila de Tx
          
          //Link
          myWS.getCell('B' + fila ).value = {
            text      : resTxsHeurExcel[i].input_addr,
            hyperlink : 'https://www.blockchain.com/es/btc/tx/'+(resTxsHeurExcel[i].input_addr).substr(4),
            tooltip   : 'blockchain.com',
          };
          //Merge
          myWS.mergeCells( 'B'+fila + ':' + 'F'+fila );
          //Font
          myWS.getCell( 'B' + fila ).font = {
                  name    : 'Calibri',
                  size    : 13,
                  bold    : true,
                  color: {
                    argb: 'FFFFFFFF',
                  }
          }; 
          //Pattern
          myWS.getCell( 'B' + fila ).fill = {
            type    : 'pattern',
            pattern : 'darkVertical',
            fgColor : {argb:'88888888'}
          }; 

        } else{

          //Fila de Addrs
          //Formatea columnas con values
          if( int(resTxsHeurExcel[i].input_value) > 0 ){
            myWS.getCell( 'C' + fila ).numFmt = numFmtStr;
          }else{
            myWS.getCell( 'C' + fila ).value = '';
          }     
          if( int(resTxsHeurExcel[i].out_value) > 0 ){
            myWS.getCell( 'F' + fila ).numFmt = numFmtStr;
          }else{
            myWS.getCell( 'F' + fila ).value = '';
          }        

        }//fin de if resTxsHeurExcel[i].input_addr 
        
        fila++ ;
      
      }// fin de for (let i=0; i<resTxsHeurExcel.length; 


    }//fin pestanaExcel
    

    tipoTransaccion ( lengInputs, lengOut ){

      var tipoTxn = '';

      //Determinar tipo de transaccion
      if ( lengInputs == 1 && lengOut == 2 ){
        tipoTxn = 'Envio Simple';
      } else  if (  lengInputs == 1 && lengOut == 1){
          tipoTxn = 'Barrido';
      } else  if (  lengInputs >  1 && lengOut == 1){
          tipoTxn = 'Consolidar';
      } else  if (  lengInputs >= 1 && lengOut >=  2){
          tipoTxn = 'Gasto por lotes';
      } else  if (  lengInputs >  2 && lengOut >  2){
          tipoTxn = 'Coinjoin';
      } else  {
          tipoTxn = '';
      }// fin de if ( lengInputs == 1 && lengOut == 2

      return tipoTxn;

    }//fin tipoTxn ()
    
  
  }// fin de class  GeneraExcel

