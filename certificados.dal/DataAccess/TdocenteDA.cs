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
    public class TdocenteDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public ResponseApp InsertarDocente(Tdocente tdocente) {

            ResponseApp response = Utils.BadResponse(null);

            try
            {

                context.Tdocente.Add(tdocente);
                    
                context.SaveChanges();
                response = Utils.OkResponse(tdocente);
            }
            catch (Exception ex) {
                response = Utils.BadResponse($"ERROR AL INSERTAR PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL INSERTAR DOCENTE: {ex.Message}");
            }
        
            return response;
        }

        public ResponseApp ModificarDocente(Tdocente tdocente)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var docenteExistente = context.Tdocente.FirstOrDefault(d => d.CodigoDocente == tdocente.CodigoDocente);

                if (docenteExistente != null)
                {
                    docenteExistente.Titulo = tdocente.Titulo;
                    docenteExistente.Facultad = tdocente.Facultad;
                    docenteExistente.Carrera = tdocente.Carrera;
                    docenteExistente.IdEstado = tdocente.IdEstado;
                    docenteExistente.FModificacion = Utils.timeParsed(DateTime.Now);// DateTime.Now;
                    docenteExistente.UserModificacion = tdocente.UserModificacion;

                    context.SaveChanges();

                    response = Utils.OkResponse(docenteExistente);
                }
                else
                {
                    response = Utils.BadResponse("DOCENTE NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL MODIFICAR DOCENTE: {ex.Message}");
                throw new Exception($"ERROR AL MODIFICAR DOCENTE : {ex.Message}");
            }
            return response;
        }


        public ResponseApp EliminarDocente(string codigoDocente)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var docenteExistente = context.Tdocente.FirstOrDefault(d => d.CodigoDocente == codigoDocente);

                if (docenteExistente != null)
                {
                    context.Tdocente.Remove(docenteExistente);
                    context.SaveChanges();

                    response = Utils.OkResponse(docenteExistente);
                }
                else
                {
                    response = Utils.BadResponse("DOCENTE NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR DOCENTE: {ex.Message}");
                throw new Exception($"ERROR AL ELIMINAR  DOCENTE: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ListarDocentes()
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var listaDocentes = context.Tdocente.ToList();

                response = Utils.OkResponse(listaDocentes);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR DOCENTES: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR DOCENTE: {ex.Message}");
            }
            return response;
        }
        public ResponseApp BuscarDocente(string codigoDocente)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var docente = context.Tdocente.FirstOrDefault(d => d.CodigoDocente == codigoDocente);

                if (docente != null)
                {
                    response = Utils.OkResponse(docente);
                }
                else
                {
                    response = Utils.BadResponse("DOCENTE NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR DOCENTE: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR DOCENTE: {ex.Message}");
            }
            return response;
        }


    }
}
