class Conex{

    constructor(url){

        this.url            = url;
        this.respuesta      = Array();

    }

    
    async getTxUnConf () {

        let urlTxsUnConfir          = 'https://blockchain.info/unconfirmed-transactions?format=json';
        this.url                    = urlTxsUnConfir;
        var resTxsUnConfir          = Array();
    
        let res                     = await axios.get( this.url );
    
        for (var i=0; i<res.data.txs.length; i++){
          
          var fee_size = (res.data.txs[i].fee / res.data.txs[i].size).toFixed(2); 
          resTxsUnConfir.push({
                                hash:       res.data.txs[i].hash,
                                time:       res.data.txs[i].time, 
                                tx_index:   res.data.txs[i].tx_index,
                                fee:        res.data.txs[i].fee,
                                size:       res.data.txs[i].size,
                                fee_size:   fee_size
                              });                                     
    
        }//fin de for (var i=0; 

        return resTxsUnConfir;
    
    }// fin de getTxsUnConfir
      
      
    async getBlock ( idBlock ) {

        let urlBlock                = 'https://blockchain.info/rawblock/'
        this.url                    = urlBlock + idBlock ;
        var resBlock                = Array();
    
        let res                     = await axios.get( this.url );
           
        resBlock = ({  
                        hash:           res.data.hash , 
                        bits:           res.data.bits,
                        prev_block:     res.data.prev_block,
                        next_block:     res.data.next_block,
                        fee:            res.data.fee,
                        nonce:          res.data.nonce,
                        size:           res.data.size,
                        time:           res.data.time,
                     });
    
        this.respuesta = res;

        return resBlock
    
    }// fin de getTxsBlock


    async getBlockHeight ( idBlock ) {

        let urlBlock                = 'https://blockchain.info/block-height/'
        this.url                    = urlBlock + idBlock  + '?format=json';
        var resBlock                = Array();
        
        let res                     = await axios.get( this.url );

        resBlock = ({  
                        hash:           res.data.blocks[0].hash , 
                        bits:           res.data.blocks[0].bits,
                        prev_block:     res.data.blocks[0].prev_block,
                        next_block:     res.data.blocks[0].next_block,
                        fee:            res.data.blocks[0].fee,
                        nonce:          res.data.blocks[0].nonce,
                        size:           res.data.blocks[0].size,
                        time:           res.data.blocks[0].time,
                        ver:            res.data.blocks[0].ver,
                        block_index:    res.data.blocks[0].block_index,
                     });
    

        return resBlock
    
    }// fin de getTxsBlock


    async getTxsBlock ( idBlock ) {

        let urlTxsBlock             = 'https://blockchain.info/rawblock/'
        this.url                    = urlTxsBlock + idBlock ;
        var resTxsBlock             = Array();
    
        let res                     = await axios.get( this.url );
    
        for (var i=0; i<res.data.tx.length; i++){
          resTxsBlock.push({ 
                            hash:   res.data.tx[i].hash , 
                            time:   res.data.tx[i].time,
                            inputs: res.data.tx[i].inputs,
                            out:    res.data.tx[i].out,
                           });
    
        }// fin de for (var i=0; i<res.data
    
        this.respuesta = resTxsBlock;
    
    }// fin de getTxsBlock


    async getLastBlock(){

        let urlLastBlock        = 'https://blockchain.info/q/latesthash';
      
        this.url                = urlLastBlock;

        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Accept': 'text/html',
        //     'Accept-Language': 'en-EN',
        //     'Cache-Control': 'no-cache',
        //     'Access-Control-Allow-Origin': '*'
        // };

        let res                 = await axios.get( this.url   )
                                    

        return res.data;

    } // fin de async getLastBlock(



} //fin de class Conex