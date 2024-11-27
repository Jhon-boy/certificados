using Azure;
using certificados.dal.DataAccess;
using certificados.models.Entitys;
using certificados.models.Entitys.dbo;
using certificados.services.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.services.Services
{
    public class UsuarioService
    {
        private readonly TusuarioDA usuarioAcces;
        private readonly PersonaService personaService;

        public UsuarioService(TusuarioDA tusuarioDA, PersonaService personaService)
        {
            usuarioAcces = tusuarioDA;
            this.personaService = personaService;
        }

        public ResponseApp LoginUsuario(String email, String password)
        {
            ResponseApp response = Utils.Utils.BadResponse(null);
            try
            {
                var responseUsuario = usuarioAcces.BuscarPorEmail(email);

                if (!responseUsuario.Cod.Equals(CONSTANTES.COD_OK) || responseUsuario.Data is not Tusuario usuario)
                {
                    response.Message = "USUARIO NO EXISTE";
                    return response;
                }

                if (usuario.Clave != password || usuario.Estado != "ACT")
                {
                    response.Message = usuario.Estado != "ACT" ? "USUARIO NO ESTA ACTIVO" : "CREDENCIALES INVALIDAS";
                    return response;
                }
                var usuarioResponse = personaService.ObtenerPersona(usuario.Cedula);

                if (usuarioResponse.Cod.Equals(CONSTANTES.COD_OK)) { 
                 //response = Utils.Utils.OkResponse(usuario);
                 Dictionary<String, Object> data = new Dictionary<String, Object>();

                    data.Add("USUARIO", usuario);
                    data.Add("PERSONA", usuarioResponse.Data);
                    response = Utils.Utils.OkResponse(data);
                }
                else
                {
                    response.Message = "NO SE PUDO OBTENER LA PERSONA ASOCIADA";
                }

            }
            catch (Exception ex)
            {
                response.Message = $"ERROR AL PROCESAR EL LOGIN: {ex.Message}";
                throw new Exception($"ERROR AL PROCESAR EL LOGIN: {ex.Message}", ex);
            }

            return response;
        }

        public ResponseApp CrearUsuario(Tusuario usuario)
        {
            ResponseApp response = Utils.Utils.BadResponse(null);
            try
            {
                if (string.IsNullOrEmpty(usuario.Email) || string.IsNullOrEmpty(usuario.Clave))
                {
                    response.Message = "EMAIL Y CONTRASEÑA SON OBLIGATORIOS";
                    return response;
                }
                var responseUsuarioExistente = usuarioAcces.BuscarPorEmail(usuario.Email);
                if (responseUsuarioExistente.Cod.Equals(CONSTANTES.COD_OK))
                {
                    response.Message = "NO SE PUEDE REGISTRAR AL USUARIO";
                    return response;
                }

                response = usuarioAcces.InsertarUsuario(usuario);

            }
            catch (Exception ex)
            {
                response.Message = $"ERROR AL PROCESAR AL REGISTRAR USUARIO: {ex.Message}";
                throw new Exception($"ERROR AL PROCESAR AL REGISTRAR USUARIO: {ex.Message}", ex);

            }
            return response;
        }

        public ResponseApp EliminarUsuario(String cedula) {
            ResponseApp response = Utils.Utils.BadResponse(null);

            try
            {
                var usuarioExiste = usuarioAcces.BuscarUsuarioByCedula(cedula);
                if (!usuarioExiste.Cod.Equals(CONSTANTES.COD_OK)) {

                    response.Message = "USUARIO NO EXISTE";
                    return response;
                }

                response = usuarioAcces.EliminarUsuario(cedula);

            }
            catch (Exception ex) {
                response.Message = $"ERROR AL eliminar USUARIO: {ex.Message}";
                throw new Exception($"ERROR AL elminar USUARIO: {cedula}", ex);
            }

            return response;
        
        }

        public ResponseApp ModificarUsuario(Tusuario tusuario) {
            ResponseApp response = Utils.Utils.BadResponse(null);

            try
            {
                var usuarioExiste = usuarioAcces.BuscarPorEmail(tusuario.Email);
                if (!usuarioExiste.Cod.Equals(CONSTANTES.COD_OK))
                {
                    response.Message = "USUARIO NO EXISTE";
                    return response;
                }
                var responseUsuarioExistente = usuarioAcces.BuscarPorEmail(tusuario.Email);
                if (responseUsuarioExistente.Cod.Equals(CONSTANTES.COD_OK))
                {
                    response.Message = "NO SE PUEDE ACTUALIZAR AL USUARIO";
                    return response;
                }

                response = usuarioAcces.ModificarUsuario(tusuario);
            }
            catch (Exception ex) {
                response.Message = $"ERROR AL MODIFICAR USUARIO: {ex.Message}";
                throw new Exception($"ERROR AL MODIFICAR USUARIO: {tusuario.idUsuario}", ex);

            }
            return response;

        }
        public ResponseApp ListarUsuario() { 
        
            return usuarioAcces.ListarUsuario();
        }

        public ResponseApp BuscarUsuarioId(String email) {
            ResponseApp response = Utils.Utils.BadResponse(null);

            try
            {
                var usuarioExiste = usuarioAcces.BuscarPorEmail(email);
                if (!usuarioExiste.Cod.Equals(CONSTANTES.COD_OK)) {

                    response.Message = "USUARIO NO EXISTE";
                    return response;
                }
                response = usuarioExiste;
            }
            catch (Exception ex) {
                response.Message = $"ERROR AL BUSCAR USUARIO: {ex.Message}";
                throw new Exception($"ERROR AL BUSCAR USUARIO: {email}", ex);
            }

            return response;
        }
    }
}
