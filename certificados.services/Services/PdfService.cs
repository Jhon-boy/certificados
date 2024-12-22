using certificados.models.Entitys.dbo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using ZXing;
using ZXing.QrCode;
using System.Drawing;
using iTextSharp.text.pdf.qrcode;
using Microsoft.IdentityModel.Tokens;


namespace certificados.services.Services
{
    public class PdfService
    {
         
        public  byte[] GenerarCertificado(TformatoCertificado formato, Tevento evento, Tpersona persona, List< Tdocente >docentes, Tdecanato decanato) {

            using (MemoryStream ms = new MemoryStream()) {
                Document documento = new Document(new iTextSharp.text.Rectangle(279, 356));
                PdfWriter writer = PdfWriter.GetInstance(documento, ms);
                documento.Open();

                PdfContentByte cb = writer.DirectContentUnder;
                AgregarBackGround(cb, formato.MarcarAgua, documento.PageSize);

                if (formato.LogoUniversidad != null && formato.LogoUniversidad.Length > 0)
                {
                    byte[] imageBytes = formato.LogoUniversidad;
                    using (MemoryStream imgMs = new MemoryStream(imageBytes))
                    {
                        Image logo = Image.GetInstance(imgMs);
                        float logoHeight = 80f; // Puedes ajustar este tamaño
                        float ratio = logo.Width / logo.Height;
                        logo.ScaleAbsolute(logoHeight * ratio, logoHeight);
                        logo.SetAbsolutePosition(
                            (documento.PageSize.Width - (logoHeight * ratio)) / 2,
                            documento.PageSize.Height - 120);
                        documento.Add(logo);
                    }
                }
                documento.Add(new Paragraph(" "));
                AgregarTexto(documento, "El " + decanato.Nombre, 20, true, Element.ALIGN_CENTER);
                AgregarTexto(documento, "Confieren el presente", 16, true, Element.ALIGN_CENTER);
                documento.Add(new Paragraph(" ")); 

                AgregarTexto(documento, "CERTIFICADO ", 24, true, Element.ALIGN_CENTER);
                documento.Add(new Paragraph(" "));
                documento.Add(new Paragraph(" "));

                // Contenido principal
                AgregarTexto(documento, persona.Nombres.ToUpper() +" " +  persona.Apellidos, 18, true, Element.ALIGN_CENTER);
                documento.Add(new Paragraph(" "));
                AgregarTexto(documento, $"Por haber aprobado el " + evento.TtipoEvento.Nombre + " " + evento.Dominio  + " con una duración de " + evento.Horas  + $", realizado desde {evento.FechaInicio:dd 'de' MMMM 'del' yyyy}  +  hasta el {evento.FechaFin:dd 'de' MMMM 'del' yyyy}", 15 , false, Element.ALIGN_CENTER);

                documento.Add(new Paragraph(" "));
                documento.Add(new Paragraph(" "));
                AgregarTexto(documento, $"Dado en Guayaquil, el {DateTime.Now:dd 'de' MMMM 'del' yyyy}", 12, false, Element.ALIGN_RIGHT);
                documento.Add(new Paragraph(" "));
                documento.Add(new Paragraph(" "));
                documento.Add(new Paragraph(" "));

                PdfContentByte contenido = writer.DirectContent;
                float startY = 150f; 
                float lineWidth = 150f; 

                // Calcular el espacio entre firmas basado en el número de expositores
                float espacioEntreFirmas = documento.PageSize.Width / docentes.Count;

                for (int i = 0; i < docentes.Count && i < 3; i++)
                {
                    float xPos = espacioEntreFirmas * (i + 1) - (lineWidth / 2);
                     
                    contenido.MoveTo(xPos, startY);
                    contenido.LineTo(xPos + lineWidth, startY);
                    contenido.Stroke();
                     
                    Paragraph firmaNombre = new Paragraph(docentes[i].Tpersona.Nombres,
                        FontFactory.GetFont(FontFactory.HELVETICA, 10, Font.NORMAL));
                    firmaNombre.Alignment = Element.ALIGN_CENTER;
                     
                    ColumnText ct = new ColumnText(contenido);
                    ct.SetSimpleColumn(xPos, startY - 30, xPos + lineWidth, startY - 5);
                    ct.AddElement(firmaNombre);
                    ct.Go();
                     
                    if (!string.IsNullOrEmpty(docentes[i].Tpersona.Nombres))
                    {
                        Paragraph firmaCargo = new Paragraph(docentes[i].Titulo,
                            FontFactory.GetFont(FontFactory.HELVETICA, 9, Font.ITALIC));
                        firmaCargo.Alignment = Element.ALIGN_CENTER;

                        ct = new ColumnText(contenido);
                        ct.SetSimpleColumn(xPos, startY - 45, xPos + lineWidth, startY - 30);
                        ct.AddElement(firmaCargo);
                        ct.Go();
                    }
                }

                documento.Close();
                return ms.ToArray();

            }
        }

        private void AgregarBackGround(PdfContentByte cb, byte[] marcaAguaBase64, iTextSharp.text.Rectangle pageSize)
        {
            if (marcaAguaBase64.Length <= 0) return;

            try
            {
                byte[] imageBytes = marcaAguaBase64;
                using (MemoryStream ms = new MemoryStream(imageBytes))
                {
                    Image marca = Image.GetInstance(ms);
                    marca.ScaleToFit(pageSize.Width, pageSize.Height);
                    marca.SetAbsolutePosition(0, 0);
                    cb.AddImage(marca);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al formar el  BACKGROUND {ex.Message}");
            }
        }

        private void AgregarTexto(Document doc, string texto, float tamano, bool negrita, int alineacion)
        {
            Font fuente = FontFactory.GetFont(FontFactory.HELVETICA, tamano, negrita ? Font.BOLD : Font.NORMAL);
            Paragraph parrafo = new Paragraph(texto, fuente);
            parrafo.Alignment = alineacion;
            doc.Add(parrafo);
        }
    }
}
