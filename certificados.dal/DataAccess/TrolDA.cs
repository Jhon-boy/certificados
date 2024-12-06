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

        public ResponseApp insertarRol(Trol tRol) {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                Trol insertRol = new Trol();
                insertRol.Nombre = Utils.SafeString(tRol.Nombre);
                insertRol.Observacion = Utils.SafeString(tRol.Observacion);
                insertRol.FCreacion = Utils.timeParsed(DateTime.Now);
                insertRol.UsuarioIngreso = Utils.SafeString(tRol.UsuarioIngreso);
                insertRol.Estado = tRol.Estado;
                context.Trol.Add(tRol);
                context.SaveChanges();
                response = Utils.OkResponse(tRol);

            }
            catch (Exception ex) {
                response.Message = $"PROBLEMAS AL INSERTAR ROL: {ex.Message}";

                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ModificarRol(Trol tRol)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var rolExistente = context.Trol.FirstOrDefault(t => t.IdRol == tRol.IdRol);

                if (rolExistente != null)
                {
                    rolExistente.Nombre = Utils.SafeString(tRol.Nombre);
                    rolExistente.Observacion = tRol.Observacion;
                    rolExistente.Estado = tRol.Estado;
                    rolExistente.FModificacion = Utils.timeParsed(DateTime.Now);
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


        public ResponseApp EliminarRol(int idRol)
        {
            ResponseApp response = Utils.BadResponse(null);

            try
            {
                var rolExistente = context.Trol.FirstOrDefault(t => t.IdRol == idRol);

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


        public ResponseApp ListarRol(){
            ResponseApp response = Utils.BadResponse(null);

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

        public ResponseApp BuscarRol(int idRol)
        {
            ResponseApp response = Utils.BadResponse(null);

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
        public ResponseApp BuscarRolByNombre(string nombreRol)
        {
            ResponseApp response = Utils.BadResponse(null);

            try
            {
                var trol = context.Trol.FirstOrDefault(t => t.Nombre == nombreRol);

                if (trol != null)
                {
                    response = Utils.OkResponse(trol);
                }
                else
                {
                    response = Utils.BadResponse($"EL ROL CON ID {nombreRol} NO EXISTE.");
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
