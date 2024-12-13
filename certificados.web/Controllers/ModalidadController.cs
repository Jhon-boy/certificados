using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [ApiController]
    [Route("api/modalidad")]
    public class ModalidadController:Controller
    {
        private readonly ModalidadService modalidadService;

        public ModalidadController(ModalidadService modalidadService) { 
        
              this.modalidadService = modalidadService;
        }

        [HttpGet("all")]
        public ActionResult<ResponseApp> listarModalidad()
        {

            return Ok(modalidadService.ListarModalidades());
        }
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearModalidad([FromBody] Tmodalidad tmodalidad) {

            if (tmodalidad == null) {

                return Utils.BadResponse("FALTA PARAMETROS");
            }
            return Ok(modalidadService.InsertarModalidad(tmodalidad));
        }

        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarModalidad([FromBody] Tmodalidad tmodalidad)
        {

            if (tmodalidad == null)
            {

                return Utils.BadResponse("FALTA PARAMETROS");
            }
            return Ok(modalidadService.ModificarModalidad(tmodalidad));
        }
        [HttpPost("id")]
        public ActionResult<ResponseApp> listarById([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idModalidad", out var idModalidadObj) || idModalidadObj == null)
            {

                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }

            if (!int.TryParse(idModalidadObj.ToString(), out int idModalidad))
            {

                return BadRequest(Utils.BadResponse("ID MODALIDAD NO VÁLIDO"));
            }
            return Ok(modalidadService.ConsultarModalidad(idModalidad));
        }

        [HttpPost("eliminar")]
        public ActionResult<ResponseApp> eliminarById([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idModalidad", out var idModalidadObj) || idModalidadObj == null)
            { 
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }

            if (!int.TryParse(idModalidadObj.ToString(), out int idModalidad))
            {

                return BadRequest(Utils.BadResponse("ID MODALIDAD NO VÁLIDO"));
            }
            return Ok(modalidadService.EliminarModalidad(idModalidad));
        }
    }
}
