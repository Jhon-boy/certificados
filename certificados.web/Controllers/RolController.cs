using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [Route("api/rol")]
    public class RolController : Controller
    {
        private readonly RolService rolService;
            
        public RolController(RolService rolService)
        {

            this.rolService = rolService;
        }
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearRol([FromBody] Trol dto) {
            if (dto == null) {

                return Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS);
            }
            
            return Ok(rolService.CrearRol(dto));
        }
        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarRol([FromBody] Trol dto) {

            if (dto == null) {
                return Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS);
            }
            return Ok(rolService.ModificarRol(dto));
        }

        [HttpGet("all")]
        public ResponseApp obtenerRoles()
        {

            return rolService.ListarRoles();
        }
        [HttpPost("id")]
        public ActionResult ObtenerRolById([FromBody] Dictionary<string, object> requestBody)
        {
            if (!requestBody.TryGetValue("idRol", out var idRolObj) ||
                idRolObj == null ||
                !int.TryParse(idRolObj.ToString(), out int idRol))
            {
                return BadRequest(Utils.BadResponse("FALTA PARAMETROS"));
            }

            return Ok(rolService.BuscarRol(idRol));
        }

    }
}
