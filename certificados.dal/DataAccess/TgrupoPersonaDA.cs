using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TgrupoPersonaDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public Response InsertarGrupoPersona(TgrupoPersona tgrupoPersona) {


            Response response = Utils.BadResponse(null);

            try
            { 
                tgrupoPersona.FCreacion = DateTime.Now;
                tgrupoPersona.FModificacion = DateTime.Now;
                 
                context.TgrupoPersona.Add(tgrupoPersona);
                context.SaveChanges(); 
                response = Utils.OkResponse(tgrupoPersona);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL INSERTAR GRUPO-PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR GRUPO - PERSONA: {ex.Message}");
            }

            return response;
        
        }

        public Response ModificarGrupoPersona(TgrupoPersona grupoPersona)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var grupoPersonaExistente = context.TgrupoPersona.FirstOrDefault(gp => gp.IdGrupoPersona == grupoPersona.IdGrupoPersona);

                if (grupoPersonaExistente != null)
                { 
                    grupoPersonaExistente.IdGrupo = grupoPersona.IdGrupo;
                    grupoPersonaExistente.Cedula = grupoPersona.Cedula;
                    grupoPersonaExistente.Estado = grupoPersona.Estado;
                    grupoPersonaExistente.FModificacion = DateTime.Now;
                    grupoPersonaExistente.UsuarioActualizacion = grupoPersona.UsuarioActualizacion;
                     
                    context.SaveChanges();
                     
                    response = Utils.OkResponse(grupoPersonaExistente);
                }
                else
                { 
                    response = Utils.BadResponse("RELACIÓN GRUPO-PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL MODIFICAR GRUPO-PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL MODIFICAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }

        public Response EliminarGrupoPersona(int idGrupoPersona)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var grupoPersonaExistente = context.TgrupoPersona.FirstOrDefault(gp => gp.IdGrupoPersona == idGrupoPersona);

                if (grupoPersonaExistente != null)
                { 
                    context.TgrupoPersona.Remove(grupoPersonaExistente);
                    context.SaveChanges(); 
                    response = Utils.OkResponse(grupoPersonaExistente);
                }
                else
                { 
                    response = Utils.BadResponse("RELACIÓN GRUPO-PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR GRUPO-PERSONA: {ex.Message}");

                throw new Exception($"ERROR AL ELIMINAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }

        public Response ListarGrupoPersonas()
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var listaGrupoPersonas = context.TgrupoPersona
                    .Include(gp => gp.Tgrupo)
                    .Include(gp => gp.Tpersona)
                    .ToList();
                 
                response = Utils.OkResponse(listaGrupoPersonas);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR GRUPO-PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }

        public Response BuscarGrupoPersona(int idGrupoPersona)
        {
            Response response = Utils.BadResponse(null);
            try
            {
                // Buscar la relación por su ID
                var grupoPersona = context.TgrupoPersona
                    .Include(gp => gp.Tgrupo)
                    .Include(gp => gp.Tpersona)
                    .FirstOrDefault(gp => gp.IdGrupoPersona == idGrupoPersona);

                if (grupoPersona != null)
                { 
                    response = Utils.OkResponse(grupoPersona);
                }
                else
                { 
                    response = Utils.BadResponse("RELACIÓN GRUPO-PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR GRUPO-PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }


    }
}
