using certificados.models.Entitys.dbo;
using certificados.services.Utils;

namespace certificados.web.Controllers.Mappers
{
    public class DocenteMapper
    {
        public static Tdocente toEntityCreate(Tdocente tdocente, TestadoDocente testadoDocente, Tpersona tpersona) {
            return new Tdocente {
            
                CodigoDocente = tdocente.CodigoDocente,
                Cedula = tdocente.Cedula,
                Titulo = Utils.SafeString(tdocente.Titulo),
                Facultad = Utils.SafeString(tdocente.Facultad),
                Carrera = tdocente.Carrera,
                FCreacion = Utils.timeParsed(DateTime.Now),
                FModificacion = Utils.timeParsed(DateTime.Now),
                UsuarioIngreso =  tdocente.UsuarioIngreso,
                IdEstado = tdocente.IdEstado,
                Tpersona = tpersona,
                TestadoDocente = testadoDocente,
            };
        }
        public static Tdocente toEntityUpdate(Tdocente tdocente, TestadoDocente testadoDocente, Tpersona tpersona)
        {
            return new Tdocente
            { 
                CodigoDocente = tdocente.CodigoDocente,
                Cedula = tdocente.Cedula,
                Titulo = Utils.SafeString(tdocente.Titulo),
                Facultad = Utils.SafeString(tdocente.Facultad),
                Carrera = tdocente.Carrera, 
                FModificacion = Utils.timeParsed(DateTime.Now),
                UserModificacion = tdocente.UserModificacion,
                IdEstado = tdocente.IdEstado,
                Tpersona = tpersona,
                TestadoDocente = testadoDocente,
            };
        }
    }
}
