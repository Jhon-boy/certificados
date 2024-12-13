using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [Route("api/certificado")]
    public class CertificadoController : Controller
    {
        private readonly CertificadosService certificadosService;

        public CertificadoController(CertificadosService certificadosService)
        {
            this.certificadosService = certificadosService;
        }

        /*
         * Endpoint para crear un CERTIFICADO
         */
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearCertificado(Tcertificado tcertificado) {

            if (tcertificado == null) {
                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }

            return Ok(certificadosService.CrearCertificado(tcertificado));
        }

        /*
          * Endpoint para MODIFICAR un CERTIFICADO
          */
        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarCertificado(Tcertificado tcertificado) {

            if (tcertificado == null) {
                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }
            return Ok(certificadosService.CrearCertificado(tcertificado));
        }
        /*
         * Endpoint para LISTATAR CERTIFICADO
         */
        [HttpGet("all")]
        public ActionResult<ResponseApp> obtenerCertificados()
        {
            return Ok(certificadosService.ListarCertificados());
        }

        /*
         * Endpoint para LISTATAR CERTIFICADO
         */
        [HttpPost("id")]
        public ActionResult<ResponseApp> obtenerCertificadosById([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idCertificado", out var idCertificadoObj) || idCertificadoObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            if (!int.TryParse(idCertificadoObj.ToString(), out int idCertificado))
            {
                return BadRequest(Utils.BadResponse("ID CERTIFICADO NO VÁLIDO"));
            }
            return Ok(certificadosService.ListarCertificadosById(idCertificado));
        }

        /*
         * Endpoint para LISTATAR CERTIFICADO POR EVENTO
         */
        [HttpPost("porEvento")]
        public ActionResult<ResponseApp> obtenerCertificadosByEvento([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idEvento", out var idEventoObj) || idEventoObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            if (!int.TryParse(idEventoObj.ToString(), out int idEvento))
            {
                return BadRequest(Utils.BadResponse("ID CERTIFICADO NO VÁLIDO"));
            }
            return Ok(certificadosService.ObtenerCertificadosByEvento(idEvento));
        }
        /*
         * Endpoint para eliminar un CERTIFICADO
         */
        [HttpPost("eliminar")]
        public ActionResult<ResponseApp> eliminarCertificado([FromBody] Dictionary<string, object> request)
        {

            if (!request.TryGetValue("idEvento", out var idEventoObj) || idEventoObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            if (!int.TryParse(idEventoObj.ToString(), out int idEvento))
            {
                return BadRequest(Utils.BadResponse("ID CERTIFICADO NO VÁLIDO"));
            }
            return Ok(certificadosService.ElminarCertificado(idEvento));
        }
    }
}
