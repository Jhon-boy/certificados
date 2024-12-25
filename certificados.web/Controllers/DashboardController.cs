using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View("Dashboard"); 
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
    }
}
