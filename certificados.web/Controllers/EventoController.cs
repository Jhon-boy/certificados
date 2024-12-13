using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [ApiController]
    [Route("api/evento")]
    public class EventoController : Controller
    {
        private readonly EventoService eventoService;

        public EventoController(EventoService eventoService) {

            this.eventoService = eventoService;
        }

        [HttpGet("all")]
        public ActionResult<ResponseApp> listarEstados()
        {

            return Ok(eventoService.ListarEventos());
        }
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearEvento([FromBody] Tevento tevento) {
            if (tevento == null) {

                return Utils.BadResponse("FALTA PARAMETROS");
            }

            return Ok(eventoService.CrearEvento(tevento));
        }

        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarEvento([FromBody] Tevento tevento)
        {
            if (tevento == null)
            {

                return Utils.BadResponse("FALTA PARAMETROS");
            }

            return Ok(eventoService.ActualizarEvento(tevento));
        }
        [HttpPost("id")]
        public ActionResult<ResponseApp> listarById([FromBody] Dictionary<string, object> request) { 
        
            if(!request.TryGetValue("idEvento",out var idEventoObj) || idEventoObj == null){

                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }

            if (!int.TryParse(idEventoObj.ToString(), out int idEvento)) {

                return BadRequest(Utils.BadResponse("ID EVENTO NO VÁLIDO"));
            }
            return Ok(eventoService.ListarPorId(idEvento));
        }
        [HttpPost("eliminar")]
        public ActionResult<ResponseApp> eliminarById([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idEvento", out var idEventoObj) || idEventoObj == null)
            {

                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }

            if (!int.TryParse(idEventoObj.ToString(), out int idEvento))
            {

                return BadRequest(Utils.BadResponse("ID EVENTO NO VÁLIDO"));
            }
            return Ok(eventoService.EliminarEvento(idEvento));
        }
    }
}
