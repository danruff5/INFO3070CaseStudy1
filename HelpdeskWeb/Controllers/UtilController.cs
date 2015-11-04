using HelpdeskViewModels;
using System;
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
    }
}
