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
        public IActionResult Grupo()
        {
            return PartialView("~/Views/Mantenimiento/_Grupo.cshtml");
        }

        public IActionResult Decanato()
        {
            return PartialView("~/Views/Mantenimiento/_Decanatos.cshtml");
        }

        public IActionResult Modalidad()
        {
            return PartialView("~/Views/Mantenimiento/_Modalidad.cshtml");
        }
        public IActionResult TipoEvento()
        {
            return PartialView("~/Views/Mantenimiento/_TipoEvento.cshtml");
        }
        public IActionResult Ciclo()
        {
            return PartialView("~/Views/Mantenimiento/_Ciclo.cshtml");
        }
        public IActionResult Planificacion()
        {
            return PartialView("~/Views/Planificacion/_GestionPlanificacion.cshtml");
        }
        public IActionResult Registro()
        {
            return PartialView("~/Views/Registro/_RegistrarFacilitadorParticipante.cshtml");
        }
    }
}
