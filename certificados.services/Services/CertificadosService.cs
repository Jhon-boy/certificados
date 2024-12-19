using certificados.dal.DataAccess;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.services.Services
{
    public class CertificadosService
    {
        private readonly TcertificadoDA tcertificadoDA;
        private readonly TeventoDA eventoDA;

        public CertificadosService(TcertificadoDA tcertificadoDA, TeventoDA eventoDA)
        {
            this.tcertificadoDA = tcertificadoDA;
            this.eventoDA = eventoDA;
        }

        public ResponseApp ListarCertificados() {

            return tcertificadoDA.ListarCertificados();
      
        }

        public ResponseApp ListarCertificadosById(int idCertificado)
        {
            return tcertificadoDA.ListarCertificadosPorEvento(idCertificado);

        }

        public ResponseApp ObtenerCertificadosByEvento(int idCertificado)
        {


            return tcertificadoDA.BuscarCertificado(idCertificado);

        }

        public ResponseApp CrearCertificado(Tcertificado tcertificado)
        {

            ResponseApp response = Utils.Utils.BadResponse(null);
            if (!eventoDA.BuscarEvento(tcertificado.IdEvento).Cod.Equals(Utils.CONSTANTES.COD_OK))
            {

                response = Utils.Utils.BadResponse($"NO EXISTE EL EVENTO {tcertificado.IdEvento} ASOCIADO");
            }
            else {
                response=  tcertificadoDA.InsertarCertificado(tcertificado);
            }

            return response;

        }

        public ResponseApp ActualizarCertificado(Tcertificado tcertificado)
        {

            ResponseApp response = Utils.Utils.BadResponse(null);
            if (!eventoDA.BuscarEvento(tcertificado.IdCertificado).Cod.Equals(Utils.CONSTANTES.COD_OK))
            {

                response = Utils.Utils.BadResponse($"NO EXISTE EL EVENTO ASOCIADO");
            }
            else
            {
                response = tcertificadoDA.ModificarCertificado(tcertificado);
            }

            return response;
        }

        public ResponseApp ElminarCertificado(int idCertificado)
        {

            return tcertificadoDA.EliminarCertificado(idCertificado);

        }

    }
}
