using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TgrupoDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public Response InsertarGrupo(Tgrupo tgrupo) {

            Response response = Utils.BadResponse(null);

            try
            { 
                tgrupo.FCreacion = DateTime.Now;
                tgrupo.FModificacion = DateTime.Now; 
                context.Tgrupo.Add(tgrupo);
                context.SaveChanges();
                 
                response = Utils.OkResponse(tgrupo);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL INSERTAR GRUPO: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR GRUPO: {ex.Message}");
            }

            return response;
        }

        public Response ModificarGrupo(Tgrupo grupo)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var grupoExistente = context.Tgrupo.FirstOrDefault(g => g.IdGrupo == grupo.IdGrupo);

                if (grupoExistente != null)
                { 
                    grupoExistente.Nombre = grupo.Nombre;
                    grupoExistente.Cantidad = grupo.Cantidad;
                    grupoExistente.FModificacion = Utils.timeParsed(DateTime.Now);
                    grupoExistente.UsuarioActualizacion = grupo.UsuarioActualizacion;
                     
                    context.SaveChanges();
                     
                    response = Utils.OkResponse(grupoExistente);
                }
                else
                { 
                    response = Utils.BadResponse("GRUPO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL MODIFICAR GRUPO: {ex.Message}");
                throw new Exception($"ERROR AL MODIFICAR GRUPO: {ex.Message}");
            }
            return response;
        }

        public Response EliminarGrupo(int idGrupo)
        {
            Response response = Utils.BadResponse(null);
            try
            {
                // Buscar el grupo existente por su ID
                var grupoExistente = context.Tgrupo.FirstOrDefault(g => g.IdGrupo == idGrupo);

                if (grupoExistente != null)
                {
                    // Eliminar el grupo
                    context.Tgrupo.Remove(grupoExistente);
                    context.SaveChanges();

                    // Retornar respuesta exitosa
                    response = Utils.OkResponse(grupoExistente);
                }
                else
                {
                    // Si el grupo no existe
                    response = Utils.BadResponse("GRUPO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR GRUPO: {ex.Message}");
                throw new Exception($"ERROR AL ELIMINAR GRUPO: {ex.Message}");
            }
            return response;
        }

        public Response ListarGrupos()
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var listaGrupos = context.Tgrupo.ToList(); 
                response = Utils.OkResponse(listaGrupos);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR GRUPOS: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR GRUPO: {ex.Message}");
            }
            return response;
        }

        public Response BuscarGrupo(int idGrupo)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var grupo = context.Tgrupo.FirstOrDefault(g => g.IdGrupo == idGrupo);

                if (grupo != null)
                { 
                    response = Utils.OkResponse(grupo);
                }
                else
                { 
                    response = Utils.BadResponse("GRUPO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR GRUPO: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR GRUPO: {ex.Message}");
            }
            return response;
        }

    }
}
