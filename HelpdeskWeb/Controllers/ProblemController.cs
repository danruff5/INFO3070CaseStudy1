using HelpdeskViewModels;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace HelpdeskWeb.Controllers
{
    public class ProblemController : ApiController
    {
        [Route("api/problems")]
        public IHttpActionResult Get()
        {
            try
            {
                ProblemViewModel prb = new ProblemViewModel();
                List<ProblemViewModel> allProblems = prb.GetAll();
                return Ok(allProblems);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/problem/{id}")]
        public IHttpActionResult Get(string id)
        {
            try
            {
                ProblemViewModel prb = new ProblemViewModel();
                prb.GetById(id);
                return Ok(prb);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/problem/{id}")]
        public IHttpActionResult Delete(string id)
        {
            try
            {
                ProblemViewModel prb = new ProblemViewModel();
                prb.GetById(id);
                if (prb.Delete())
                    return Ok("Problem " + prb.Description + " deleted.");
                else
                    return BadRequest("Could not delete");
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/problem")]
        public IHttpActionResult Post(ProblemViewModel prb)
        {
            try
            {
                prb.Create();
                return Ok("Problem " + prb.Description + " Created");
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }

        [Route("api/problem")]
        public IHttpActionResult Put(ProblemViewModel prb)
        {
            try
            {
                int errorNumber = prb.Update();
                switch (errorNumber)
                {
                    case 1:
                        return Ok("Problem " + prb.Description + " updated!");
                    case -1:
                        return Ok("Problem" + prb.Description + " not updated!");
                    case -2:
                        return Ok("Data is stale for " + prb.Description + ". Problem not updated!");
                    default:
                        return Ok("Problem" + prb.Description + " not updated!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }
    }
}
