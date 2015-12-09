using HelpdeskViewModels;
using System;
using System.Collections.Generic;
using System.Web.Http;

// Controllers for interacting with the call
namespace HelpdeskWeb.Controllers
{
    // Get all calls
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

        // Get a call from an id.
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

        // Delete the call from an id.
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

        // Update a call from a call view model.
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

        // Cerate a call from a call view model
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
