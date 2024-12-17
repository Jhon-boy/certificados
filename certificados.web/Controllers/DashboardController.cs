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
    }
}
