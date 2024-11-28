
using certificados.models.Entitys;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [ApiController]
    [Route("usuario/")]
    public class UsuarioController : Controller
    {
        private readonly UsuarioService usuarioService;

        public UsuarioController(UsuarioService _usuarioService)
        {

            this.usuarioService = _usuarioService;
        }

        public ResponseApp LogeoController([FromBody] Dictionary<string, string> requestBody)
        {

            if (!requestBody.TryGetValue("email", out string email) || string.IsNullOrWhiteSpace(email) ||
                !requestBody.TryGetValue("password", out string password) || string.IsNullOrWhiteSpace(password))
            {
                return Utils.BadResponse("FALTAN DATOS");
            }

            return usuarioService.LoginUsuario(email, password);

        }
    }
}
