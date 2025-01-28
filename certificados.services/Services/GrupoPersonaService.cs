using certificados.dal.DataAccess;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.services.Services
{
    public class GrupoPersonaService
    {
        private readonly TgrupoPersonaDA tgrupoPersonaDA;

        public GrupoPersonaService(TgrupoPersonaDA grupoDA) { 
        
            this.tgrupoPersonaDA = grupoDA;
        }

        public ResponseApp InsertarPersona(TgrupoPersona grupoPersonaDTO) {

            return tgrupoPersonaDA.InsertarGrupoPersona(grupoPersonaDTO);

        }
        public ResponseApp ListarGrupo() { 
        
        return tgrupoPersonaDA.ListarGrupoPersonas();
        }

        public ResponseApp BuscarById(int id, bool estado = false) { 
            return tgrupoPersonaDA.BuscarGrupoPersona(id, estado);
        }
        public ResponseApp BuscarCedulaId(int id, string cedula) { 
            return tgrupoPersonaDA.BuscarCedulaIdGrupo(id, cedula);
        }

        public ResponseApp EliminarGrupo(int id, string cedula) {
            return tgrupoPersonaDA.EliminarGrupoPersona(id,  cedula);
        }
        public ResponseApp AprobarGrupos(List<String> cedulas, int id) { 
            return tgrupoPersonaDA.AprobarGruposPersonas(cedulas, id);
        }
    }
}
