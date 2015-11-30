using HelpdeskViewModels;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace HelpdeskWeb.Controllers
{
    public class DepartmentController : ApiController
    {
        [Route("api/departments")]
        public IHttpActionResult Get()
        {
            try
            {
                DepartmentViewModel dep = new DepartmentViewModel();
                List<DepartmentViewModel> allDepartments = dep.GetAll();
                return Ok(allDepartments);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/department/{id}")]
        public IHttpActionResult Get(string id)
        {
            try
            {
                DepartmentViewModel dep = new DepartmentViewModel();
                dep.GetById(id);
                return Ok(dep);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/department/{id}")]
        public IHttpActionResult Delete(string id)
        {
            try
            {
                DepartmentViewModel dep = new DepartmentViewModel();
                dep.GetById(id);

                bool deleteOk = dep.Delete();
                if (deleteOk)
                    return Ok(dep.DepartmentName + " deleted.");
                else 
                    return BadRequest("Could not delete");
            }
            catch (Exception ex)
            {
                return BadRequest("Delete failed - " + ex.Message);
            }
        }

        [Route("api/department")]
        public IHttpActionResult Put(DepartmentViewModel dep)
        {
            try
            {
                int errorNumber = dep.Update();
                switch (errorNumber)
                {
                    case 1:
                        return Ok("Department " + dep.DepartmentName + " updated!");
                    case -1:
                        return Ok("Department" + dep.DepartmentName + " not updated!");
                    case -2:
                        return Ok("Data is stale for " + dep.DepartmentName + ". Department not updated!");
                    default:
                        return Ok("Department" + dep.DepartmentName + " not updated!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }

        [Route("api/department")]
        public IHttpActionResult Post(DepartmentViewModel dep)
        {
            try
            {
                dep.Create();
                return Ok("Department " + dep.DepartmentName + " Created");
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }
    }
}
