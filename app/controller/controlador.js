// llamada previa carga de la pagina
window.addEventListener("load", loadDada);
HOST = window.location.host;
//console.log(HOST); 
function loadDada() {

    $.get("http://" + HOST + "/odata/v4/sybven/producto", (data, status) => {
        //console.log(data); 
        console.log("paso 1"); 
        cargarDataPoductos(data);
    });

}

function filtrosProductosGet(value,busq) {
    console.log("paso 2"); 
    console.log("value "+value); 
    console.log("busq "+busq); 


    switch (value ? value : "") {
        case "Cantidad":
            console.log("paso 3"); 
            $.get("http://" + HOST + "/odata/v4/sybven/producto?$orderby=cantidad", callbakc);
            break;
            case "Busqueda":
                //$.get("http://" + HOST + "/odata/v4/sybven/producto?$filter=categoria eq"+busq.trim(), callbakc);
                if( busq === "otros"){
                    $.get("http://" + HOST + "/odata/v4/sybven/producto?$filter=categoria eq 'otros'", callbakc);
                } else if ( busq === "Limpieza") {
                    $.get("http://" + HOST + "/odata/v4/sybven/producto?$filter=categoria eq 'Limpieza'", callbakc);
                }else if (busq === "Herramienta"){
                    $.get("http://" + HOST + "/odata/v4/sybven/producto?$filter=categoria eq 'Herramienta'", callbakc);
                }else if ( busq === "Cocina"){
                    $.get("http://" + HOST + "/odata/v4/sybven/producto?$filter=categoria eq 'Cocina'", callbakc);
                }else if ( busq === "Tegnologia"){

                    $.get("http://" + HOST + "/odata/v4/sybven/producto?$filter=categoria eq 'Tegnologia'", callbakc);
                }else {
                    $.get("http://" + HOST + "/odata/v4/sybven/producto", callbakc);
                }
                    

                break;
        default:
            $.get("http://" + HOST + "/odata/v4/sybven/producto", callbakc);
            break;
    }


}

function callbakc(data, status) {
    // console.log(data); 
    console.log("paso 4"); 
    cargarDataPoductos(data);
}

function setSelection(aux, inten) {
    console.log("paso 5"+inten); 
    switch (inten) {
        case "Edit":
            console.log("paso 6"); 
            document.getElementById("TitleModal").innerHTML = "Editar Producto";
            document.getElementById("btnTitleModal").innerHTML = "Guardar Producto";
            document.getElementById("btnTitleModal").onclick=editarProducto;
            $.get("http://" + HOST + "/odata/v4/sybven/producto/" + aux.trim(), (data, status) => {
                //console.log(data); 
                setDataModal(data);
            });
            break;
            

        default:
            //Crear
            document.getElementById("TitleModal").innerHTML = "Agregar Producto";
            document.getElementById("btnTitleModal").innerHTML = "Agregar";
            document.getElementById("btnTitleModal").onclick=AgregarProducto;
            console.log("crear");
            break;
    }

}

function setDataModal(d) {
    console.log("paso 7"); 
    var productoinput = document.getElementById("Nombre");
    var nombreinput = document.getElementById("Descripcion");
    var apellidoinput = document.getElementById("Categoria");
    var gradoSelec = document.getElementById("Precio");
    var seccionSelec = document.getElementById("Cantidad");
    var idAlumno = document.getElementById("idAlumno");
    productoinput.value = d.nombre;
    nombreinput.value = d.descripcion;
    apellidoinput.value = d.categoria;
    gradoSelec.value = d.precio;
    seccionSelec.value = d.cantidad;
    idAlumno.value = d.ID;

}

function editarProducto() {
    console.log("paso 8"); 
    //console.log("Editar Alumno");
    var Nombre = document.getElementById("Nombre").value;
    var Descripcion = document.getElementById("Descripcion").value;
    var Categoria = document.getElementById("Categoria").value;
    var Precio = document.getElementById("Precio").value;
    var Cantidad = document.getElementById("Cantidad").value;
    var idAlumno = document.getElementById("idAlumno").value;

    console.log(Nombre);
    console.log(Descripcion); 
    console.log(Categoria); 
    console.log(Precio); 
    console.log(Cantidad); 
    console.log(idAlumno); 

    var obj = {
        "ID": idAlumno,
        "nombre": Nombre,
        "descripcion": Descripcion,
        "categoria": Categoria,
        "precio": parseInt(Precio),
        "cantidad": parseInt(Cantidad)
    }

    RequestJSON("PUT",obj, function (res) {
        console.log("paso 9"); 
         console.log("Success 2:", res);
        loadDada();
        document.getElementById("cerrarModal").click();
    })
  
}

async function RequestJSON(method, data, callback) {
    console.log("paso 10"); 
    var endPoint = "";
    switch (method) {
        case "DELETE":
        case "PUT":
            console.log("paso 20"); 
            endPoint = "http://" + HOST + "/odata/v4/sybven/producto/" + data.ID.trim();
            break;

        default:
            endPoint = "http://" + HOST + "/odata/v4/sybven/producto"
            break;
    }
    try {
        console.log("paso 21"); 
        const response = await fetch(endPoint, {
            method: method, // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        // console.log("Success:", result);
        callback(result);
    } catch (error) {
        console.log("paso 22"); 
        console.error("Error:", error);
        callback({ "Error": "Falla de servicio" });
    }
}

function deleteConfirm(id,method,Nombre){
    console.log("ID "+id);
    msg="Estas seguro de Eliminar el Producto  "+Nombre;
    if(confirm(msg)==true){
        
        RequestJSON(method,{"ID":id},function (res) {
            alert("Producto eliminado con exito");
            loadDada();
        });
    }
}

function AgregarProducto() {
    console.log("Agregar");
    var Nombre = document.getElementById("Nombre").value;
    var Descripcion = document.getElementById("Descripcion").value;
    var Categoria = document.getElementById("Categoria").value;
    var Precio = document.getElementById("Precio").value;
    var Cantidad = document.getElementById("Cantidad").value;
    var obj = {
        "nombre": Nombre,
        "descripcion": Descripcion,
        "categoria": Categoria,
        "precio": parseInt(Precio),
        "cantidad": parseInt(Cantidad)
    }

    RequestJSON("POST",obj, function (res) {
         console.log("Success 2:", res);
        loadDada();
        document.getElementById("cerrarModal").click();
    })
  
}


function cargarDataPoductos(data) {
    var item = ' <tr>' +
        '<td>{{Nombre}}</td>' +
        '<td>{{Descripcion}}</td>' +
        '<td>{{Categoria}}</td>' +
        '<td>{{Precio}}</td>' +
        '<td>{{Cantidad}}</td>' +
        '<td>' +        
        '<a href="#" class="edit" title="Edit" data-toggle="modal" data-target="#exampleModal"><i class="bi bi-pen" onclick="setSelection(\'{{ID}}\',\'Edit\')"></i></a>' +
        '<a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="bi bi-trash3" onclick="deleteConfirm(\'{{ID}}\',\'DELETE\',\'{{Nombre}}\')"></i></a>' +
        '</td>' +
        '</tr>';
    var objArray = [];

    data.value.forEach(element => {
        let aux = item;
        aux = aux.replaceAll("{{ID}}", element.ID);
        aux = aux.replaceAll("{{Nombre}}", element.nombre);
        aux = aux.replaceAll("{{Descripcion}}", element.descripcion);
        aux = aux.replaceAll("{{Categoria}}", element.categoria);
        aux = aux.replace("{{Precio}}", element.precio);
        aux = aux.replace("{{Cantidad}}", element.cantidad);
        objArray.push(aux);
        console.log(element);
    });
    document.getElementById("dataAlumnos").innerHTML = objArray.join("");






}