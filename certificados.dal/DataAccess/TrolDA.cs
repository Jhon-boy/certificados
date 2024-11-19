using System.Data;
using certificados.models.Context;
using certificados.models.Entitys.dbo;
using Microsoft.EntityFrameworkCore;

namespace certificados.dal.DataAccess
{
    public class TrolDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public void insertarRol(Trol tRol)
        {
            try
            {
                context.Trol.Add(tRol);
                context.SaveChanges();
            }
            catch (Exception ex) {
                throw new Exception($"ERROR AL INSERTAR ROL: {ex.Message}");
            }
        }

        public void modificarRol(Trol tRol)
        {
            try
            {
                // Buscamos la entidad que se quiere modificar en la base de datos
                var rolExistente = context.Trol.FirstOrDefault(t => t.IdRol == tRol.IdRol);
                if (rolExistente != null) {
                    rolExistente.Nombre = tRol.Nombre;
                    rolExistente.Observacion = tRol.Observacion;
                    rolExistente.Estado = tRol.Estado;
                    rolExistente.FModificacion = DateTime.Now; // Actualizamos la fecha de modificación
                    rolExistente.UsuarioActualizacion = tRol.UsuarioActualizacion; // Usuario que realiza la actualización

                    // Guardar los cambios en la base de datos
                    context.SaveChanges();
                }
                else
                {
                    throw new Exception(message: "ROL NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL MODIFICAR ROL: {ex.Message}");
            }
        }

        public void eliminarRol(Trol tRol)
        {
            try
            {
                // Buscamos la entidad que se quiere eliminar en la base de datos
                var rolExistente = context.Trol.FirstOrDefault(t => t.IdRol == tRol.IdRol);
                if (rolExistente != null)
                {
                    // Eliminar la entidad
                    context.Trol.Remove(rolExistente);

                    // Guardar los cambios en la base de datos
                    context.SaveChanges();
                }
                else {
                    throw new Exception(message: "ROL NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL ELIMINAR ROL: {ex.Message}");
            }
        }

        public List<Trol> listarRol()
        {
            try
            {
                {
                    // Obtener todos los roles de la base de datos
                    var listaRoles = context.Trol.ToList();

                    // Devolver la lista de roles
                    return listaRoles;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"SE PRODUJO UN ERROR: {ex.Message}");
            }
        }

        public Trol buscarRol(int idRol)
        {
            try
            {
                {
                    // Buscar el rol por su IdRol
                    var trol = context.Trol.FirstOrDefault(t => t.IdRol == idRol);

                    if (trol == null)
                    {
                        // Lanzar una excepción si no se encuentra el rol
                        throw new Exception($"EL ROL CON ID {idRol} NO EXISTE.");
                    }

                    return trol;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL BUSCAR ROL: {ex.Message}", ex);
            }
        }



    }
}
