using System.ComponentModel.DataAnnotations;

namespace certificados.web.Models.DTO
{
    public class PersonaDTO
    {
        //Crear persona
        [Required]
        [StringLength(10, ErrorMessage = "La cédula no puede tener más de 10 caracteres.")]
        public required string Cedula { get; set; }

        [Required]
        [StringLength(35, ErrorMessage = "Los nombres no pueden tener más de 30 caracteres.")]
        public required string Nombres { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "Los apellidos no pueden tener más de 30 caracteres.")]
        public required string Apellidos { get; set; }

        [Required]
        [Range(0, 120, ErrorMessage = "La edad debe estar entre 0 y 120 años.")]
        public int Edad { get; set; }

        [Required]
        [StringLength(1, ErrorMessage = "El género debe ser un carácter.")]
        public required string Genero { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "El usuario que realiza el ingreso no puede exceder los 100 caracteres.")]
        public required string UsuarioIngreso { get; set; }
        [StringLength(100, ErrorMessage = "El usuario que realiza el ingreso no puede exceder los 100 caracteres.")]
        public required string UsuarioActualizacion { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "El usuario que realiza el ingreso no puede exceder los 100 caracteres.")]
        public required string email { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "El usuario que realiza el ingreso no puede exceder los 100 caracteres.")]
        public required string clave { get; set; }
        [Required]
        public int idRol { get; set; }

        [StringLength(3, ErrorMessage = "El estado que realiza el ingreso no puede exceder los 3 caracteres.")]
        public string? estado { get; set; }
    }
}
