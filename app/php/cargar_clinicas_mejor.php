<?php
header('Access-Control-Allow-Origin: *');
/*
 * DataTables example server-side processing script.
 *
 * Please note that this script is intentionally extremely simply to show how
 * server-side processing can be implemented, and probably shouldn't be used as
 * the basis for a large complex system. It is suitable for simple use cases as
 * for learning.
 *
 * See http://datatables.net/usage/server-side for full details on the server-
 * side processing requirements of DataTables.
 *
 * @license MIT - http://datatables.net/license_mit
 */
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */
 
// DB table to use
$table = 'clinicas';
 
// Table's primary key
$primaryKey = 'id_clinica';
 
// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
    array( 'db' => 'id_clinica', 'dt' => 'idClinica' ),
    array( 'db' => 'nombre',  'dt' => 'nombre' ),
    array( 'db' => 'razonsocial',   'dt' => 'razonSocial' ),
    array( 'db' => 'cif',     'dt' => 'cif' ),
    array( 'db' => 'localidad', 'dt' => 'localidad' ),
    array( 'db' => 'provincia',  'dt' => 'provincia' ),
    array( 'db' => 'direccion',   'dt' => 'direccion' ),
    array( 'db' => 'numclinica',     'dt' => 'numClinica' ),
    array( 'db' => 'id_tarifa',     'dt' => 'idTarifa' )
);
 
// SQL server connection information
$sql_details = array(
    'user' => 'alexventura_root',
    'pass' => 'Vo0olare.',
    'db'   => 'alexventura_datatables',
    'host' => 'localhost'
);
 
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */
 
require( 'ssp.class.php' );
 
echo json_encode(
    SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
);
