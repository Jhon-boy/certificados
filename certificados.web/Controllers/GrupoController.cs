using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [ApiController]
    [Route("api/grupo")]
    public class GrupoController : Controller
    {
        private readonly GrupoService grupoPersonaService;

        public GrupoController(GrupoService grupo) { 
        
            this.grupoPersonaService = grupo;
        }
        [HttpGet("all")]
        public ActionResult<ResponseApp> listarEstados()
        {

            return Ok(grupoPersonaService.ListarGrupos());
        }
        [HttpPost("crear")]
        public ActionResult<ResponseApp> CrearGrupoPersona([FromBody] Tgrupo tgrupo)
        {
            if (tgrupo == null)
            {

                return Utils.BadResponse("FALTA PARAMETROS");
            }

            return Ok(grupoPersonaService.InsertarGrupo(tgrupo));
        }
        [HttpPost("modificar")]
        public ActionResult<ResponseApp> ModificarGrupo([FromBody] Tgrupo tgrupo)
        {
            if (tgrupo == null)
            {

                return Utils.BadResponse("FALTA PARAMETROS");
            }

            return Ok(grupoPersonaService.ModificarGrupo(tgrupo));
        }

        [HttpPost("id")]
        public ActionResult<ResponseApp> listarById([FromBody] Dictionary<string, object> request)
        {

            if (!request.TryGetValue("idGrupo", out var idGrupoObj) || idGrupoObj == null)
            {

                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }

            if (!int.TryParse(idGrupoObj.ToString(), out int idGrupo))
            {

                return BadRequest(Utils.BadResponse("ID EVENTO NO VÁLIDO"));
            }
            return Ok(grupoPersonaService.BuscarGrupo(idGrupo));
        }

        [HttpPost("eliminar")]
        public ActionResult<ResponseApp> EliminarById([FromBody] Dictionary<string, object> request)
        {

            if (!request.TryGetValue("idGrupo", out var idGrupoObj) || idGrupoObj == null)
            {

                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }

            if (!int.TryParse(idGrupoObj.ToString(), out int idGrupo))
            {

                return BadRequest(Utils.BadResponse("ID EVENTO NO VÁLIDO"));
            }
            return Ok(grupoPersonaService.EliminarGrupo(idGrupo));
        }
    }
}
