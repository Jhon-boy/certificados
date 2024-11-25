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
    public class TexpositorDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public ResponseApp InsertarExpositor(Texpositor texpositor) {

            ResponseApp response = Utils.BadResponse(null);
            try
            {
                context.Texpositor.Add(texpositor);
                context.SaveChanges();
                response = Utils.OkResponse(texpositor);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL INSERTAR EXPOSITOR: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR expositor: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ModificarExpositor(Texpositor expositor)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            { 
                var expositorExistente = context.Texpositor.FirstOrDefault(e => e.IdExpositor == expositor.IdExpositor);

                if (expositorExistente != null)
                { 
                    expositorExistente.Cedula = expositor.Cedula;
                    expositorExistente.FModificacion = Utils.timeParsed(DateTime.Now);
                    expositorExistente.UsuarioActualizacion = expositor.UsuarioActualizacion;
                     
                    context.SaveChanges(); 
                    response = Utils.OkResponse(expositorExistente);
                }
                else
                { 
                    response = Utils.BadResponse("EXPOSITOR NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL MODIFICAR EXPOSITOR: {ex.Message}");
                throw new Exception($"ERROR AL MODIFICAR expositor: {ex.Message}");
            }
            return response;
        }

        public ResponseApp EliminarExpositor(int idExpositor)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            { 
                var expositorExistente = context.Texpositor.FirstOrDefault(e => e.IdExpositor == idExpositor);

                if (expositorExistente != null)
                { 
                    context.Texpositor.Remove(expositorExistente);
                    context.SaveChanges();
                     
                    response = Utils.OkResponse(expositorExistente);
                }
                else
                { 
                    response = Utils.BadResponse("EXPOSITOR NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR EXPOSITOR: {ex.Message}");
                throw new Exception($"ERROR AL ELIMINAR expositor: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ListarExpositores()
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            { 
                var listaExpositores = context.Texpositor.ToList();
                 
                response = Utils.OkResponse(listaExpositores);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR EXPOSITORES: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR expositor: {ex.Message}");
            }
            return response;
        }
        public ResponseApp BuscarExpositor(int idExpositor)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            { 
                var expositor = context.Texpositor.FirstOrDefault(e => e.IdExpositor == idExpositor);

                if (expositor != null)
                { 
                    response = Utils.OkResponse(expositor);
                }
                else
                { 
                    response = Utils.BadResponse("EXPOSITOR NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR EXPOSITOR: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR expositor: {ex.Message}");
            }
            return response;
        }

    }
}
