using certificados.models.Context;
using certificados.models.Entitys.dbo;
using Microsoft.EntityFrameworkCore;

namespace certificados.dal.DataAccess
{
    public class TpersonaDA
    {
        private readonly AppDbContext _context;

        public TpersonaDA(AppDbContext context)
        {
            _context = context;
        }

        // Método para insertar una persona
        public void InsertarPersona(Tpersona tPersona)
        {
            try
            {
                tPersona.FechaCreacion = DateTime.Now;
                _context.Tpersona.Add(tPersona);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL INSERTAR PERSONA: {ex.Message}");
            }
        }

        // Método para modificar una persona
        public void ModificarPersona(Tpersona tPersona)
        {
            try
            {
                var personaExistente = _context.Tpersona.FirstOrDefault(p => p.Cedula == tPersona.Cedula);
                if (personaExistente != null)
                {
                    personaExistente.Nombres = tPersona.Nombres;
                    personaExistente.Apellidos = tPersona.Apellidos;
                    personaExistente.Edad = tPersona.Edad;
                    personaExistente.Genero = tPersona.Genero;
                    personaExistente.FechaModificacion = DateTime.Now;
                    personaExistente.UsuarioActualizacion = tPersona.UsuarioActualizacion;

                    _context.Update(personaExistente);
                    _context.SaveChanges();
                }
                else
                {
                    throw new Exception("PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL MODIFICAR PERSONA: {ex.Message}");
            }
        }

        // Método para eliminar una persona
        public void EliminarPersona(string cedula)
        {
            try
            {
                var personaExistente = _context.Tpersona.FirstOrDefault(p => p.Cedula == cedula);
                if (personaExistente != null)
                {
                    _context.Tpersona.Remove(personaExistente);
                    _context.SaveChanges();
                }
                else
                {
                    throw new Exception("PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL ELIMINAR PERSONA: {ex.Message}");
            }
        }

        // Método para listar todas las personas
        public List<Tpersona> ListarPersonas()
        {
            try
            {
                return _context.Tpersona.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL LISTAR PERSONAS: {ex.Message}");
            }
        }

        // Método para buscar una persona por su cédula
        public Tpersona BuscarPersona(string cedula)
        {
            try
            {
                var persona = _context.Tpersona.FirstOrDefault(p => p.Cedula == cedula);
                if (persona == null)
                {
                    throw new Exception($"LA PERSONA CON CÉDULA {cedula} NO EXISTE.");
                }

                return persona;
            }
            catch (Exception ex)
            {
                throw new Exception($"ERROR AL BUSCAR PERSONA: {ex.Message}");
            }
        }
    }
}
