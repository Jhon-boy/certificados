using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using certificados.web.Controllers.Mappers;
using certificados.web.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    [Route("api/certificado")]
    public class CertificadoController : Controller
    {
        private readonly CertificadosService certificadosService;
        private readonly EventoService eventoService;
        private readonly FormatoCertificadoService formatoCertificadoService;

        public CertificadoController(CertificadosService certificadosService, EventoService evento, FormatoCertificadoService formato)
        {
            this.certificadosService = certificadosService;
            this.eventoService = evento;
            this.formatoCertificadoService = formato;
        }

        /*
         * Endpoint para crear un CERTIFICADO
         */
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearCertificado([FromBody] CertificadoDTO dto) {

            if (dto == null) {
                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }

            var eventoResponse = eventoService.ListarPorId(dto.IdEvento);
            if (!eventoResponse.Cod.Equals(CONSTANTES.COD_OK)) {
                return Utils.BadResponse("NO EXISTE EL EVENTO");
            }

            var formatoResponse = formatoCertificadoService.ListarFormatoByID(dto.IdFormato);
            if (!formatoResponse.Cod.Equals(CONSTANTES.COD_OK)) {
                return Utils.BadResponse("NO EXISTE EL FORMATO");
            }
            Tevento evento = EventoMapper.convertEntity(eventoResponse.Data);
            TformatoCertificado formato = FormatoCertificadoMapper.convertEntity(formatoResponse.Data);
            Tcertificado tcertificado = CertificadoMapper.toEntity(dto, evento, formato);
            return Ok(certificadosService.CrearCertificado(tcertificado));
        }

        /*
          * Endpoint para MODIFICAR un CERTIFICADO
          */
        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarCertificado([FromBody] CertificadoDTO dto) {

            if (dto == null)
            {
                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }

            var eventoResponse = eventoService.ListarPorId(dto.IdEvento);
            if (!eventoResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return Utils.BadResponse("NO EXISTE EL EVENTO");
            }

            var formatoResponse = formatoCertificadoService.ListarFormatoByID(dto.IdFormato);
            if (!formatoResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return Utils.BadResponse("NO EXISTE EL FORMATO");
            }
            Tevento evento = EventoMapper.convertEntity(eventoResponse.Data);
            TformatoCertificado formato = FormatoCertificadoMapper.convertEntity(formatoResponse.Data);
            Tcertificado tcertificado = CertificadoMapper.toEntity(dto, evento, formato);
            return Ok(certificadosService.ActualizarCertificado(tcertificado));
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
