using HelpdeskViewModels;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace HelpdeskWeb.Controllers
{
    public class CallController : ApiController
    {
        [Route("api/calls")]
        public IHttpActionResult Get()
        {
            try
            {
                CallViewModel call = new CallViewModel();
                List<CallViewModel> allCalls = call.GetAll();
                return Ok(allCalls);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/call/{id}")]
        public IHttpActionResult Get(string id)
        {
            try
            {
                CallViewModel call = new CallViewModel();
                call.GetById(id);
                return Ok(call);
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/call/{id}")]
        public IHttpActionResult Delete(string id)
        {
            try
            {
                CallViewModel call = new CallViewModel();
                call.GetById(id);
                if (call.Delete())
                    return Ok("Call " + call.Id + " Deleted");
                else
                    return BadRequest("Could not delete");
            }
            catch (Exception ex)
            {
                return BadRequest("Retrive failed - " + ex.Message);
            }
        }

        [Route("api/call")]
        public IHttpActionResult Put(CallViewModel call)
        {
            try
            {
                int errorNumber = call.Update();
                switch (errorNumber)
                {
                    case 1:
                        return Ok("Call updated!");
                    case -1:
                        return Ok("Call not updated!");
                    case -2:
                        return Ok("Data is stale for Call. Employee not updated!");
                    default:
                        return Ok("Call not updated!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }

        [Route("api/call")]
        public IHttpActionResult Post(CallViewModel call)
        {
            try
            {
                call.Create();
                return Ok("Call Created");
            }
            catch (Exception ex)
            {
                return BadRequest("Update failed - " + ex.Message);
            }
        }
    }
}
