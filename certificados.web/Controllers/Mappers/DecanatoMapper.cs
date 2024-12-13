using certificados.models.Entitys.dbo;
using certificados.services.Utils;

namespace certificados.web.Controllers.Mappers
{
    public class DecanatoMapper
    {
        public static Tdecanato toEntityCreate(Tdecanato entity) {
             
            return new Tdecanato{
                Nombre = Utils.SafeString(entity.Nombre),
                FCreacion = Utils.timeParsed(DateTime.Now),
                FModificacion = Utils.timeParsed(DateTime.Now),
                UsuarioIngreso = Utils.SafeString(entity.UsuarioIngreso),
            };
        }

        public static Tdecanato toEntityUpdate(Tdecanato entity)
        {

            return new Tdecanato
            {
                IdDecanato = entity.IdDecanato,
                Nombre = Utils.SafeString(entity.Nombre),
                FModificacion = Utils.timeParsed(DateTime.Now), 
                UsuarioActualizacion = Utils.SafeString(entity.UsuarioActualizacion)
            };
        }
    }
}
