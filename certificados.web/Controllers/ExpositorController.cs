using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using certificados.web.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices.JavaScript;

namespace certificados.web.Controllers
{
    [Route("api/expositor")]
    public class ExpositorController : Controller
    {
        //
        private readonly ExpositorService expositorService;
        private readonly PersonaService personaService;

        public ExpositorController(ExpositorService expositorService, PersonaService _personaService)
        {
            this.expositorService = expositorService;
            this.personaService = _personaService;
        }
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearExpositor([FromBody] ExpositorDTO dto) {
            if (dto == null)
            {

                return Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS);
            }
            var requestPersona = personaService.ObtenerPersona(dto.Cedula);
            if (!requestPersona.Cod.Equals(CONSTANTES.COD_OK)){
                return BadRequest(Utils.BadResponse("USUARIO NO EXISTE"));
            }

            var personaData = requestPersona.Data as JObject;
            Tpersona persona = new Tpersona
            {
                Cedula = personaData.Value<string>("cedula"),
                Nombres = personaData.Value<string>("nombres"),
                Apellidos = personaData.Value<string>("apellidos"),
                Edad = personaData.Value<int?>("edad") ?? 0,
                Genero = personaData.Value<string>("genero"),
                FechaCreacion = personaData.Value<DateTime?>("fechaCreacion") ?? DateTime.UtcNow,
                FechaModificacion = personaData.Value<DateTime?>("fechaModificacion") ?? DateTime.UtcNow,
                UsuarioIngreso = personaData.Value<string>("usuarioIngreso"),
                UsuarioActualizacion = personaData.Value<string>("usuarioActualizacion")
            };

            Texpositor expositor = new Texpositor {
                Cedula = dto.Cedula,
                UsusarioIngreso = dto.UsusarioIngreso,
                FCreacion = Utils.timeParsed(DateTime.Now),
                Tpersona = persona,
                FModificacion = Utils.timeParsed(DateTime.Now)
            };
            return Ok(expositorService.crearExpositor(expositor));
        }

        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarExpositor([FromBody] Texpositor dto)
        {
            if (dto == null)
            {

                return Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS);
            }

            return Ok(expositorService.modificarExpositor(dto));
        }

        [HttpGet("all")]
        public ActionResult<ResponseApp> listarExpositores() {
            return Ok(expositorService.listarExpositores());
        }

        [HttpGet("id")]
        public ActionResult<ResponseApp> obtenerExpositorById([FromBody] Dictionary<string, object> request) {

            if (!request.TryGetValue("idExpositor", out var idExpositorObj) || idExpositorObj == null
                ||
                !int.TryParse(idExpositorObj.ToString(), out int idExpositor)) {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            return Ok(expositorService.buscarPorID(idExpositor));
        }

    }
}
