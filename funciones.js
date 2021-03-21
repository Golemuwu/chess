var pausa              =     0;
var Velocity           =    15;
var these              =  null;

var dimenW = null;
var dimenH = null;

var next_ID = 0;

var screenfunHasStarted = false;

var thisroom =0 ;

var camera_x = 0;
var camera_y = 0;

matrizForDestroy=[];



scr = {
    Approach: function(start,end,step){
        if(start > end){
            return Math.max(end,start-step);
        }else{
            return Math.min(end,start+step);
        };
    },

    sign: function(number){
        return (number > 0)? 1 : ((number < 0)? -1 : 0);
    },

    place_meeting: function(coord_x,coord_y,objeto,take, room){
        //Take indica si quiero un verdadero o falso si existe un objeto ahi o si devuelve el ID del objeto
        //console.log("Colision");

        room = (room == undefined)? thisroom : instancias.indexOf(""+room)+1;

        take = (take == undefined)? false : true;

        var pmv_existe = instancias[room].indexOf("" + objeto);

        var pmv_return = false;

        for(var i = 0; i < ((pmv_existe!==-1)?(instancias[room][pmv_existe+1].length):(-1)); i++){
            //console.log("Colitzao");

            var otherObjetct = instancias[room][pmv_existe+1][i];

            pmv_return = (coord_x > otherObjetct.x && coord_x < otherObjetct.x+otherObjetct.width) && (coord_y > otherObjetct.y && coord_y < otherObjetct.y+otherObjetct.height);

            //Retorna

            if(pmv_return){
                return (take)? otherObjetct.id : true;
            };


        };

        return false;
    },

    findObjectById: function(identificador){
        if(identificador==false){return false};
        /*var object = identificador.split("").splice(1).join("");
        var id = identificador.split("_")[0];*/

        //Buscar objeto en lista de instancias




        //Alternativa post Rooms

        //obtener los 3 datos que nos da el identificador

        
        var id="";
        var room="";
        var object="";

        var cadena = identificador.split("");

        var id_finish = false;
        var room_finish = false;

        //Hago un for para separar los datos

        for(var i = 0; i < cadena.length ;i++){

            

            id_finish = (cadena[i]==" ")? true : id_finish;

            id+= (id_finish)? "" : ""+cadena[i];

            room_finish = (cadena[i]=="_")? true : room_finish;

            room += (room_finish)? "" :( (id_finish)?(""+cadena[i]):""  );

            object+= (room_finish)? ""+cadena[i] : ""; 



        };

        //Le quito a los datos de room y de objeto el primer digito, ya que esta demas al ser el separador

        room = room.substring(1);

        



        object = object.substring(1);

        //console.log(identificador+ "   "+ id +"-owo-"+ room + "-owo-"+object);
        

        var indexRoom = (instancias.indexOf(room)!==-1)? instancias.indexOf(room)+1 : false;

        var indexObj = (instancias[indexRoom].indexOf(object)!==-1)? instancias[indexRoom].indexOf(object)+1 : false;

        var thatisTheInstance = null;

        

        //Busco la instancia que coincide

        for(var i = 0; i < instancias[indexRoom][indexObj].length && thatisTheInstance==null; i++){

            thatisTheInstance = (instancias[indexRoom][indexObj][i].id == identificador)? i : thatisTheInstance;

        };

        return instancias[indexRoom][indexObj][thatisTheInstance];
    },

    instanceDestroy: function(identificador){
        if(identificador==false){return false};

        var id="";
        var room="";
        var object="";

        var cadena = identificador.split("");

        var id_finish = false;
        var room_finish = false;

        //Hago un for para separar los datos

        for(var i = 0; i < cadena.length ;i++){

            

            id_finish = (cadena[i]==" ")? true : id_finish;

            id+= (id_finish)? "" : ""+cadena[i];

            room_finish = (cadena[i]=="_")? true : room_finish;

            room += (room_finish)? "" :( (id_finish)?(""+cadena[i]):""  );

            object+= (room_finish)? ""+cadena[i] : ""; 



        };

        //Le quito a los datos de room y de objeto el primer digito, ya que esta demas al ser el separador

        room = room.substring(1);

        



        object = object.substring(1);

        //console.log(identificador+ "   "+ id +"-owo-"+ room + "-owo-"+object);
        

        var indexRoom = (instancias.indexOf(room)!==-1)? instancias.indexOf(room)+1 : false;

        var indexObj = (instancias[indexRoom].indexOf(object)!==-1)? instancias[indexRoom].indexOf(object)+1 : false;

        var thatisTheInstance = null;

        

        //Busco la instancia que coincide

        for(var i = 0; i < instancias[indexRoom][indexObj].length && thatisTheInstance==null; i++){

            thatisTheInstance = (instancias[indexRoom][indexObj][i].id == identificador)? i : thatisTheInstance;

        };

        instancias[indexRoom][indexObj].splice(thatisTheInstance,1);
    },
};

var other_id;

function saveOther(id){
    other_id = id;
};

function other(){
    return scr.findObjectById(other_id);
};





var teclado={
    teclas_mantenidas: new Array(),
    teclas_pulsadas: new Array(),
    teclas_soltadas: new Array(),
    iniciar: function(){
        document.onkeydown=teclado.guardarTecla;
        document.onkeyup  = teclado.borrarTecla;
    },
    guardarTecla: function(e){
        if (teclado.teclas_mantenidas.indexOf(e.keyCode) == -1){
            teclado.teclas_mantenidas.push(e.keyCode);
            teclado.teclas_pulsadas.push(e.keyCode);
            //console.log(teclado.teclas_pulsadas);
        };
    },
    borrarTecla: function(e){
        var posicion = teclado.teclas_mantenidas.indexOf(e.keyCode);
        if(posicion !== -1){
            teclado.teclas_mantenidas.splice(posicion, 1);
            teclado.teclas_soltadas.push(e.keyCode);
        };
    },
    teclaPulsada: function(codigoTecla){
        return (teclado.teclas_mantenidas.indexOf(codigoTecla) !== -1) ? true : false;
    },
    reiniciar: function(){
        teclado.teclas_pulsadas = new Array;
        teclado.teclas_soltadas = new Array;
    }
};

teclado.iniciar();

function keyboard_checkpress(tecla){
    return teclado.teclas_mantenidas.indexOf(tecla)!== -1;
};

function keyboard_checkreleased(tecla){
    return teclado.teclas_soltadas.indexOf(tecla)!== -1;
};

function keyboard_checkpressed(tecla){
    return teclado.teclas_pulsadas.indexOf(tecla)!== -1;
};

var mouse={
    click_mantenido: false,
    click_pulsado: false,
    click_soltado: false,
    x: null,
    y: null,
    aux:false,

    activar: function(){

        var cv = document.querySelector("canvas");

        cv.onmousemove = function(event){
            //console.log(event.clientX);
            mouse.x = event.clientX /dimenW * 800- camera_x;
            mouse.y = event.clientY /dimenW * 800- camera_y;
        };

        //Chequeo cuales clickeo para meterlas en pulsadas y mantenidas

        

        cv.onmousedown = function(event){
            mouse.aux = true;
        };

        //Chequeo cuales suelto para meterlas en soltadas y sacarlas de mantenidas

        cv.onmouseup = function(event){
            mouse.aux = false;
        };

        mouse.click_pulsado = (mouse.click_mantenido == false && mouse.aux ==true);
        mouse.click_soltado = (mouse.click_mantenido == true && mouse.aux == false)
        mouse.click_mantenido = mouse.aux;


        

        
        
    }
}

var touch={
    click_mantenido: false,
    click_pulsado: false,
    click_soltado: false,
    x: null,
    y: null,
    aux:false,

    activar: function(){

        document.getElementById("screen").addEventListener("touchmove",t1);

        function t1 (event){
            //console.log(event.screenX);
            //console.log(event);
            touch.x = event.touches[0].clientX /dimenW * 800- camera_x;
            touch.y = event.touches[0].clientY /dimenW * 800- camera_y;
            
        };

        


        //Chequeo cuales clickeo para meterlas en pulsadas y mantenidas

        document.getElementById("screen").addEventListener("touchstart",t2);

        function t2 (event){
            touch.aux = true;
            //console.log(event.touches[0].clientX);
        };

        //Chequeo cuales suelto para meterlas en soltadas y sacarlas de mantenidas

        document.getElementById("screen").addEventListener("touchend",t3);

        function t3 (event){
            touch.aux = false;
        };

        //console.log(touch.x)

        touch.click_pulsado = (touch.click_mantenido == false && touch.aux ==true);
        touch.click_soltado = (touch.click_mantenido == true && touch.aux == false)
        touch.click_mantenido = touch.aux;


        

        
        
    }
}


//------------------------
function screenfun(tilesX,tilesY){
    var dimensiones = {
        ancho: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        alto: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        };
    
    if ( dimensiones.ancho/tilesX < dimensiones.alto/tilesY) {
            escala= dimensiones.ancho/tilesX;
    } else {
            escala= dimensiones.alto/tilesY;
    };

    dimenH = dimensiones.alto;
    dimenW = dimensiones.ancho;
    

    

    if(screenfunHasStarted == false){
    var html = document.getElementById("juego").innerHTML;
    var div= "<canvas id= screen width=1600 height=900></canvas>";
    document.getElementById("juego").innerHTML = html + div;
    screenfunHasStarted = true;

    stk = document.querySelector("canvas").getContext("2d");
    stk.fillStyle="black";
    //stk.translate(2,2);

    //Esto es para la calidad de la pantalla

    stk.width="1600";
    stk.height="900";
    stk.scale(2,2);

    stk.fillRect(0,0,800,450);
    
    };
    

    var margenGrosor = 1;
    

    /*document.getElementById("screen").style.width  = (Math.floor(escala * tilesX * 0.9)+ "px");
    document.getElementById("screen").style.height = (Math.floor(escala* tilesY * 0.9)+ "px");

    



    
    document.getElementById("screen").style.border = margenGrosor + "px solid #000000";
    //console.log(dimensiones.alto);                                     console.log
    //-----------------Centrar
    document.getElementById("juego").style.position = "absolute";
    document.getElementById("juego").style.left = Math.floor((dimensiones.ancho - (escala * tilesX) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    document.getElementById("juego").style.top  = Math.floor((dimensiones.alto  - (escala * tilesY) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles*/
    //----------------/Centrar

};
    //----------------/Dibujar Numeros

function drawNum(Num,X,Y,esc,color){
    var digitos = Num.toString().split("");

    //stk.fillStyle=color;

    for(i=0;i<digitos.length;i++){
        digitos[i] = parseInt(digitos[i]);
    };

    for(j=0; j< digitos.length; j++){
        addDraw(false,color,X+(j*4)*esc,Y, esc      * !(digitos[j]==1)                       , esc);
    
        addDraw(false,color,X+(j*4+1)*esc,Y, esc                           * !(digitos[j]==1) * !(digitos[j]==4)    , esc);
        addDraw(false,color,X+(j*4+2)*esc,Y, esc                                                                    , esc);

        addDraw(false,color,X+(j*4)*esc,Y+esc*3/4, esc            * !(digitos[j]==1) * !(digitos[j]==2) * !(digitos[j]==3)    , esc);
        addDraw(false,color,X+(j*4+2)*esc,Y+esc*3/4, esc          * !(digitos[j]==5) * !(digitos[j]==6)                       , esc);

        addDraw(false,color,X+(j*4)*esc,Y+esc*3/4*2, esc          * !(digitos[j]==1) * !(digitos[j]==7)                       , esc);
        addDraw(false,color,X+(j*4+1)*esc,Y+esc*3/4*2, esc        * !(digitos[j]==1) * !(digitos[j]==0) * !(digitos[j]==7)    , esc);
        addDraw(false,color,X+(j*4+2)*esc,Y+esc*3/4*2, esc                       , esc);

        addDraw(false,color,X+(j*4)*esc,Y+esc*3/4*3, esc          * !(digitos[j]==1) * !(digitos[j]==3) * !(digitos[j]==4) * !(digitos[j]==5) * !(digitos[j]==7) * !(digitos[j]==9)          , esc);
        addDraw(false,color,X+(j*4+2)*esc,Y+esc*3/4*3, esc        * !(digitos[j]==2)               , esc);

        addDraw(false,color,X+(j*4)*esc,Y+esc*3, esc              * !(digitos[j]==1) * !(digitos[j]==4) * !(digitos[j]==7)            , esc);
        addDraw(false,color,X+(j*4+1)*esc,Y+esc*3, esc            * !(digitos[j]==1) * !(digitos[j]==4) * !(digitos[j]==7)            , esc);
        addDraw(false,color,X+(j*4+2)*esc,Y+esc*3, esc                                                                                , esc);
    };


    //console.log(digitos);
};



/////// Lo de bucle principal viste? me parece obvio
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,
    fps: 0,
    CPA: 0,
    iterar: function(registroTemporal) {
        buclePrincipal.idEjecucion = window.requestAnimationFrame(buclePrincipal.iterar);

        buclePrincipal.actualizar(registroTemporal);
        teclado.reiniciar();

        var camX = camera_x;
        var camY = camera_y;

        stk.translate(camX,camY);
        buclePrincipal.dibujar();
        stk.translate(-camX,-camY);

        screenfun(16,9);

        if(registroTemporal - buclePrincipal.ultimoRegistro > 999) {
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: " + buclePrincipal.aps + "/ FPS: " + buclePrincipal.fps);
            buclePrincipal.fps = 0;
            buclePrincipal.aps = 0;
            buclePrincipal.CPA=0;
        }
    },
    detener: function() {

    },
    actualizar: function(registroTemporal) {
        

        /*var izquierda =      (teclado.teclas.indexOf("ArrowLeft") !== -1  ||  teclado.teclas.indexOf("a") !== -1);
        var derecha   =      (teclado.teclas.indexOf("ArrowRight")!== -1  ||  teclado.teclas.indexOf("d") !== -1);

        var direccion =  derecha - izquierda;*/

        //instancias[instancias.indexOf("Player")+1][0].x+=direccion;

        //Obtengo los datos del mouse

        

        mouse.activar();
        touch.activar();

        

        

        



        //----

        for(var k = 0; k < rooms_activas.length; k++){

            thisroom = instancias.indexOf(rooms_activas[k])+1;

            

            for(var i = 0; i<instancias[thisroom].length;i+=2){

                

                //Para cada lista de objetos
                try{
                    for(var j = 0; j < instancias[thisroom][i+1].length; j++){
                        //Para cada objeto en la lista
                        

                        if(matrizStep.indexOf("" + instancias[thisroom][i]) !==-1){
                            these = instancias[thisroom][i+1][j];

                            //Realiza el Step del objeto, en esta instancia

                            

                            matrizStep[matrizStep.indexOf("" + instancias[thisroom][i])+1]();

                            instancias[thisroom][i+1][j] = these;
                        };
                    };
                } catch(error){
                    console.error("Habitacion activa: "+rooms_activas[k]+" vacia (necesita un objeto)");
                };
            };
        };

        //Destruyo las id de matriz for destroy

        for(var i = 0; i < matrizForDestroy.length; i++){
            scr.instanceDestroy(matrizForDestroy[i]);
        };
        matrizForDestroy=[];

        
        buclePrincipal.aps++;
        buclePrincipal.CPA++;


        if(buclePrincipal.CPA >= Velocity+50*pausa){
            buclePrincipal.CPA=0;
        };



        
    },
    dibujar: function(registroTemporal) {
        buclePrincipal.fps++;

        stk.fillStyle="black";
        stk.fillRect(-camera_x+400-400,0-camera_y,800,450);

        stk.fillStyle="red";

        


        //Objetivo: creo que actualmente "room dibujada" no es mas que un numero forzado que se deberia reemplazar por numeros dependiendo de las rooms dibujadas (otra matriz)

        
        

        /*-----------------------------Atencion, esta parte del codigo quedo obsoleta
        Nota: Esto era una forma de mostrar sprites anterior al addEventDraw
        
        var room_dibujada=1;
        
        for(var i = 0; i<instancias[room_dibujada].length;i+=2){
            //Para cada lista de objetos
            for(var j = 0; j < instancias[room_dibujada][i+1].length; j++){
                //Para cada objeto en la lista

                if(matrizSprites.indexOf(  instancias[room_dibujada][i+1][j].sprite_index) !==-1){
                    

                    //Lo dibuja en sus coordenadas

                    

                    //Busco el sprite de esta instancia

                    var insSpr = matrizSprites[matrizSprites.indexOf(instancias[room_dibujada][i+1][j].sprite_index)+1]; //Diminutivo de instanceSprite

                    var anchura = (instancias[room_dibujada][i+1][j].sprite_width == undefined)? insSpr.x_end : instancias[room_dibujada][i+1][j].sprite_width;
                    var altura  = (instancias[room_dibujada][i+1][j].sprite_height == undefined)? insSpr.y_end : instancias[room_dibujada][i+1][j].sprite_height;

                    instancias[room_dibujada][i+1][j].sprite_subindex = (instancias[room_dibujada][i+1][j].sprite_subindex >= insSpr.length)? 0 : instancias[room_dibujada][i+1][j].sprite_subindex;

                    var num = (instancias[room_dibujada][i+1][j].sprite_subindex==undefined)? 0 : Math.floor(instancias[room_dibujada][i+1][j].sprite_subindex);


                    //stk.drawImage(insSpr.image, insSpr.x_0[0], insSpr.y_0[0], insSpr.x_end, insSpr.y_end, instancias[i+1][j].x, instancias[i+1][j].y, 17, 32);

                    stk.drawImage(insSpr.image, insSpr.x_0[num], insSpr.y_0[num], insSpr.x_end, insSpr.y_end, (instancias[room_dibujada][i+1][j].xreference == undefined)? instancias[room_dibujada][i+1][j].x : instancias[room_dibujada][i+1][j].xreference, (instancias[room_dibujada][i+1][j].yreference == undefined)? instancias[room_dibujada][i+1][j].y : instancias[room_dibujada][i+1][j].yreference, anchura, altura);

                    //La dibujo

                    

                    

                    //console.log("Dibujando");

                    
                };
            };
        };------------------------------------------------------*/



        for(var k = 0; k < rooms_dibujadas.length; k++){

            thisroom = instancias.indexOf(rooms_dibujadas[k])+1;

            

            for(var i = 0; i<instancias[thisroom].length;i+=2){

                

                //Para cada lista de objetos
                try{
                    for(var j = 0; j < instancias[thisroom][i+1].length; j++){
                        //Para cada objeto en la lista
                        

                        if(matrizStep.indexOf("" + instancias[thisroom][i]) !==-1){
                            these = instancias[thisroom][i+1][j];

                            //Realiza el Step(Draw) del objeto, en esta instancia

                            

                            matrizEventDraw[matrizEventDraw.indexOf("" + instancias[thisroom][i])+1]();

                            instancias[thisroom][i+1][j] = these;
                        }; 
                    };
                } catch(error){
                    console.error("Habitacion dibujada: "+rooms_dibujadas[k]+" vacia (necesita un objeto)");
                }
            };
        };



        for(var i = 0; i < matrizDraw.length; i++){

            if(matrizDraw[i].isSprite==true){
                //Obtener el source

                var s = matrizSprites[matrizSprites.indexOf(""+matrizDraw[i].nameOrColor)+1];

                var d = matrizDraw[i];

                var num= Math.floor(d.sub_index);

                


                stk.drawImage(s.image ,s.x[num] ,s.y[num] ,s.w ,s.h ,d.x ,d.y ,d.w ,d.h );


                //Ingresar datos
                //stk.drawImage(imageSource,sx,sy,sw,sh,dx,dy,dw,dh);

                //stk.drawImage(s.src ,sx,sy,sw,sh,dx,dy,dw,dh);
            }else{
                stk.fillStyle = matrizDraw[i].nameOrColor;
                stk.fillRect(matrizDraw[i].x,matrizDraw[i].y,matrizDraw[i].w,matrizDraw[i].h);
            };
        };

        matrizDraw = [];

        



        

        

        

    },
};


screenfun(20,12);
//20-12-1
matrizSetUp = [];

function addSetUp(objeto,funcion){

    //Busco si ya existe

    var existe_dsu = (matrizSetUp.indexOf(""+objeto)!==-1);

    //Si no existe hago que exista

    if(!existe_dsu){

        matrizSetUp.push(""+objeto);
        matrizSetUp.push(funcion);
    }else{console.log("ERR: Este SetUp ya existe")};

};

matrizStep = [];

function addStep(objeto,funcion){

    //Busco si ya existe

    var existe_dst = (matrizStep.indexOf(objeto)!==-1);

    //Si no existe hago que exista

    if(!existe_dst){

        matrizStep.push(""+objeto);
        matrizStep.push(funcion);
    }else{console.log("ERR: Este Step ya existe")};

};

matrizSprites = [];

function addSprite(nombre,direccion,desde_x,desde_y,hasta_x,hasta_y,length){

    //Debo ingresar los datos en forma de matriz, y asi elaborar la animacion uwu

    var aux = new Image;
    aux.src = direccion;

    
    matrizSprites.push(""+nombre);
    var sprite = {
        image: aux,  //La direccion desde la que carga la imagen
        x: desde_x, 
        y: desde_y,
        w: hasta_x,
        h: hasta_y,
        length: length, //Cantidad de subimagenes
    };

    matrizSprites.push(sprite);

};


instancias    = [];
rooms_activas = [];
//ro om_dibujada = 1;
rooms_dibujadas = ["0"];


function crearInstancia(objeto,x,y,width,height,room){

    room = (room==undefined)? 0 : room;

    //Alto y ancho por defecto
    width  = (width==undefined)? 32 : width;
    height = (height==undefined)? 32 : height;
    //Buscar si ya existen instancias de este objeto
    

    //Si no exisate la room, la creo

    if(instancias.indexOf(""+room)==-1){
        instancias.push(""+room);
        instancias.push([]);
    };

    var thisroom = instancias.indexOf(""+room)+1;



    //Si no existe crea un elemento llamado asi en el array, y  en el siguiente bloque pone un array de sus instancias
    
    var existen = (instancias[thisroom].indexOf(objeto)!=-1);
    
    
    if(!existen){
        instancias[thisroom].push(""+objeto);
        instancias[thisroom].push([]);
    };

    //Crea la nueva instancia

    var nuevaInstancia ={
        objeto: ""+objeto,
        id: next_ID + " " + room +"_" + objeto,
        nombre:"",
        x: x,
        y: y,
        width: width,
        height: height,
        rooms: room,
    };

    //Actualizo el valor de la siguiente id

    next_ID++;

    //Se fija que ya haya un espacio para las instancias en esta room

    








    //Coloca la nueva instancia

    instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1].push(nuevaInstancia);

    //Ejecuto el setUp

    var toReturn = null;

    if(matrizSetUp.indexOf("" + objeto) !==-1){
        //these = instancias[thisroom][instancias[thisroom].indexOf(objeto)+1][instancias[instancias[thisroom].indexOf(objeto)+1].length-1];

        var backThese = these;


        these = instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1][                instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1].length-1                                 ];
        //Realiza el Step del objeto, en esta instancia

        

        matrizSetUp[matrizSetUp.indexOf("" + objeto)+1]();

        instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1][                instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1].length-1               ] = these;

        toReturn = these.id;



        these = backThese;

        //Nota : Probablemente al crear una instancia desde otra se cree un bug por cambiar el significado de these
    };

    return scr.findObjectById(toReturn);


};

matrizDraw = [];

function addDraw(isSprite,nameOrColor,coord_x,coord_y,ancho,alto,sub_index){

    var draw ={
        isSprite: isSprite,
        nameOrColor: nameOrColor, //Esto indica el color si no es sprite, y el sprite si es sprite
        x: coord_x,
        y: coord_y,
        w: ancho,
        h: alto,
    };

    if(sub_index!==undefined){
        draw.sub_index = sub_index;
    };

    matrizDraw.push(draw);
};

//En el evento dibujar, basicamente se repite lo que sucede al dibujar sprites

matrizEventDraw = [];

function addEventDraw(objeto,funcion){

    //Busco si ya existe

    var existe_ded = (matrizEventDraw.indexOf(objeto)!==-1);

    //Si no existe hago que exista

    if(!existe_ded){

        matrizEventDraw.push(""+objeto);
        matrizEventDraw.push(funcion);
    }else{console.log("ERR: Este EventDraew ya existe")};


}


function addInstanceType(objeto, setup, step, eventdraw){

    addSetUp(objeto,setup);
    addStep(objeto,step);
    addEventDraw(objeto,eventdraw);

};






















//---------------------------------------------FRONTERAAAAAAAA
//,17,17*2,17*3,17*4,17*5,17*6,17*7

rooms_activas.push("0");
//rooms_activas.push("owo");


addSprite("Player_walk_rigth","Player_1_walk.png",[0,1024,1024*2,1024*3,1024*4,1024*5,1024*6,1024*7],[0,0,0,0,0,0,0,0],1024,1024,8);
addSprite("tablero","tablero.png",[0],[0],450,450,1);

var num = 256/6;

addSprite("piezas","piezas.png",[0,num,num*2,num*3,num*4,num*5,0,num,num*2,num*3,num*4,num*5],[0,0,0,0,0,0,42,42,42,42,42,42],num,42,12)
/*addSprite("Player_walk_left","Player_1_walk_left.png",[1024*7,1024*6,1024*5,1024*4,1024*3,1024*2,1024,0],[0,0,0,0,0,0,0,0],1024,1024,8);
addSprite("Player_idle_rigth","Player_1_idle_rigth.png",[0,1024],[0,0],1024,1024,2);
addSprite("Player_idle_left","Player_1_idle_left.png",[0,1024],[0,0],1024,1024,2);
addSprite("Player_punch_rigth","Player_1_Punch_rigth.png",[0,1024,1024*2,1024*3,1024*4,1024*5,1024*6,1024*7],[0,0,0,0,0,0,0,0],1024,1024,8);

addSprite("Player_glargo_rigth","Player_1_gl_r.png",[0,1024,1024*2,1024*3],[0,0,0,0],1024,1024,4);*/



jugadores    = 0;
jugadorVinc  = 0;

items = 0;




id_j1 = null;
id_j2 = null;



addInstanceType("Player",

function(){

    
    these.j = jugadores+1;
    jugadores = (jugadores==0)? 1 : 0;
    
    

    if(these.j==1){
        id_j1 = these.id;
    }else{
        id_j2 = these.id;
    };
},

function(){

    

    these.y = these.y + ((keyboard_checkpress(83) && these.j==1) || (keyboard_checkpress(40) && these.j==2))* 2 - ((keyboard_checkpress(87) && these.j==1) || (keyboard_checkpress(38) && these.j==2))* 2;
    
    
},

function() {

    addDraw(false,"red",these.x,these.y,32,32);

    addDraw(false,"#5555FF",these.x,these.y-20,these.carga * these.width/100,3);


    addDraw(true, "Player_walk_rigth",these.x+60,these.y,32,32,5);
    
}

);







addInstanceType("mouse",function(){},function(){
    these.x = touch.x || mouse.x;
    these.y = touch.y || mouse.y;
    //console.log(these.x)
},function(){
    


    addDraw(true,"tablero",350/2,0,450,450,0);
    //addDraw(false,"#FFFF55",these.x,these.y,these.width,these.height);
});



addInstanceType("draganddrop",function(){

    these.clicked = false;
    these.pieza=0;

},function(){

    //console.log(client.x);
    these.clicked = (scr.place_meeting(other().x,other().y,"draganddrop",true) == these.id && (mouse.click_mantenido || touch.click_mantenido) && these.clicked == false)? true : these.clicked;
    these.clicked = these.clicked && (mouse.click_mantenido || touch.click_mantenido);

    these.x = (these.clicked)? other().x-15: these.x;
    these.y = (these.clicked)? other().y-15: these.y;
    

},function(){
    var color = (these.clicked!=false)? "#FF5555" : "#5555FF";
    //addDraw(false,color,these.x,these.y,these.width,these.height);

    addDraw(true,"piezas",these.x,these.y,these.width,these.height,these.pieza);
});

































//Cracion de instancias

//crearInstancia("Player",0+22+10,225);

saveOther(crearInstancia("mouse",0,0).id);

var num = 45.6;
var num2 = 215+9;
var num1 = 48;

crearInstancia("draganddrop",num2,num1).pieza = 0;
crearInstancia("draganddrop",num2+num,num1).pieza=1;
crearInstancia("draganddrop",num2+num*2,num1).pieza=2;
crearInstancia("draganddrop",num2+num*3,num1).pieza=3;
crearInstancia("draganddrop",num2+num*4,num1).pieza=4;
crearInstancia("draganddrop",num2+num*5,num1).pieza =2;
crearInstancia("draganddrop",num2+num*6,num1).pieza = 1;
crearInstancia("draganddrop",num2+num*7,num1).pieza=0;;
// 540 max 215 min, con 8 en medio

num1 +=num;
crearInstancia("draganddrop",num2,num1).pieza = 5;
crearInstancia("draganddrop",num2+num,num1).pieza = 5;
crearInstancia("draganddrop",num2+num*2,num1).pieza = 5;
crearInstancia("draganddrop",num2+num*3,num1).pieza = 5;
crearInstancia("draganddrop",num2+num*4,num1).pieza = 5;
crearInstancia("draganddrop",num2+num*5,num1).pieza = 5;
crearInstancia("draganddrop",num2+num*6,num1).pieza = 5;
crearInstancia("draganddrop",num2+num*7,num1).pieza = 5;

num1 += num*5+2;

crearInstancia("draganddrop",num2,num1).pieza = 11;
crearInstancia("draganddrop",num2+num,num1).pieza = 11;
crearInstancia("draganddrop",num2+num*2,num1).pieza = 11;
crearInstancia("draganddrop",num2+num*3,num1).pieza = 11;
crearInstancia("draganddrop",num2+num*4,num1).pieza = 11;
crearInstancia("draganddrop",num2+num*5,num1).pieza = 11;
crearInstancia("draganddrop",num2+num*6,num1).pieza = 11;
crearInstancia("draganddrop",num2+num*7,num1).pieza = 11;

num1 += num;

crearInstancia("draganddrop",num2,num1).pieza = 6;
crearInstancia("draganddrop",num2+num,num1).pieza = 7;
crearInstancia("draganddrop",num2+num*2,num1).pieza = 8;
crearInstancia("draganddrop",num2+num*3,num1).pieza = 9;
crearInstancia("draganddrop",num2+num*4,num1).pieza = 10;
crearInstancia("draganddrop",num2+num*5,num1).pieza = 8;
crearInstancia("draganddrop",num2+num*6,num1).pieza = 7;
crearInstancia("draganddrop",num2+num*7,num1).pieza = 6;



console.log(instancias);








buclePrincipal.iterar();



/*crearInstancia("Suelo",40,200,130,20);
crearInstancia("Suelo",40,330,130,20);
crearInstancia("Suelo",340,200,120,20);
crearInstancia("Suelo",200,250,120,20);

crearInstancia("Suelo",300,410,200,20);
crearInstancia("Suelo",0,430,800,20);

crearInstancia("Suelo",0,0,20,430);

crearInstancia("Fuego",60,410,20,20);*/

//crearInstancia("Player",20,60,10,20);


//instancias[1][instancias.indexOf("Player")+1][0].ganasDeVivir="Pocas";



/*

Descripcion: Probar a hacer un menu para actualizar el framework



*/





