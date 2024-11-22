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
    public class TusuarioDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public Response InsertarUsuario(Tusuario tusuario)
        {

            Response response = Utils.BadResponse(null);
            try
            {
                context.Tusuario.Add(tusuario);
                context.SaveChanges();

                response = Utils.OkResponse(tusuario);
            }
            catch (Exception ex)
            {

                response = Utils.BadResponse($"ERROR AL INSERTAR USUARIO: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR USUARIO: {ex.Message}");
            }
            return response;
        }

        public Response ModificarUsuario(Tusuario tusuario)
        {
            Response response = Utils.BadResponse(null);
            try
            {
                var usuarioExistente = context.Tusuario.FirstOrDefault(u => u.idUsuario == tusuario.idUsuario);

                if (usuarioExistente != null)
                {
                    usuarioExistente.Email = tusuario.Email;
                    usuarioExistente.Clave = tusuario.Clave;
                    usuarioExistente.Cedula = tusuario.Cedula;
                    usuarioExistente.Estado = tusuario.Estado;
                    usuarioExistente.FModificacion = DateTime.Now;
                    usuarioExistente.UsuarioActualizacion = tusuario.UsuarioActualizacion;
                    usuarioExistente.IdRol = tusuario.IdRol;

                    context.SaveChanges();
                    response = Utils.OkResponse(usuarioExistente);
                }
                else
                {
                    response = Utils.BadResponse("USUARIO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL MODIFICAR USUARIO: {ex.Message}");
                throw new Exception($"ERROR AL MODIFICAR USUARIO: {ex.Message}");
            }
            return response;
        }

        public Response BuscarUsuario(int idUsuario) {

            Response response = Utils.BadResponse(null);
            try
            {
                // Buscar el usuario por su ID
                var usuario = context.Tusuario.FirstOrDefault(u => u.idUsuario == idUsuario);

                if (usuario != null)
                {
                    // Retornar respuesta exitosa
                    response = Utils.OkResponse(usuario);
                }
                else
                {
                    // Si el usuario no existe
                    response = Utils.BadResponse("USUARIO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR USUARIO: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR USUARIO: {ex.Message}");
            }
            return response;
        }
        public Response ListarUsuario() {
            Response response = Utils.BadResponse(null);
            try
            {
                var listarUsuarios =context.Tusuario.ToList();
                response = Utils.OkResponse(listarUsuarios);

            }
            catch (Exception ex) {
                response = Utils.BadResponse($"ERROR AL LISTAR USUARIOS: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR USUARIO: {ex.Message}");
            }
            return response;
        }
        public Response EliminarUsuario(int idUsuario) {
            Response response = Utils.BadResponse(null);
            try
            {
                var usuarioExistente = context.Tusuario.FirstOrDefault(u => u.idUsuario == idUsuario);

                if (usuarioExistente != null)
                {
                    context.Tusuario.Remove(usuarioExistente);
                    context.SaveChanges();
                    response = Utils.OkResponse(null);
                }
                else
                {
                    response = Utils.BadResponse("USUARIO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR USUARIO: {ex.Message}");
                throw new Exception($"ERROR AL ELIMINAR USUARIO: {ex.Message}");
            }
            return response;
        }
    }

}