using certificados.dal.DataAccess;
using certificados.models.Entitys.dbo;
using certificados.models.Entitys;

namespace certificados.services.Services
{
    public class CicloService
    {
        private readonly TcicloDA cicloDA;

        public CicloService(TcicloDA cicloDA) { 
        
            this.cicloDA = cicloDA;
        }
        // Insertar Ciclo
        public ResponseApp InsertarCiclo(Tciclo ciclo)
        {
            return cicloDA.insertarCiclo(ciclo);
        }

        // Modificar Ciclo
        public ResponseApp ModificarCiclo(Tciclo ciclo)
        {
            return cicloDA.modificarCiclo(ciclo);
        }

        // Eliminar Ciclo
        public ResponseApp EliminarCiclo(int idCiclo)
        {
            return cicloDA.eliminarCiclo(idCiclo);
        }

        // Consultar Ciclo por ID
        public ResponseApp ConsultarCiclo(int idCiclo)
        {
            return cicloDA.consultarCicloById(idCiclo);
        }

        // Consultar Todas las Ciclos
        public ResponseApp ListarCiclos()
        {
            return cicloDA.listarCiclos();
        }
    }
}
