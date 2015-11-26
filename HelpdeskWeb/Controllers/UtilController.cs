using HelpdeskViewModels;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace HelpdeskWeb.Controllers
{
    public class UtilController : ApiController
    {
        [Route("api/util")]
        public IHttpActionResult Delete()
        {
            try
            {
                ViewModelUtils util = new ViewModelUtils();
                return Ok(util.LoadCollections());
            } catch (Exception ex)
            {
                return BadRequest("Load Failed - " + ex.Message);
            }
        }

        [Route("api/employees/tech")]
        public IHttpActionResult Get()
        {
            try
            {
                EmployeeViewModel emp = new EmployeeViewModel();
                List<EmployeeViewModel> allEmployees = emp.GetAllTech();
                return Ok(allEmployees);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }
    }
}
