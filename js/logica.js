const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const palabra = document.getElementById("palabra")
const botones=document.getElementById("botones")
const cuerpo=document.getElementById("contenedor")
const blanquear=document.getElementsByClassName("reset")
const past=document.getElementById("past")
const present=document.getElementById("present")
const perfect=document.getElementById("perfect")
const ul=document.getElementById("ul")
const seccion=document.getElementById("seccion")
const carta=document.getElementById("Carta-palabra")
const ocultar = document.getElementById("ocultar")
const mostrar=document.getElementById("mostrar")

let lista=[]
let presionado
let respuesta=""
let palabrita=""
let palabritas
let VerboEnUso=""
let urlSound

class palabras{
    constructor (presente,pasado,perfect,foto){
        this.present=presente
        this.pasado=pasado
        this.perfect=perfect
        this.foto=foto
    }
}

// insertarPalabra()

insertarVerbosConstructor()

function insertarVerbosConstructor(){

    // extraer JSON
    const xhttp = new XMLHttpRequest()
    xhttp.open("GET","verbos.json",true)
    xhttp.send()
    xhttp.onreadystatechange = function() {

        if(this.readyState == 4 && this.status == 200){

            // convertir a JSON
            let datos = JSON.parse(this.responseText)

            // insertar los verbos al contructor
            for(let verbos of datos){
                palabritas= new palabras(verbos.present,verbos.pasado,verbos.perfect)
                 lista.push(palabritas)
            }

        }
        
    }

}

function aleatoriedad(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

cuerpo.addEventListener("click",e=>{

    let target=e.target
    // console.log(target.className)
    if(target.className==="opciones"||target.className==="opciones-text reset"||target.id==="palabra"){
        verificarRespuesta(target.id)
    }

    if(target.id==="palabra"){
        generadorVerbos()
        traerMeaning(filtrarVerbos(VerboEnUso))
    }

    if(mostrar.checked&&target.id==="mostrar"){
        traerMeaning(filtrarVerbos(VerboEnUso),"meaning")
        seccion.style.display="inline-block"
        palabra.style.display="none"
        ul.style.display="inline"
    }else if(ocultar.checked){
        ul.innerHTML=""
        ul.style.display="none"
        seccion.innerHTML=""
        seccion.style.display="none"
        palabra.style.display="inline-block"
    }

})

document.addEventListener("keydown",e=>{
    
    if(e.keyCode===65){
        presionado=65 //A
         verificarRespuesta("past")
    }else if(e.keyCode===83){
        presionado=83 //S
         verificarRespuesta("present")
    }else if(e.keyCode===68){
        presionado=68 //D
         verificarRespuesta("perfect")
    }else if(e.keyCode===70){
        presionado=70 //F
        generadorVerbos()
        verificarRespuesta("palabra")
        traerMeaning(filtrarVerbos(VerboEnUso))
    }else if(e.keyCode===86){
        presionado=86 //V
        reproducirSonido(urlSound)
    }
    
})

document.addEventListener("keyup",e=>{
    
    presionado=""
    
})

function generadorVerbos(){
    
    let aleatorio= aleatoriedad(0, lista.length-1)
    let turno=aleatoriedad(1,3)
    let palabraEnUso= lista[aleatorio]
    
    if(palabraEnUso.present==palabraEnUso.pasado&&palabraEnUso.perfect==palabraEnUso.pasado){
        respuesta= "pasadoPresentefuturo"
        palabra.innerHTML=palabraEnUso.pasado
        VerboEnUso= palabraEnUso.pasado
        return VerboEnUso
    }else if(palabraEnUso.present==palabraEnUso.perfect){
        respuesta="presenteYperfecto"
        palabra.innerHTML=palabraEnUso.present
        VerboEnUso= palabraEnUso.present
        return VerboEnUso
    }else if(palabraEnUso.perfect==palabraEnUso.pasado){
        respuesta="perfectoYpasado"
        palabra.innerHTML=palabraEnUso.perfect
        VerboEnUso= palabraEnUso.perfect
        return VerboEnUso
    } else if(palabraEnUso.present==palabraEnUso.pasado){
        respuesta="presenteYpasado"
        palabra.innerHTML=palabraEnUso.present
    }else if(turno===1){
        respuesta="present"
        palabra.innerHTML=palabraEnUso.present
        VerboEnUso= palabraEnUso.present
        return VerboEnUso
    }else if(turno===2){
        respuesta="past"
        palabra.innerHTML=palabraEnUso.pasado
        VerboEnUso= palabraEnUso.pasado
        return VerboEnUso
    }else{
        respuesta="perfect"
        palabra.innerHTML=palabraEnUso.perfect
        VerboEnUso= palabraEnUso.perfect
        return VerboEnUso
    }
    
}

function verificarRespuesta(boton){

    const estilo = document.getElementById(`${boton}`)

    if( respuesta==="presenteYpasado"){
        past.style.color="#00ff00"
        present.style.color="#00ff00"
        perfect.style.color="red"
    }else if(respuesta==="presenteYperfecto"){
        past.style.color="red"
        present.style.color="#00ff00"
        perfect.style.color="#00ff00"
    }else if(respuesta==="perfectoYpasado"){
        past.style.color="#00ff00"
        present.style.color="red"
        perfect.style.color="#00ff00"
    } else if(respuesta==="pasadoPresentefuturo"){
        past.style.color="#00ff00"
        present.style.color="#00ff00"
        perfect.style.color="#00ff00"
    }else{
        estilo.style.color="red"
    }

    if (respuesta===boton) {
        estilo.style.color="#00ff00"
    }

    if(boton==="palabra"){
       for(i=0;i<blanquear.length;i++){
        blanquear[i].style.color="white"
       }
    }

}


function traerMeaning(definicion,QueMostrar){
    fetch(`${url}${definicion}`)
    .then((response)=>response.json())
    .then((data)=>{

        if(QueMostrar==="meaning"){
            return insertarMeaning(definicion,data)
        }
        return urlSound = `${data[0]. phonetics[0].audio}`
       
    })
}

function insertarMeaning(definisiones,datos){
    datos.forEach(element => {
        let forma=element.meanings[0].partOfSpeech
        ul.innerHTML+=`<li><label ><input type="radio" name="type-verb" value="${forma}">${forma}</label></li> `
    });

    seccion.innerHTML+=`
    <h1 >${definisiones}</h1><i class="fa-solid fa-play"></i>
    <span> ${datos[0].phonetic}></i></span>
    <p>${datos[0].meanings[0].definitions[0].definition}</p>
    <p>${datos[0].meanings[0].definitions[0].example || ""}</p>
    `
}

function reproducirSonido(url){
    let audio = new Audio(url)
   audio.play()
}

function filtrarVerbos(verb){
    let palabra=verb
    let almacenando=""
    let palabraFinal=[]
    for (i=0;i<palabra.length;i++){
        if(palabra.charAt(i)==="/"){
            palabraFinal.push(almacenando)
        }else{
            almacenando += palabra.charAt(i)
        }
    }
    if(palabraFinal.length > 0){
        return `${palabraFinal[0]}`
    }else{
        return palabra
    }
}
