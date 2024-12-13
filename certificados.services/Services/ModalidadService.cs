using certificados.dal.DataAccess;
using certificados.models.Entitys.dbo;
using certificados.models.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.services.Services
{
    public class ModalidadService
    {
        private readonly TmodalidadDA tmodalidadDA;

        public ModalidadService(TmodalidadDA modalidadDA) { 
        
            this.tmodalidadDA = modalidadDA;
        }
        // Insertar Modalidad
        public ResponseApp InsertarModalidad(Tmodalidad modalidad)
        {
            return tmodalidadDA.InsertarModalidad(modalidad);
        }

        // Modificar Modalidad
        public ResponseApp ModificarModalidad(Tmodalidad modalidad)
        {
            return tmodalidadDA.ModificarModalidad(modalidad);
        }

        // Eliminar Modalidad
        public ResponseApp EliminarModalidad(int idModalidad)
        {
            return tmodalidadDA.EliminarModalidad(idModalidad);
        }

        // Consultar Modalidad por ID
        public ResponseApp ConsultarModalidad(int idModalidad)
        {
            return tmodalidadDA.ConsultarModalidadById(idModalidad);
        }

        // Consultar Todas las Modalidades
        public ResponseApp ListarModalidades()
        {
            return tmodalidadDA.ListarModalidades();
        }
    }
}
