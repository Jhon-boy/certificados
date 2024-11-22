using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TeventoDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public Response InsertarEvento(Tevento tevento) {

            Response response = Utils.BadResponse(null);

            try
            {
                context.Tevento.Add( tevento );
                context.SaveChanges();
                response = Utils.OkResponse(tevento);
            }
            catch (Exception ex) { 

                response.Message = "Error al insertar EVENTO " + ex.Message;
                throw new Exception($"ERROR AL INSERTAR EVEMTO: {ex.Message}");
            
            }

            return response;
        
        }
        public Response ModificarEvento(Tevento evento)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var eventoExistente = context.Tevento.FirstOrDefault(e => e.Idevento == evento.Idevento);

                if (eventoExistente != null)
                { 
                    eventoExistente.FechaInicio = evento.FechaInicio;
                    eventoExistente.FechaFin = evento.FechaFin;
                    eventoExistente.Horas = evento.Horas;
                    eventoExistente.Lugar = evento.Lugar;
                    eventoExistente.ConCertificado = evento.ConCertificado;
                    eventoExistente.Periodo = evento.Periodo;
                    eventoExistente.Tematica = evento.Tematica;
                    eventoExistente.Dominio = evento.Dominio;
                    eventoExistente.IdGrupoPersona = evento.IdGrupoPersona;
                    eventoExistente.IdModalidad = evento.IdModalidad;
                    eventoExistente.IdTipoEvento = evento.IdTipoEvento;
                    eventoExistente.IdDecanato = evento.IdDecanato;
                    eventoExistente.FModificacion = Utils.timeParsed(DateTime.Now);
                    eventoExistente.UsuarioActualizacion = evento.UsuarioActualizacion;
                     
                    context.SaveChanges();
                     
                    response = Utils.OkResponse(eventoExistente);
                }
                else
                { 
                    response = Utils.BadResponse("EVENTO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL MODIFICAR EVENTO: {ex.Message}");
                throw new Exception($"ERROR AL MODIFICAR EVEMTO: {ex.Message}");
            }
            return response;
        }

        public Response EliminarEvento(int idEvento)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var eventoExistente = context.Tevento.FirstOrDefault(e => e.Idevento == idEvento);

                if (eventoExistente != null)
                { 
                    context.Tevento.Remove(eventoExistente);
                    context.SaveChanges();
                     
                    response = Utils.OkResponse(eventoExistente);
                }
                else
                { 
                    response = Utils.BadResponse("EVENTO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR EVENTO: {ex.Message}");
                throw new Exception($"ERROR AL eliminar EVEMTO: {ex.Message}");
            }
            return response;
        }

        public Response ListarEventos()
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var listaEventos = context.Tevento.ToList();
                 
                response = Utils.OkResponse(listaEventos);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR EVENTOS: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR EVEMTO: {ex.Message}");
            }
            return response;
        }

        public Response BuscarEvento(int idEvento)
        {
            Response response = Utils.BadResponse(null);
            try
            { 
                var evento = context.Tevento.FirstOrDefault(e => e.Idevento == idEvento);

                if (evento != null)
                { 
                    response = Utils.OkResponse(evento);
                }
                else
                { 
                    response = Utils.BadResponse("EVENTO NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR EVENTO: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR EVEMTO: {ex.Message}");
            }
            return response;
        }

    }
}
