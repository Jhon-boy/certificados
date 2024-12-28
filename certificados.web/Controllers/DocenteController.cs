using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Services;
using certificados.services.Utils;
using certificados.web.Controllers.Mappers;
using certificados.web.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    /**
    * Controlador dedicado la entidad de TDOCENTE
    */
    [Route("api/docente")]
    public class DocenteController : Controller
    {
        private readonly DocenteService docenteService;
        private readonly EstadoDocenteService estadoDocenteService;
        private readonly PersonaService personaService;

        public DocenteController(DocenteService docenteService, PersonaService personaService, EstadoDocenteService estadoDocenteService) { 
        
            this.docenteService = docenteService;
            this.personaService = personaService;
            this.estadoDocenteService = estadoDocenteService;
        }

        /*
          * Endpoint para crear un DOCENTE
          */
        [HttpPost("crear")]
        public ActionResult<ResponseApp> crearDocente([FromBody] DocenteDTO tdocente) {
            if (tdocente == null) {

                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }
            var estadoResponse = estadoDocenteService.ListarById(tdocente.IdEstado);
            var personaResponse = personaService.ObtenerPersona(tdocente.Cedula);

            if (!estadoResponse.Cod.Equals(CONSTANTES.COD_OK) || !personaResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return BadRequest(Utils.BadResponse("NO EXISTE INFORMACIÓN DEL ESTADO O PERSONA"));
            }
            Tpersona persona = PersonaMapper.toEntity(personaResponse.Data);
            TestadoDocente estadoDocente = EstadoDocenteMapper.toEntity(estadoResponse.Data);
            //sino transformar en mis entidades

            return Ok(docenteService.CrearDocente(DocenteMapper.toEntityCreate(tdocente, estadoDocente, persona)));
        }

        /*
          * Endpoint para MODIFICAR un DOCENTE
          */
        [HttpPost("modificar")]
        public ActionResult<ResponseApp> modificarDocente([FromBody]  Tdocente tdocente)
        {
            if (tdocente == null)
            {

                return BadRequest(Utils.BadResponse(CONSTANTES.MESSAGE_DATA_ERRORS));
            }
            var estadoResponse = estadoDocenteService.ListarById(tdocente.IdEstado);
            var personaResponse = personaService.ObtenerPersona(tdocente.Cedula);

            if (!estadoResponse.Cod.Equals(CONSTANTES.COD_OK) || !personaResponse.Cod.Equals(CONSTANTES.COD_OK))
            {
                return BadRequest(Utils.BadResponse("NO EXISTE INFORMACIÓN DEL ESTADO O PERSONA"));
            }
            Tpersona persona = PersonaMapper.toEntity(personaResponse.Data);
            TestadoDocente estadoDocente = EstadoDocenteMapper.toEntity(estadoResponse.Data);

            return Ok(docenteService.CrearDocente(DocenteMapper.toEntityUpdate(tdocente, estadoDocente, persona)));
        }

        /*
         * Endpoint para LISTATAR DOCENTE
         */
        [HttpGet("all")]
        public ActionResult<ResponseApp> obtenerDocentes() { 
            return Ok(docenteService.ListarDocentes());
        }

        /*
        * Endpoint para OBTENER un DOCENTE
        */
        [HttpPost("id")]
        public ActionResult<ResponseApp> obtenerDocenteById([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idDocente", out var idDocenteObj) || idDocenteObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            string codigoDocente = idDocenteObj.ToString();
            return Ok(docenteService.ObtenerDocentesById(codigoDocente));
        }

        /*
       * Endpoint para ELIMINAR un DOCENTE
       */
        [HttpPost("eliminar")]
        public ActionResult<ResponseApp> eliminarDocenteById([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("idDocente", out var idDocenteObj) || idDocenteObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            string codigoDocente = idDocenteObj.ToString();
            return Ok(docenteService.ElminarDocente(codigoDocente));
        }

        /*
         * Endpoint para OBTENER un DOCENTE
         */
        [HttpPost("cedula")]
        public ActionResult<ResponseApp> obtenerDocenteByCedula([FromBody] Dictionary<string, object> request)
        {
            if (!request.TryGetValue("cedula", out var cedulaObj) || cedulaObj == null)
            {
                return BadRequest(Utils.BadResponse("FALTAN PARAMETROS"));
            }
            string cedula = cedulaObj.ToString();
            return Ok(docenteService.ObtenerDocentesByCedula(cedula));
        }
    }
}
