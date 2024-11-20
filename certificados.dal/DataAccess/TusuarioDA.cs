using certificados.models.Context;
using certificados.models.Entitys.dbo;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TusuarioDA
    {
        private readonly AppDbContext _context;

        public TusuarioDA(AppDbContext context)
        {
            _context = context;
        }
        //Da para insertar usuario
        public void InsertarUsuario(Tusuario tusuario)
        {
            try
            {
                _context.Tusuario.Add(tusuario);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {

                throw new Exception($"ERROR AL INSERTAR USUARIO: {ex.Message}");
            }
        }
        //DA para Modificar un usuario...
        public void ModificarUsuario(Tusuario tusuario)
        {
            try
            {
                var usuarioExistente = _context.Tusuario.FirstOrDefault(u => u.idUsuario == tusuario.idUsuario);

                if (usuarioExistente != null)
                {
                    usuarioExistente.Email = tusuario.Email;
                    usuarioExistente.Clave = tusuario.Clave;
                    usuarioExistente.Cedula = tusuario.Cedula;
                    usuarioExistente.Estado = tusuario.Estado;
                    usuarioExistente.FModificacion = DateTime.Now; // Actualizamos la fecha de modificación
                    usuarioExistente.UsuarioActualizacion = tusuario.UsuarioActualizacion;
                    usuarioExistente.IdRol = tusuario.IdRol;

                    _context.SaveChanges();
                }
                else
                {
                    throw new Exception("USUARIO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL MODIFICAR USUARIO: {ex.Message}");
            }
        }
        //Da para eliminar un usuario by ID 
        public void EliminarUsuario(int idUsuario)
        {
            try
            {
                var usuarioExistente = _context.Tusuario.FirstOrDefault(u => u.idUsuario == idUsuario);

                if (usuarioExistente != null)
                {
                    _context.Tusuario.Remove(usuarioExistente);
                    _context.SaveChanges();
                }
                else
                {
                    throw new Exception("USUARIO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL ELIMINAR USUARIO: {ex.Message}");
            }
        }

        //DA para listar USUARIOS dela APP 
        public List<Tusuario> ListarUsuarios()
        {
            try
            {
                return _context.Tusuario
                               .Include(u => u.Tpersona) // Incluimos las relaciones con Tpersona
                               .Include(u => u.Trol)     // Incluimos las relaciones con Trol
                               .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL LISTAR USUARIOS: {ex.Message}");
            }
        }

        //Buscar un usuarios solo por su ID
        public Tusuario BuscarUsuario(int idUsuario)
        {
            try
            {
                var usuario = _context.Tusuario
                                      .Include(u => u.Tpersona) // Incluimos las relaciones con Tpersona
                                      .Include(u => u.Trol)     // Incluimos las relaciones con Trol
                                      .FirstOrDefault(u => u.idUsuario == idUsuario);

                if (usuario == null)
                {
                    throw new Exception($"EL USUARIO CON ID {idUsuario} NO EXISTE.");
                }

                return usuario;
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL BUSCAR USUARIO: {ex.Message}", ex);
            }
        }
    }
}
