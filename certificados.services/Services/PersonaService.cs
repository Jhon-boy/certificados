using certificados.models.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace certificados.services.Services
{

    public class PersonaService
    {
        private readonly AppDbContext appDbContext;

        public PersonaService(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }


    }
}
