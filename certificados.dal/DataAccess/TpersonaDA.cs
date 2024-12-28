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
    public class TpersonaDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;
        public ResponseApp InsertarPersona(Tpersona tpersona, Tusuario usuario)
        {
            ResponseApp response = Utils.BadResponse(null);
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    var usuarioExiste = context.Tusuario.FirstOrDefault(p => p.Email == usuario.Email);
                    if (usuarioExiste != null) {
                        return Utils.BadResponse("YA HAY UN USUARIO CON EL MAIL");
                    }

                    context.Tpersona.Add(tpersona);
                    context.Tusuario.Add(usuario);
                    context.SaveChanges();
                    transaction.Commit();

                    // Retornar respuesta exitosa con la persona creada
                    response = Utils.OkResponse(tpersona);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    response = Utils.BadResponse($"ERROR AL INSERTAR PERSONA: {ex.Message}");
                    throw new Exception($"ERROR AL INSERTAR PERSONA: {ex.Message}");
                }
            }

            return response;
        }

        public ResponseApp ModificarPersona(Tpersona tpersona, Tusuario usuario)
        {
            ResponseApp response = Utils.BadResponse(null);
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {

                    var personaExistente = context.Tpersona.FirstOrDefault(p => p.Cedula == tpersona.Cedula);
                    var usuarioExiste = context.Tusuario.FirstOrDefault(p => p.Cedula == tpersona.Cedula);
                    if (personaExistente != null && usuarioExiste != null)
                    {
                        // Actualizar los campos de la persona
                        personaExistente.Nombres = Utils.SafeString(tpersona.Nombres);
                        personaExistente.Apellidos = Utils.SafeString(tpersona.Apellidos);
                        personaExistente.Edad = tpersona.Edad;
                        personaExistente.Genero = tpersona.Genero;
                        personaExistente.FechaModificacion = Utils.timeParsed(DateTime.Now);
                        personaExistente.UsuarioActualizacion = tpersona.UsuarioActualizacion;

                        usuarioExiste.Email = usuario.Email;
                        usuarioExiste.Clave = usuario.Clave;
                        usuarioExiste.FModificacion = Utils.timeParsed(DateTime.Now);
                        usuarioExiste.UsuarioActualizacion = usuario.UsuarioActualizacion;
                        // Guardar los cambios
                        context.SaveChanges(); 
                        transaction.Commit();

                        // Retornar respuesta exitosa
                        response = Utils.OkResponse(personaExistente);
                    }
                    else
                    {
                        // Si la persona no existe
                        response = Utils.BadResponse("PERSONA NO EXISTE");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    response = Utils.BadResponse($"ERROR AL MODIFICAR PERSONA: {ex.Message}");
                    throw new Exception($"ERROR AL MODIFICAR PERSONA: {ex.Message}");
                }
            }

            return response;
        }

        public ResponseApp EliminarPersona(string cedula)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                // Buscar la persona existente
                var personaExistente = context.Tpersona.FirstOrDefault(p => p.Cedula == cedula);

                if (personaExistente != null)
                {
                    // Eliminar la persona
                    context.Tpersona.Remove(personaExistente);
                    context.SaveChanges();

                    // Retornar respuesta exitosa
                    response = Utils.OkResponse(personaExistente);
                }
                else
                {
                    // Si la persona no existe
                    response = Utils.BadResponse("PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL ELIMINAR PERSONA: {ex.Message}");
            }
            return response;
        }


        public ResponseApp ListarPersonas(string estado)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var listaPersonas = context.Tpersona
            .Select(persona => new
            {
                Cedula = persona.Cedula,
                Nombres = persona.Nombres,
                Apellidos = persona.Apellidos,
                Edad = persona.Edad,
                Genero = persona.Genero,
                FechaCreacion = persona.FechaCreacion,
                FechaModificacion = persona.FechaModificacion,
                UsuarioIngreso = persona.UsuarioIngreso,
                UsuarioActualizacion = persona.UsuarioActualizacion,
                mDatos = context.Tusuario
                    .Where(usuario => usuario.Cedula == persona.Cedula && usuario.Estado == estado)
                    .Select(usuario => new
                    {
                        Email = usuario.Email,
                        Rol = context.Trol
                            .Where(rol => rol.IdRol == usuario.IdRol)
                            .Select(rol => rol.Nombre)
                            .FirstOrDefault()
                    })
                    .FirstOrDefault()
            })
            .ToList();

                response = Utils.OkResponse(listaPersonas);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR PERSONAS: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR PERSONAS: {ex.Message}");
            }
            return response;
        }

        public ResponseApp BuscarPersona(string cedula)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                // Buscar la persona por su cédula
                var persona = context.Tpersona.FirstOrDefault(p => p.Cedula == cedula);

                if (persona != null)
                {
                    var personaCompleta = new
                    {
                        Cedula = persona.Cedula,
                        Nombres = persona.Nombres,
                        Apellidos = persona.Apellidos,
                        Edad = persona.Edad,
                        Genero = persona.Genero,
                        FechaCreacion = persona.FechaCreacion,
                        FechaModificacion = persona.FechaModificacion,
                        UsuarioIngreso = persona.UsuarioIngreso,
                        UsuarioActualizacion = persona.UsuarioActualizacion,
                        mDatos = context.Tusuario
                           .Where(u => u.Cedula == persona.Cedula)
                           .Select(usuario => new
                           {
                               Email = usuario.Email,
                               Rol = context.Trol
                                   .Where(rol => rol.IdRol == usuario.IdRol)
                                   .Select(rol => rol.Nombre)
                                   .FirstOrDefault()
                           })
                   .FirstOrDefault()
                    };

                    // Retornar respuesta exitosa
                    response = Utils.OkResponse(personaCompleta);
                }
                else
                {
                    // Si la persona no existe
                    response = Utils.BadResponse("PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR PERSONA: {ex.Message}");
            }
            return response;
        }

    }
}
