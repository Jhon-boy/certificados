using certificados.models.Entitys.dbo;
using certificados.services.Utils;

namespace certificados.web.Controllers.Mappers
{
    public class FormatoCertificadoMapper
    {

        public static TformatoCertificado toEntityCreate(Dictionary<string, string> data)
        {
            return new TformatoCertificado
            {
                LogoUniversidad = data.ContainsKey("LogoUniversidad") ? Convert.FromBase64String(data["LogoUniversidad"]) : null,
                LogoSecundario = data.ContainsKey("LogoSecundario") ? Convert.FromBase64String(data["LogoSecundario"]) : null,
                MarcarAgua = data.ContainsKey("MarcarAgua") ? Convert.FromBase64String(data["MarcarAgua"]) : null,
                Qr = data.ContainsKey("Qr") ? Convert.FromBase64String(data["Qr"]) : null,
                FCreacion = Utils.timeParsed(DateTime.Now),
                FModificacion = Utils.timeParsed(DateTime.Now),
                UsuarioIngreso = data.ContainsKey("UsuarioIngreso") ? data["UsuarioIngreso"] : "admin"
            };
        }

        public static TformatoCertificado toEntityUpdate(TformatoCertificado tformatoCertificado)
        {

            return new TformatoCertificado
            {
                idFormato = tformatoCertificado.idFormato,
                LogoUniversidad = tformatoCertificado.LogoUniversidad,
                LogoSecundario = tformatoCertificado.LogoSecundario,
                MarcarAgua = tformatoCertificado.MarcarAgua,
                FModificacion = Utils.timeParsed(DateTime.Now),
                UsuarioActualizacion = tformatoCertificado.UsuarioActualizacion
            };
        }
    }
}
