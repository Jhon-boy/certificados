using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using certificados.web.Controllers.Mappers;
using certificados.web.Models.DTO;
using iText.IO.Image;
using iText.Layout.Element;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using iText.Layout;
using static System.Runtime.InteropServices.JavaScript.JSType;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;

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
        private readonly PersonaService personaService;
        private readonly DecanatoService decanatoService;


        public CertificadoController(CertificadosService certificadosService, EventoService evento, GrupoService grupoService,
            GrupoPersonaService grupoPersonaService, DocenteService docenteService, FormatoCertificadoService formato, PersonaService personaService, DecanatoService decanatoService)
        {
            this.certificadosService = certificadosService;
            this.eventoService = evento;
            this.formatoCertificadoService = formato;
            this.grupoPersonaService = grupoPersonaService;
            this.grupoService = grupoService;
            this.docenteService = docenteService;
            this.personaService = personaService;
            this.decanatoService = decanatoService;
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
                Estado = System.Boolean.Parse(estado.ToString()),
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

        [HttpPost("generarcertificado")]
        public ActionResult<ResponseApp> GenerarCertificado([FromBody] Dictionary<string, object> request)
        {
            try
            {
                // Validar y obtener los datos del request
                if (!request.ContainsKey("cedula") || !request.ContainsKey("idFormato") || !request.ContainsKey("idDecanato"))
                {
                    return BadRequest(Utils.BadResponse("Faltan parámetros requeridos en la solicitud."));
                }

                var cedula = ((JsonElement)request["cedula"]).ToString();
                var idFormato = int.Parse(((JsonElement)request["idFormato"]).ToString());
                var idDecanato = int.Parse(((JsonElement)request["idDecanato"]).ToString());

                // Obtener datos de la persona, formato y decanato
                var persona = personaService.buscarPersonaPorCedula(cedula);
                var formato = formatoCertificadoService.ListarFormatoByID(idFormato);
                var decanatoResponse = decanatoService.ObtenerDecanatoById(idDecanato);

                if (persona == null || formato == null || decanatoResponse == null)
                {
                    return BadRequest(Utils.BadResponse("No se encontraron los datos necesarios para generar el certificado."));
                }

                dynamic dataPersona = persona.Data;
                dynamic dataFormato = formato.Data;
                dynamic dataDecanato = decanatoResponse.Data;

                // Obtener la información del request
                var lineaGrafica = dataFormato.LineaGrafica;
                var logoug = dataFormato.LogoUG;
                var nombreDecanato = dataDecanato.Nombre;
                var tituloCertificado = "Confieren el presente";
                var nombresPersona = dataPersona.Nombres;
                var apellidosPersona = dataPersona.Apellidos;
                var tipo = dataFormato.Tipo;
                var descripcionCertificado = dataFormato.Leyenda;

                // Firmantes
                var firmante1 = dataFormato.NombreFirmanteUno;
                var cargo1 = dataFormato.CargoFirmanteUno;
                var firmante2 = dataFormato.NombreFirmanteDos;
                var cargo2 = dataFormato.CargoFirmanteDos;
                var firmante3 = dataFormato.NombreFirmanteTres;
                var cargo3 = dataFormato.CargoFirmanteTres;

                // Crear un documento PDF en formato A4 horizontal
                using (var memoryStream = new MemoryStream())
                {
                    // Crear el documento PDF
                    var document = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4.Rotate());
                    var writer = iTextSharp.text.pdf.PdfWriter.GetInstance(document, memoryStream);
                    document.Open();

                    // Agregar la línea gráfica como fondo
                    if (lineaGrafica != null)
                    {
                        var backgroundImage = iTextSharp.text.Image.GetInstance((byte[])lineaGrafica);
                        backgroundImage.ScaleAbsolute(document.PageSize.Width, document.PageSize.Height);
                        backgroundImage.SetAbsolutePosition(0, 0);
                        backgroundImage.Alignment = iTextSharp.text.Image.UNDERLYING; // Colocar la imagen como fondo
                        writer.DirectContentUnder.AddImage(backgroundImage);
                    }

                    // Insertar logo centrado
                    if (logoug != null)
                    {
                        var logoImage = iTextSharp.text.Image.GetInstance((byte[])logoug);
                        logoImage.Alignment = iTextSharp.text.Image.ALIGN_CENTER;
                        document.Add(logoImage);
                    }

                    // Nombre del decanato centrado debajo del logo
                    var decanatoParagraph = new iTextSharp.text.Paragraph(nombreDecanato)
                    {
                        Alignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 16)
                    };
                    document.Add(decanatoParagraph);

                    // Titulo del certificado
                    var tituloParagraph = new iTextSharp.text.Paragraph(tituloCertificado)
                    {
                        Alignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 20)
                    };
                    document.Add(tituloParagraph);

                    // Nombre a quien se le confiere el certificado
                    var tipoParagraph = new iTextSharp.text.Paragraph(tipo + "a:")
                    {
                        Alignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 14)
                    };
                    document.Add(tipoParagraph);

                    // Nombre a quien se le confiere el certificado
                    var nombreParagraph = new iTextSharp.text.Paragraph(apellidosPersona + " " + nombresPersona)
                    {
                        Alignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 14)
                    };
                    document.Add(nombreParagraph);

                    // Descripción del certificado
                    var descripcionParagraph = new iTextSharp.text.Paragraph(descripcionCertificado)
                    {
                        Alignment = iTextSharp.text.Element.ALIGN_LEFT,
                        Font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 12)
                    };
                    document.Add(descripcionParagraph);

                    // Insertar tabla con los firmantes y cargos
                    var table = new iTextSharp.text.pdf.PdfPTable(3); // Tabla con 3 columnas

                    // Firmantes (nombres)
                    table.AddCell(new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(firmante1, new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 12)))
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER
                    });
                    table.AddCell(new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(firmante2, new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 12)))
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER
                    });
                    table.AddCell(new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(firmante3, new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 12)))
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER
                    });

                    // Cargos (debajo de los firmantes)
                    table.AddCell(new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(cargo1, new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 10)))
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER
                    });
                    table.AddCell(new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(cargo2, new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 10)))
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER
                    });
                    table.AddCell(new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(cargo3, new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 10)))
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER
                    });

                    document.Add(table);

                    // Agregar QR a la derecha
                    if (dataFormato.Qr != null)
                    {
                        var qrImage = iTextSharp.text.Image.GetInstance((byte[])dataFormato.Qr);
                        qrImage.ScaleAbsolute(100, 100); // Escalar la imagen QR
                        qrImage.Alignment = iTextSharp.text.Image.ALIGN_RIGHT;
                        document.Add(qrImage);
                    }

                    // Finalizar y guardar el documento en el stream
                    document.Close();

                    // Convertir a array de bytes
                    var pdfBytes = memoryStream.ToArray();

                    // Regresar el archivo PDF generado
                    var response = new ResponseApp
                    {
                        Cod = "OK",
                        Message = "CERTIFICADO GENERADO CON ÉXITO",
                        Data = Convert.ToBase64String(pdfBytes)
                    };

                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(Utils.BadResponse($"Error al generar el certificado: {ex.Message}"));
            }
        }


    }
}
