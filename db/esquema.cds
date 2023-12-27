using { Currency,managed,sap,cuid} from '@sap/cds/common';


namespace my.ejemplo;
entity  Productos : cuid,managed {

    nombre : String(255);
    descripcion : String(255);
    categoria : String(255);
    precio : Integer;
    cantidad: Integer;
}