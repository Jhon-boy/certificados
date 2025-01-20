using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using certificados.web.Controllers.Mappers;
using certificados.web.Models.DTO;
using iTextSharp.text.pdf.codec.wmf;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace certificados.web.Controllers
{
    [Route("api/certificado")]
    public class CertificadoController : Controller
    {
        private readonly CertificadosService certificadosService;
        private readonly EventoService eventoService;
        private readonly FormatoCertificadoService formatoCertificadoService;
        private readonly GrupoService grupoService;
        private readonly GrupoPersonaService grupoPersonaService;
        private readonly DocenteService docenteService;

        public CertificadoController(CertificadosService certificadosService, EventoService evento, GrupoService grupoService,
            GrupoPersonaService grupoPersonaService, DocenteService docenteService, FormatoCertificadoService formato)
        {
            this.certificadosService = certificadosService;
            this.eventoService = evento;
            this.formatoCertificadoService = formato;
            this.grupoPersonaService = grupoPersonaService;
            this.grupoService = grupoService;
            this.docenteService = docenteService;
        }

        /*
         * Endpoint para crear un CERTIFICADO
         */
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearCertificado([FromBody] Dictionary<string, object> requestBody)
        {

            if (requestBody == null || !requestBody.Any())
            {
                return Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS);
            }

            var titulo = (JsonElement)requestBody["Titulo"];
            var imagen = (JsonElement)requestBody["Imagen"];
            var idEvento = (JsonElement)requestBody["IdEvento"];
            var idFormato = (JsonElement)requestBody["IdFormato"];
            var tipo = (JsonElement)requestBody["Tipo"];
            var estado = (JsonElement)requestBody["Estado"];
            var usuarioIngreso = (JsonElement)requestBody["UsuarioIngreso"];

            var eventoResponse = eventoService.ListarPorId(int.Parse(idEvento.ToString()));
            if (!eventoResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return Utils.BadResponse("NO EXISTE EL EVENTO");
            }

            var formatoResponse = formatoCertificadoService.ListarFormatoByID(int.Parse(idFormato.ToString()));
            if (!formatoResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return Utils.BadResponse("NO EXISTE EL FORMATO");
            }
            Tevento evento = EventoMapper.convertEntity(eventoResponse.Data);
            TformatoCertificado formato = FormatoCertificadoMapper.convertEntity(formatoResponse.Data);

            var tcertificado = new Tcertificado
            {
                Titulo = titulo.ToString(),
                Imagen = imagen.GetBytesFromBase64(),
                IdEvento = int.Parse(idEvento.ToString()),
                IdFormato = int.Parse(idFormato.ToString()),
                Tipo = tipo.GetString(),
                Estado = true,
                UsuarioIngreso = usuarioIngreso.ValueKind == JsonValueKind.Number ? usuarioIngreso.GetInt32().ToString() : usuarioIngreso.GetString(),
                Tevento = evento,
                TformatoCertificado = formato
            };

            return Ok(certificadosService.CrearCertificado(tcertificado));
        }

        /*
          * Endpoint para MODIFICAR un CERTIFICADO
          */
        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarCertificado([FromBody] Dictionary<string, object> requestBody)
        {

            if (requestBody == null || !requestBody.Any())
            {
                return Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS);
            }

            var idCertificado = (JsonElement)requestBody["idCertificado"];
            var titulo = (JsonElement)requestBody["Titulo"];
            var idEvento = (JsonElement)requestBody["IdEvento"];
            var idFormato = (JsonElement)requestBody["IdFormato"];
            var tipo = (JsonElement)requestBody["Tipo"];
            var estado = (JsonElement)requestBody["Estado"];
            var userModificacion = (JsonElement)requestBody["UserModificacion"];


            var eventoResponse = eventoService.ListarPorId(int.Parse(idEvento.ToString()));
            if (!eventoResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return Utils.BadResponse("NO EXISTE EL EVENTO");
            }

            var formatoResponse = formatoCertificadoService.ListarFormatoByID(int.Parse(idFormato.ToString()));
            if (!formatoResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return Utils.BadResponse("NO EXISTE EL FORMATO");
            }
            Tevento evento = EventoMapper.convertEntity(eventoResponse.Data);
            TformatoCertificado formato = FormatoCertificadoMapper.convertEntity(formatoResponse.Data);
            var tcertificado = new Tcertificado
            {
                IdCertificado = int.Parse(idCertificado.ToString()),
                Titulo = titulo.ToString(),
                IdEvento = int.Parse(idEvento.ToString()),
                IdFormato = int.Parse(idFormato.ToString()),
                Tipo = tipo.ToString(),
                Estado = Boolean.Parse(estado.ToString()),
                UsuarioActualizacion = userModificacion.ValueKind == JsonValueKind.Number ? userModificacion.GetInt32().ToString() : userModificacion.GetString(),
                Tevento = evento,
                TformatoCertificado = formato
            };
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

            if (!request.TryGetValue("idCertificado", out var idCertificadoObj) || idCertificadoObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            if (!int.TryParse(idCertificadoObj.ToString(), out int idCertificado))
            {
                return BadRequest(Utils.BadResponse("ID CERTIFICADO NO VÁLIDO"));
            }
            return Ok(certificadosService.ElminarCertificado(idCertificado));
        }
       
        [HttpPost("email/notificar")]
        public ActionResult<ResponseApp> enviarMail([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idEvento", out var idEventoObj) || idEventoObj == null)
            {
                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }
            if (!int.TryParse(idEventoObj.ToString(), out int idEvento))
            {
                return BadRequest(Utils.BadResponse("ID GRUPO NO VÁLIDO"));
            }
            var evento = eventoService.ListarPorId(idEvento);
            if (!evento.Cod.Equals(CONSTANTES.COD_OK))
            {
                return BadRequest(Utils.BadResponse("NO EXISTE EL EVENTO"));
            }
            Tevento tevento = EventoMapper.convertEntity(evento.Data);
            var grupo = grupoService.BuscarGrupo(tevento.IdGrupo);
            if (!grupo.Cod.Equals(CONSTANTES.COD_OK))
            {
                return BadRequest(Utils.BadResponse("NO EXISTE EL GRUPO"));
            }

            var grupoResponse = grupoPersonaService.BuscarById(tevento.IdGrupo);
            List<Tpersona> listaPersonas = GrupoPersonaMapper.listadoPersonas(grupoResponse.Data);


            return certificadosService.Notificar(tevento, listaPersonas);
        }

        [HttpPost("emitir")]
        public ActionResult<ResponseApp> Emitir([FromBody] EmitirCertificadoDTO dto)
        {
            if (dto == null)
                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            
            var certificadoRq = certificadosService.CertificadosById(dto.idCertificado);
            if (!certificadoRq.Cod.Equals(CONSTANTES.COD_OK))
            {
                return BadRequest(Utils.BadResponse("NO EXISTE EL EVENTO"));
            }
            Tcertificado certificado = CertificadoMapper.toEntity(certificadoRq.Data);

            var grupo = grupoService.BuscarGrupo(certificado.Tevento.IdGrupo);
            if (!grupo.Cod.Equals(CONSTANTES.COD_OK))
            {
                return BadRequest(Utils.BadResponse("NO EXISTE EL GRUPO"));
            }

            var grupoResponse = grupoPersonaService.BuscarById(certificado.Tevento.IdGrupo);
            List<Tpersona> listaPersonas = GrupoPersonaMapper.listadoPersonas(grupoResponse.Data);
            List<Tdocente> Listadocente = new List<Tdocente>();
            foreach (var docent in dto.docentes) {
                var requestDocente = docenteService.ObtenerDocentesByCedula(docent);
                if (!requestDocente.Cod.Equals(CONSTANTES.COD_OK))
                    continue;
                Tdocente docente = DocenteMapper.toEntity(requestDocente.Data);
                Listadocente.Add(docente);
                
            }

            return certificadosService.Emitir(certificado.Tevento, listaPersonas, certificado, Listadocente, certificado.Tevento.Tdecanato);
            // return certificadosService.Notificar(tevento, listaPersonas);
        }
    }
}
