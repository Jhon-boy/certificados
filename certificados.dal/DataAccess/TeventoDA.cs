using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TeventoDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public ResponseApp InsertarEvento(Tevento tevento)
        {

            ResponseApp response = Utils.BadResponse(null);
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Tevento.Add(tevento);
                    context.SaveChanges();
                    transaction.Commit();
                    response = Utils.OkResponse(tevento);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    response.Message = "Error al insertar EVENTO " + ex.Message;
                    throw new Exception($"ERROR AL INSERTAR EVEMTO: {ex.Message}");

                }

                return response;
            }

        }
        public ResponseApp ModificarEvento(Tevento evento)
        {
            ResponseApp response = Utils.BadResponse(null);
            using (var transaction = context.Database.BeginTransaction())
            {

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
                        transaction.Commit();

                        response = Utils.OkResponse(eventoExistente);
                    }
                    else
                    {
                        response = Utils.BadResponse("EVENTO NO EXISTE");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    response = Utils.BadResponse($"ERROR AL MODIFICAR EVENTO: {ex.Message}");
                    throw new Exception($"ERROR AL MODIFICAR EVEMTO: {ex.Message}");
                }
                return response;
            }

        }

        public ResponseApp EliminarEvento(int idEvento)
        {
            ResponseApp response = Utils.BadResponse(null);
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    var eventoExistente = context.Tevento.FirstOrDefault(e => e.Idevento == idEvento);

                    if (eventoExistente != null)
                    {
                        context.Tevento.Remove(eventoExistente);
                        context.SaveChanges();
                        transaction.Commit();

                        response = Utils.OkResponse(eventoExistente);
                    }
                    else
                    {
                        response = Utils.BadResponse("EVENTO NO EXISTE");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    response = Utils.BadResponse($"ERROR AL ELIMINAR EVENTO: {ex.Message}");
                    throw new Exception($"ERROR AL eliminar EVEMTO: {ex.Message}");
                }
                return response;
            }

        }

        public ResponseApp ListarEventos()
        {
            ResponseApp response = Utils.BadResponse(null);

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

        public ResponseApp ListarEventosPorPeriodo(string periodo)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var listaEventos = context.Tevento.Where(e => e.Periodo == periodo).ToList();

                response = Utils.OkResponse(listaEventos);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR EVENTOS: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR EVEMTO: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ListarEventosPorParametro<T>(string propiedad, T valor)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                // Construir dinámicamente la consulta
                var parameter = Expression.Parameter(typeof(Tevento), "e");
                var property = Expression.Property(parameter, propiedad);
                var constant = Expression.Constant(valor, typeof(T));
                var equality = Expression.Equal(property, constant);

                var lambda = Expression.Lambda<Func<Tevento, bool>>(equality, parameter);

                // Ejecutar la consulta
                var listaEventos = context.Tevento.Where(lambda).ToList();
                response = Utils.OkResponse(listaEventos);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR EVENTOS: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR EVEMTO: {ex.Message}");
            }
            return response;
        }



        public ResponseApp BuscarEvento(int idEvento)
        {
            ResponseApp response = Utils.BadResponse(null);
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
