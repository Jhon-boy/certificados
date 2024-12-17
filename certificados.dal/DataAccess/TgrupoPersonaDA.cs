using certificados.models.Context;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.dal.DataAccess
{
    public class TgrupoPersonaDA(AppDbContext appDbContext)
    {
        private readonly AppDbContext context = appDbContext;

        public ResponseApp InsertarGrupoPersona(TgrupoPersona tgrupoPersona)
        {
            ResponseApp response = Utils.BadResponse(null);

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    var trackedEntity = context.ChangeTracker.Entries<Tgrupo>()
                                        .FirstOrDefault(e => e.Entity.IdGrupo == tgrupoPersona.Tgrupo.IdGrupo);

                    if (trackedEntity != null)
                    {
                        context.Entry(trackedEntity.Entity).State = EntityState.Detached;
                    }
                    var trackedPersona = context.ChangeTracker.Entries<Tpersona>()
                        .FirstOrDefault(e => e.Entity.Cedula == tgrupoPersona.Tpersona.Cedula);

                    if (trackedPersona != null)
                    {
                        context.Entry(trackedPersona.Entity).State = EntityState.Detached;
                    }

                    context.Entry(tgrupoPersona.Tgrupo).State = EntityState.Unchanged;
                    context.Entry(tgrupoPersona.Tpersona).State = EntityState.Unchanged;

                    context.TgrupoPersona.Add(tgrupoPersona);
                    context.SaveChanges();
                    transaction.Commit();

                    response = Utils.OkResponse(tgrupoPersona);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    response = Utils.BadResponse($"ERROR AL INSERTAR GRUPO-PERSONA: {ex.Message}");
                    throw new Exception($"ERROR AL INSERTAR GRUPO - PERSONA: {ex.Message}");
                }

                return response;
            }
        }


        public ResponseApp EliminarGrupoPersona(int idGrupoPersona, string cedula)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var grupoPersonaExistente = context.TgrupoPersona.FirstOrDefault(gp => gp.IdGrupoPersona == idGrupoPersona && gp.Tpersona.Cedula ==cedula);

                if (grupoPersonaExistente != null)
                {
                    context.TgrupoPersona.Remove(grupoPersonaExistente);
                    context.SaveChanges();
                    response = Utils.OkResponse(grupoPersonaExistente);
                }
                else
                {
                    response = Utils.BadResponse("RELACIÓN GRUPO-PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL ELIMINAR GRUPO-PERSONA: {ex.Message}");

                throw new Exception($"ERROR AL ELIMINAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }

        public ResponseApp ListarGrupoPersonas()
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            {
                var listaGrupoPersonas = context.TgrupoPersona
                    .Include(gp => gp.Tgrupo)
                    .Include(gp => gp.Tpersona)
                    .ToList();

                response = Utils.OkResponse(listaGrupoPersonas);
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL LISTAR GRUPO-PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }

        public ResponseApp BuscarGrupoPersona(int idGrupoPersona)
        {
            ResponseApp response = Utils.BadResponse(null);
            try
            { 
                var grupoPersona = context.TgrupoPersona
                    .Include(gp => gp.Tgrupo)
                    .Include(gp => gp.Tpersona)
                    .Where(gp => gp.Tgrupo.IdGrupo == idGrupoPersona).ToList();

                if (grupoPersona != null)
                {
                    response = Utils.OkResponse(grupoPersona);
                }
                else
                {
                    response = Utils.BadResponse("RELACIÓN GRUPO-PERSONA NO EXISTE");
                }
            }
            catch (Exception ex)
            {
                response = Utils.BadResponse($"ERROR AL BUSCAR GRUPO-PERSONA: {ex.Message}");
                throw new Exception($"ERROR AL BUSCAR GRUPO - PERSONA: {ex.Message}");
            }
            return response;
        }

        public ResponseApp BuscarCedulaIdGrupo(int id, string cedula) {


            ResponseApp response = Utils.BadResponse(null);

            try
            {
                // Buscar la relación por su ID y cedula
                var grupoPersona = context.TgrupoPersona
            .Include(gp => gp.Tgrupo)
            .Include(gp => gp.Tpersona)
            .FirstOrDefault(e => e.Tpersona.Cedula == cedula && e.Tgrupo.IdGrupo == id);
                if (grupoPersona != null) {
                    response = Utils.OkResponse(grupoPersona);
                }
                else
                {
                    response = Utils.BadResponse("RELACIÓN GRUPO-PERSONA NO EXISTE");
                }
            }
            catch (Exception ex) {

                response = Utils.BadResponse($"ERROR AL LISTAR A LA PERSONA ${cedula} con el GRUPO: {id}, error: {ex.Message}");
                throw new Exception($"ERROR AL LISTAR A LA PERSONA ${cedula} con el GRUPO: {id}, error: {ex.Message}");
            }

            return response;
        }
    }
}
