using certificados.models.Entitys;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace certificados.web.Controllers
{
    [ApiController]
    [Route("api/personas")]
    public class PersonaController : Controller
    {
        private readonly PersonaService personaService;


        public PersonaController(PersonaService _personaService) { 
        
            personaService = _personaService ?? throw new ArgumentNullException(nameof(personaService));
        }

        // GET: PersonaController
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost("all")]
        public ActionResult<ResponseApp> listarPersonas([FromBody] Dictionary<string, object> requestBody) {

            if (!requestBody.TryGetValue("estado", out var idstadoObj))
            {
                return BadRequest(Utils.BadResponse("FALTA PARAMETROS"));
            }
            return personaService.ListarPersonas(idstadoObj.ToString());
        }
    }
}
