using certificados.models.Entitys;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [Route("api/isalive")]
    public class IsAliveController : Controller
    {
        [HttpGet]

        public ResponseApp isAlive() {

            return Utils.OkResponse("SERVICIO ACTIVO");
        }
    }
}
