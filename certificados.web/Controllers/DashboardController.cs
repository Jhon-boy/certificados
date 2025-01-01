using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View("Dashboard"); 
        }

        public IActionResult Inicio()
        {
            return PartialView("~/Views/Inicio/_Home.cshtml");
        }
        public IActionResult Personas()
        {
            return PartialView("~/Views/Mantenimiento/_Personas.cshtml");
        }
        public IActionResult Roles()
        {
            return PartialView("~/Views/Mantenimiento/_Roles.cshtml");
        }
        public IActionResult Grupo()
        {
            return PartialView("~/Views/Mantenimiento/_Grupo.cshtml");
        }
        public IActionResult Docente()
        {
            return PartialView("~/Views/Mantenimiento/_Docente.cshtml");
        }

        public IActionResult Decanato()
        {
            return PartialView("~/Views/Mantenimiento/_Decanatos.cshtml");
        }

        public IActionResult Modalidad()
        {
            return PartialView("~/Views/Mantenimiento/_Modalidad.cshtml");
        }
        public IActionResult Eventos()
        {
            return PartialView("~/Views/Mantenimiento/_TipoEvento.cshtml");
        }        
        public IActionResult Certificados()
        {
            return PartialView("~/Views/Mantenimiento/_Certificados.cshtml");
        }
        public IActionResult Ciclo()
        {
            return PartialView("~/Views/Mantenimiento/_Ciclo.cshtml");
        }
        public IActionResult RegistrarPlanificacion()
        {
            return PartialView("~/Views/Planificacion/_RegistrarPlanificacion.cshtml");
        }
        public IActionResult RegistrarParticipante()
        {
            return PartialView("~/Views/RegistroParticipante/_RegistrarParticipante.cshtml");
        }
        public IActionResult RegistrarFacilitador()
        {
            return PartialView("~/Views/RegistroFacilitador/_RegistrarFacilitador.cshtml");
        }
    }
}
