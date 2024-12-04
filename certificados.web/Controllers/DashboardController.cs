using Microsoft.AspNetCore.Mvc;

namespace certificados.web.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View("Dashboard"); 
        }
    }
}
