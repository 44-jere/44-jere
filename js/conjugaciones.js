const tabla=document.getElementById("tabla")
const inputs=document.getElementsByClassName("textBox")
const titulo=document.getElementById("palabra")

let lista=[]
let palabritas
  
class palabras {
    constructor(presente, pasado, perfect, foto) {
      this.present = presente;
      this.pasado = pasado;
      this.perfect = perfect;
      this.foto = foto;
    }
}
  
function insertarVerbosConstructor() {
    // Devuelve una promesa que se resolverá cuando se complete la petición HTTP
    return new Promise((resolve, reject) => {
      // extraer JSON
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", "verbos-copy.json", true);
      xhttp.send();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // convertir a JSON
          let datos = JSON.parse(this.responseText);
  
          // insertar los verbos al contructor
          for (let verbos of datos) {
            palabritas = new palabras(
              verbos.present,
              verbos.pasado,
              verbos.perfect
            );
            lista.push(palabritas);
          }
  
          // Resuelve la promesa
          resolve();
        }
      };
    });
}

function PresenteSimple(pronombre,verb){
    
    if(pronombre==="is"){

   let vocales = ["a", "e", "i", "o", "u"]
        let separar=verb.split("")
        let indexY=separar.indexOf("y")
        let hayVocal= vocales.indexOf(separar[indexY-1])    

        if(vocales[hayVocal] && separar[indexY]){
            // si termina en vocal e Y, solo agregamos S
           return verb+"s"
        }else if(separar[separar.length-1]==="y"&& vocales[hayVocal]===undefined){
            // si termina en Y agregamos ies
            separar.splice(indexY)
            let segundoResultado= separar.join("")+"ies"
           return segundoResultado
        }else if(
            // si termina en ss sh ch x agregamos es al final
            separar[separar.length-1]==="s"&&
            separar[separar.length-2]==="s"||
            separar[separar.length-1]==="h"&&
            separar[separar.length-2]==="s"||
            separar[separar.length-1]==="h"&&
            separar[separar.length-2]==="c"||
            separar[separar.length-1]==="x"||
            separar[separar.length-1]==="o"
        ){
           return verb+"es"
        }else{
            // a cualquier otro verbo solo le agregamos S
           return verb+"s"
        }
    }else{
        // sino es tercera persona solo devuelve el verbo
       return verb
    }
}

function aleatoriedad(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

insertarVerbosConstructor().then(() => {

    let palabra =lista[aleatoriedad(0,lista.length-1)]
    titulo.innerHTML=palabra.present

    titulo.addEventListener("mousedown",(e)=>{
        titulo.innerHTML= `${palabra.present} ${palabra.pasado} ${palabra.perfect}`
    })

    titulo.addEventListener("mouseup",(e)=>{
        titulo.innerHTML= palabra.present
    })
    
    function pintar(inputs,condicion){
        inputs.classList.remove('correct');
        inputs.classList.remove('incorrect');
        if(condicion==="correct"){
            inputs.classList.add('correct')
        }else{
            inputs.classList.add('incorrect')
        }
    }

    tabla.addEventListener("keydown",(e)=>{
        console.log(PresenteSimple("is",palabra.present))
        if(e.key==="Enter"){

            for(i=0;i<inputs.length;i++){

                if(inputs[i].value!==""){

                    if(i===0||i%3===0){
                     if(inputs[i].value===palabra.present||inputs[i].value===PresenteSimple("is",palabra.present)){
                        pintar(inputs[i],"correct")
                     }else{
                         pintar(inputs[i],"incorrect")
                     }
                    }else if(i===1||(i-1)%3===0){
                     if(inputs[i].value===palabra.pasado){
                         pintar(inputs[i],"correct")
                     }else{
                         pintar(inputs[i],"incorrect")
                     }
                    }else if(i===2||(i-2)%3===0){
                     if(inputs[i].value===palabra.perfect){
                         pintar(inputs[i],"correct")
                     }else{
                         pintar(inputs[i],"incorrect")
                     }
                 }

               }
            }

        }
    })
});