using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TestadoDocenteda(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public ResponseApp InsertarEstadoDocente(TestadoDocente testado) {

            ResponseApp response = Utils.BadResponse(null);

            try
            {
                context.TestadoDocente.Add(testado);
                context.SaveChanges();

                response = Utils.OkResponse(response);
            }
            catch (Exception ex) {
                throw new Exception($"ERROR AL INSERTAR ESTADO DOCENTE: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ModificarEstadoDocente(TestadoDocente testado) {

            ResponseApp response = Utils.BadResponse(null);

            try
            {
                var estadoDocente = context.TestadoDocente.FirstOrDefault(d => d.IdEstado == testado.IdEstado);

                if (estadoDocente != null)
                {

                    estadoDocente.Nombre = testado.Nombre;
                    context.SaveChanges();
                    response = Utils.OkResponse(response);
                }
                else {
                    response = Utils.BadResponse("ESTADO DOCENTE NO EXISTE");
                }
               
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse(" ESTADO DOCENTE NO EXISTE");
                throw new Exception($"ERROR AL BUSCAR ESTADO DOCENTE: {ex.Message}");
            }
            return response;
        }

        public ResponseApp EliminarEstadoDocente(int idDocente) {
            ResponseApp response = Utils.BadResponse(null);

            try
            {
                var estadoDocente = context.TestadoDocente.FirstOrDefault(d => d.IdEstado == idDocente);
                if (estadoDocente != null)
                {

                    context.TestadoDocente.Remove(estadoDocente);
                    context.SaveChanges();
                    response = Utils.OkResponse(response);
                }
                else {
                    response.Message = "NO EXISTE ESTADO DOCENTE";
                }
            }
            catch (Exception ex) {
                response = Utils.BadResponse($"ERROR AL ELIMINAR DOCENTE: {ex.Message}");
                throw new Exception($"ERROR AL ELIMINAR ESTADOCENTE : {ex.Message}");
            }
            return response;

        }

        public ResponseApp ListarEstados() {
            ResponseApp response = Utils.BadResponse(null);

            try
            {
                    var listado = context.TestadoDocente.ToList();
                    response = Utils.OkResponse(response);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR DOCENTE: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR ESTADOCENTE: {ex.Message}");
            }
            return response;
        }

    }
}
