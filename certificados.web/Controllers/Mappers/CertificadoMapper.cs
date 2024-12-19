using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using certificados.web.Models.DTO;

namespace certificados.web.Controllers.Mappers
{
    public class CertificadoMapper
    {
        public static Tcertificado toEntity(CertificadoDTO dto, Tevento tevento, TformatoCertificado formato) {

            return new Tcertificado { 

                Titulo = dto.Titulo,
                Imagen = dto.Imagen,
                IdCertificado = dto.IdCertificado,
                IdEvento = dto.IdEvento,
                Tipo = dto.Tipo,   
                Estado = dto.Estado,
                FCreacion = Utils.timeParsed(DateTime.Now),
                UsuarioIngreso = dto.UsuarioIngreso,
                Tevento = tevento,
                TformatoCertificado = formato
            };
        }
        public static Tcertificado toEntityUpdate(CertificadoDTO dto, Tevento tevento, TformatoCertificado formato)
        {

            return new Tcertificado
            {

                Titulo = dto.Titulo,
                Imagen = dto.Imagen,
                IdCertificado = dto.IdCertificado,
                IdEvento = dto.IdEvento,
                Tipo = dto.Tipo,
                Estado = dto.Estado,
                FModificacion = Utils.timeParsed(DateTime.Now),
                UsuarioActualizacion = dto.UsuarioActualizacion,
                Tevento = tevento,
                TformatoCertificado = formato
            };
        }
    }
}
