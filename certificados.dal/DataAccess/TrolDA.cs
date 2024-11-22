using System.Data;
using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using Microsoft.EntityFrameworkCore;

namespace certificados.dal.DataAccess

{
    public class TrolDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public Response insertarRol(Trol tRol) {
            Response response = Utils.BadResponse(null);
            try
            {
                context.Trol.Add(tRol);
                context.SaveChanges();
                response = Utils.OkResponse(tRol);

            }
            catch (Exception ex) {

                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }
            return response;
        }

        public Response ModificarRol(Trol tRol)
        {
            Response response = Utils.BadResponse(null);
            try
            {
                var rolExistente = context.Trol.FirstOrDefault(t => t.IdRol == tRol.IdRol);

                if (rolExistente != null)
                {
                    rolExistente.Nombre = tRol.Nombre;
                    rolExistente.Observacion = tRol.Observacion;
                    rolExistente.Estado = tRol.Estado;
                    rolExistente.FModificacion = DateTime.Now;
                    rolExistente.UsuarioActualizacion = tRol.UsuarioActualizacion; 

                    context.SaveChanges();

                    response = Utils.OkResponse(rolExistente);
                }
                else
                {
                     response.Message = "ROL NO EXISTE";
                }
            }
            catch (Exception ex)
            {
                response.Message = "ERROR AL MODIFICAR ROL: " + ex.Message;
                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }
            return response;
        }


        public Response EliminarRol(Trol tRol)
        {
            Response response = Utils.BadResponse(null);

            try
            {
                var rolExistente = context.Trol.FirstOrDefault(t => t.IdRol == tRol.IdRol);

                if (rolExistente != null)
                {
                    context.Trol.Remove(rolExistente);
                    context.SaveChanges();
                    response = Utils.OkResponse(rolExistente);
                }
                else
                {
                    response = Utils.BadResponse("ROL NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR ROL: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }

            return response;
        }


        public Response ListarRol(){
            Response response = Utils.BadResponse(null);

            try
            {
                var listaRoles = context.Trol.ToList();
                if (listaRoles.Any())
                {
                    response = Utils.OkResponse(listaRoles);
                }
                else
                {
                    response = Utils.BadResponse("NO SE ENCONTRARON ROLES.");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"SE PRODUJO UN ERROR AL LISTAR LOS ROLES: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }

            return response;
        }

        public Response BuscarRol(int idRol)
        {
            Response response = Utils.BadResponse(null);

            try
            {
                var trol = context.Trol.FirstOrDefault(t => t.IdRol == idRol);

                if (trol != null)
                {
                    response = Utils.OkResponse(trol);
                }
                else
                {
                    response = Utils.BadResponse($"EL ROL CON ID {idRol} NO EXISTE.");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR ROL: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }

            return response;
        }
    }
}
