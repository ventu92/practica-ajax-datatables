   'use strict';

$.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z\s\ñ\Ñ]+$/i.test(value);
}, "Solo letras por favor");


var idDoctor;


   $(document).ready(function() {
 
       var miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'php/cargar_vclinicas_mejor.php',
           'language': {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           },
           'columns': [{
               'data': 'nombre'
           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'nombreClinica',
                'render': function(data) {
                   return '<li>' + data + '</li><br>';
               }
           }, {
               'data': 'idClinica',
           }, {
               'data': 'idDoctor',
               /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
               botón de edición o borrado*/
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_clinica.php?id_doctor=' + data + '>Editar</a><a data-toggle="modal" data-target="#basicModal"  class="btn btn-warning borrarbtn" >Borrar</a>';
               }
           }]
       });


       /*Creamos la función que muestre el formulario cuando hagamos click*/
       /*ojo, es necesario hacerlo con el método ON. Tanto por rendimiento como porque puede haber elementos (botones) que todavía no existan en el document.ready*/
       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();

           $('#tabla').fadeOut(100);
           $('#formulario').fadeIn(100);

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#idDoctor').val(aData.idDoctor);
           $('#nombre').val(aData.nombre);
           $('#numcolegiado').val(aData.numcolegiado);
           $('#clinicas').val(aData.nombreClinica);
          // var prueba=$('#idClinica').val(aData.idDoctor);
           cargarTarifas();
           
          // alert(aData.idClinica);
          //selecciono las que estaban
          var str = aData.idClinica;

          str = str.split(",");

          //cargo el select con las que ya estaban
          $('#clinicas').val(str);
             
       });


       $('#miTabla').on('click', '.borrarbtn', function(e) {
           //e.preventDefault();
                    var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           idDoctor = aData.idDoctor;

       });

       $('#basicModal').on('click','#confBorrar',function(e){
           $.ajax({
               /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
               type: 'POST',
               dataType: 'json',
               url: 'php/borrar_doctor.php',
               //estos son los datos que queremos actualizar, en json:
               data: {
                   id_doctor: idDoctor
               },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error

                $.growl({
                  
                  icon: "glyphicon glyphicon-remove",
                  message: "Error al borrar!"

                },{
                  type: "danger"
                });
               },
               success: function(data) {
               // alert("borrado ok");
                   //obtenemos el mensaje del servidor, es un array!!!
                   //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                   //actualizamos datatables:
                   /*para volver a pedir vía ajax los datos de la tabla*/
                   var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
                  $mitabla.fnDraw();
                 //  $('#edicionok').html("Borrado correcto!").slideDown(2000).slideUp(2000);
                $.growl({
                  
                  icon: "glyphicon glyphicon-remove",
                  message: "Borrado realizado con exito!"

                },{
                  type: "success"
                });
               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
        $('#tabla').fadeIn(100);
       });

           $('#formEditar').validate({
                        
                        rules: {
                             nombre: {
                                required: true,
                                lettersonly: true 
                               },
                        numcolegiado: {
                            required: true,
                                digits: true
                        },
                        clinicas:{
                          required:true
                        }
                        },
        submitHandler: function() {

          idDoctor = $('#idDoctor').val();
           nombre = $('#nombre').val();
           numcolegiado = $('#numcolegiado').val();
           id_clinica = $('#clinicas').val();

           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/modificar_clinica.php',
               //lo más cómodo sería mandar los datos mediante 
               //var data = $( "form" ).serialize();
               //pero como el php tiene otros nombres de variables, lo dejo así
               //estos son los datos que queremos actualizar, en json:
               data: {
                   idDoctor: idDoctor,
                   nombre: nombre,
                   numcolegiado: numcolegiado,
                   id_clinica:id_clinica
                   
               },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error

                    $.growl({
                  
                  icon: "glyphicon glyphicon-remove",
                  message: "Error al editar!"

                },{
                  type: "danger"
                });

               },
               success: function(data) {
                  var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
                  $mitabla.fnDraw();
               
                 if(data[0].estado==0){

                 $.growl({
                  
                  icon: "glyphicon glyphicon-ok",
                  message: "Doctor editado correctamente!"

                },{
                  type: "success"
                });
               }else{

                 $.growl({
                  
                  icon: "glyphicon glyphicon-remove",
                  message: "Error al editar el doctor!"

                },{
                  type: "danger"
                });
               }

               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax

               }
           });

           $('#tabla').fadeIn(100);
           $('#formulario').fadeOut(100);
            //$("#edicion").fadeOut(100);

        }
                       
   });

           $('#formCrear').validate({
                        
                        rules: {
                             nombreNuevo: {
                                required: true,
                                lettersonly: true 
                               },
                        numcolegiadoNuevo: {
                            required: true,
                                digits: true
                        },
                        clinicas2:{
                          required:true
                        }
                        },
        submitHandler: function() {
          nombreNuevo = $('#nombreNuevo').val();
          numcolegiadoNuevo = $('#numcolegiadoNuevo').val();
          clinicas2 = $('#clinicas2').val();



           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/crear_doctor.php',

               data: {
                   nombreNuevo: nombreNuevo,
                   numcolegiadoNuevo: numcolegiadoNuevo,
                   clinicas2: clinicas2
                   
               },

               
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
                    

                    $.growl({
                  
                  icon: "glyphicon glyphicon-remove",
                  message: "Error al añadir el doctor!"

                },{
                  type: "danger"
                });

               },
               success: function(data) {
                  var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
                  $mitabla.fnDraw();
                /*muestro growl*/
                if(data[0].estado==0){

                 $.growl({
                  
                  icon: "glyphicon glyphicon-ok",
                  message: "Doctor añadido correctamente!"

                },{
                  type: "success"
                });
               }else{

                 $.growl({
                  
                  icon: "glyphicon glyphicon-remove",
                  message: "Error al añadir el doctor!"

                },{
                  type: "danger"
                });
               }

               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax

               }
           });
          $('#formularioCrear').fadeOut(100);
          $('#tabla').fadeIn(100);
       
        }
                       
   });
   /*boton añadir doctor,oculto tabla para mostrar form*/
   $('#creaDoc').click(function(e) {
           e.preventDefault();

           //oculto tabla muestro form
          $('#tabla').fadeOut(100);
          $('#formularioCrear').fadeIn(100);
          cargarClinicaCrear();

       });


 /*Cargamos los datos para las tarifas:*/
       function cargarClinicaCrear() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_tarifas.php',
               async: false,
               //estos son los datos que queremos actualizar, en json:
               // {parametro1: valor1, parametro2, valor2, ….}
               //data: { id_clinica: id_clinica, nombre: nombre, ….,  id_tarifa: id_tarifa },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
              
               },
               success: function(data) {
                   $('#clinicas2').empty();
                   $.each(data, function() {
                       $('#clinicas2').append(
                           $('<option ></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });

               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
       }


       /*Cargamos los datos para las tarifas:*/
       function cargarTarifas() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_tarifas.php',
               async: false,
               //estos son los datos que queremos actualizar, en json:
               // {parametro1: valor1, parametro2, valor2, ….}
               //data: { id_clinica: id_clinica, nombre: nombre, ….,  id_tarifa: id_tarifa },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
              
               },
               success: function(data) {
                   $('#clinicas').empty();
                   $.each(data, function() {
                       $('#clinicas').append(
                           $('<option ></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });

               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
       }   
       
   });
