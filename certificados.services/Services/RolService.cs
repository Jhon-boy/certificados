using certificados.dal.DataAccess;
using certificados.models.Context;
using certificados.models.Entitys.dbo;

namespace certificados.services.Services
{
    public class RolService
    {
        private readonly AppDbContext appDbContext;

        public RolService(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public bool crearRol(Trol rolEntidad)
        {
            TrolDA rolDA = new TrolDA(appDbContext);
            try
            {
                rolDA.insertarRol(rolEntidad);
                return true;
            }
            catch (Exception ex)
            {
                ex.GetBaseException();
                return false;
            }
        }

        public bool actualizarRol(Trol rolEntidad)
        {
            TrolDA rolDA = new TrolDA(appDbContext);
            try
            {
                rolDA.modificarRol(rolEntidad);
                return true;
            }
            catch (Exception ex)
            {
                ex?.GetBaseException();
                return false;
            }
        }

        public Trol buscarRol(int idRol)
        {
            TrolDA rolDA = new TrolDA(appDbContext);
            try
            {
                return rolDA.buscarRol(idRol);
            }
            catch (Exception ex)
            {
                ex?.GetBaseException();
                return null;
            }
        }

        public List<Trol>? listarRol()
        {
            TrolDA rolDA = new TrolDA(appDbContext);
            try
            {
                return rolDA.listarRol();
            }
            catch (Exception ex)
            {
                ex.GetBaseException();
                return null;
            }
        }

        public bool eliminarRol(Trol rolEntidad)
        {
            TrolDA rolDA = new TrolDA(appDbContext);
            try
            {
                rolDA.eliminarRol(rolEntidad);
                return true;
            }
            catch (Exception ex)
            {
                ex.GetBaseException();
                return false;
            }
        }
    }


}
