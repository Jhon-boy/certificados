using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace certificados.models.Entitys.auditoria
{
    [Table("TFORMATOCERTIFICADO", Schema = "auditoria")]
    public class TformatoCertificadoAuditoria
    {
        [Key]
        [Column("IDFORMATO")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idFormato { get; set; }

        [Column("LOGOUNIVERSIDAD")]
        public byte[]? LogoUniversidad { get; set; }

        [Column("LOGOSECUNDARIO")]
        public byte[]? LogoSecundario { get; set; }

        [Column("MARCAAGUA")]
        public byte[]? MarcarAgua { get; set; }

        [Column("QR")]
        public byte[]? Qr { get; set; }

        [Column("FCREACION")]
        public DateTime FCreacion { get; set; }

        [Column("FMODIFICACION")]
        public DateTime FModificacion { get; set; }

        [Column("USUARIOINGRESO")]
        [StringLength(5)]
        public string? UsuarioIngreso { get; set; }

        [Column("USUARIOACTUALIZACION")]
        [StringLength(5)]
        public string? UsuarioActualizacion { get; set; }

    }
}
