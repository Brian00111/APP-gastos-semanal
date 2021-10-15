

let formulario=document.querySelector('#agregar-gasto');
let nombreGastos=document.querySelector('#gasto');
let cantidadGastos=document.querySelector('#cantidad');
let listado=document.querySelector('#gastos ul');

let modal=document.querySelector('.modal');
    modal.style.display="block";

let cuenta; 
let cuentaInit;




class Presupuesto{

    
    constructor(gastos,cantidad){
        this.gastos=gastos;
        this.cantidad=cantidad;
    }

    verificarCant(){
        

        if(isNaN(this.cantidad) || Math.sign(this.cantidad) === -1){
            return UI.createError('NO PUEDES INGRESAR TEXTO EN LA CANTIDAD');

        }else{
            return this.restarPresupuesto();
        }
    }

    restarPresupuesto() {
        let restante=document.querySelector('.restante');

        cuenta -=this.cantidad;

        if(cuenta < cuentaInit / 2){
            restante.classList.remove('alert-success','alert-danger');
            restante.classList.add('alert-warning');

        }
        if(cuenta < 20){
            restante.classList.remove('alert-success','alert-warning');
            restante.classList.add('alert-danger');

        }

        restante.querySelector('span').textContent=cuenta;

        this.createList();
    }

    createList(){
        
      

        let nombreGastos=document.createElement('span');
            nombreGastos.setAttribute('class','fw-bolder');
            nombreGastos.textContent=this.gastos;

        let gastos=document.createElement('span');
            gastos.setAttribute('class', 'px-5');
            gastos.id=Date.now();
            gastos.textContent=`$${this.cantidad}`;

        let btnBorrar=document.createElement('button'); 
            btnBorrar.setAttribute('class','btn btn-danger btn-borrar');
            btnBorrar.addEventListener('click',UI.borrarGasto)
            btnBorrar.textContent="Borrar";

           // btnBorrar.onclick=borrarGasto();

        let li=document.createElement('li');
            li.setAttribute('class','list-group-item border p-11 d-flex justify-content-between align-items-center');
            li.appendChild(nombreGastos)
            li.appendChild(gastos)
            li.appendChild(btnBorrar)


        
        return listado.appendChild(li);
    }
}

class ui extends Presupuesto{
    constructor(error,gastos,cantidad){
        super(gastos, cantidad);
        this.error=error;
    }

    createError(error){
        let listado=document.querySelector('.secundario');

        let errores=document.createElement('p')
            errores.setAttribute('class','alert alert-danger')
            errores.setAttribute('role','alert')
            errores.textContent=error;

            listado.appendChild(errores)

        setTimeout(()=>listado.removeChild(errores),3000)

        return;        
    }

    borrarGasto(e){
        let restante=document.querySelector('.restante');
    
        let padre=e.target.parentNode;
        let cantidad=Number(padre.querySelector('span:nth-child(2)').textContent.substring(1));

        cuenta +=cantidad;

        if(cuenta < cuentaInit / 2){
            restante.classList.remove('alert-success','alert-danger');
            restante.classList.add('alert-warning');
        }
        else{
            restante.classList.remove('alert-danger','alert-warning');
            restante.classList.add('alert-success'); 
        }
        if(cuenta < 20){
            restante.classList.remove('alert-success','alert-warning');
            restante.classList.add('alert-danger');

        }

        restante.querySelector('span').textContent=cuenta;
    
        listado.removeChild(padre)
    
    }

}

let UI=new ui;

function agregarGastos(e){

    e.preventDefault();

    let agregarGastos=new Presupuesto(nombreGastos.value,cantidadGastos.value);
   
    if(nombreGastos.value === '' || cantidadGastos.value === ''){
        return UI.createError('TODOS LOS DATOS SON OBLIGATORIOS')
    }

    agregarGastos.verificarCant();
    formulario.reset();
}

function verificarPresu(e){
    e.preventDefault();

    let inputModal=modal.querySelector('#presu');

    if(e.target.id === 'save-modal'){
        e.stopPropagation();

        if(isNaN(inputModal.value)  
            || Math.sign(inputModal.value) === -1 
            || inputModal.value === '' 
            || inputModal.value <= 0)
            {
        
            let error=document.createElement('p');
                error.className('alert alert-danger mt-2');
                error.textContent='el presupuesto ingresado no es correcto';

            document.querySelector('.modal-body').appendChild(error);

            setTimeout(()=>{
                    
                document.querySelector('.modal-body').removeChild(document.querySelector('.modal-body').lastChild)
                inputModal.value="";
            
            },3000)
                
        }
        else{
            document.querySelector('#total').textContent=inputModal.value;
            document.querySelector('#restante').textContent=inputModal.value;

            modal.style.display='none';

            cuentaInit=Number(inputModal.value);
            cuenta=Number(inputModal.value);
        }
    };
        
}

formulario.addEventListener('submit',agregarGastos)
modal.addEventListener('click',verificarPresu)
