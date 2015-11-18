using HelpdeskViewModels;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace HelpdeskWeb.Controllers
{
    public class EmployeeController : ApiController
    {
        [Route("api/employees")]
        public IHttpActionResult Get()
        {
            try
            {
                EmployeeViewModel emp = new EmployeeViewModel();
                List<EmployeeViewModel> allEmployees = emp.GetAll();
                return Ok(allEmployees);
            } catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/employee/{id}")]
        public IHttpActionResult Get(string id)
        {
            try
            {
                EmployeeViewModel emp = new EmployeeViewModel();
                emp.GetById(id);
                return Ok(emp);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/employee/{id}")]
        public IHttpActionResult Delete(string id)
        {
            try
            {
                EmployeeViewModel emp = new EmployeeViewModel();
                emp.GetById(id);
                if (emp.Delete())
                    return Ok("Employee Deleted");
                else
                    return BadRequest("Could not delete");
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/employee")]
        public IHttpActionResult Put(EmployeeViewModel emp)
        {
            try
            {
                int errorNumber = emp.Update();
                switch (errorNumber)
                {
                    case 1:
                        return Ok("Employee " + emp.Lastname + " updated!");
                    case -1:
                        return Ok("Employee" + emp.Lastname + " not updated!");
                    case -2:
                        return Ok("Data is stale for " + emp.Lastname + ". Employee not updated!");
                    default:
                        return Ok("Employee" + emp.Lastname + " not updated!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }

        [Route("api/employee")]
        public IHttpActionResult Post(EmployeeViewModel emp)
        {
            try
            {
                emp.Create();
                return Ok("Employee " + emp.Lastname + " Created");
            } catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }
    }
}
