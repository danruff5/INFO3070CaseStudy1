using Microsoft.VisualStudio.TestTools.UnitTesting;
using HelpdeskDAL;

namespace HelpdeskTest
{
    [TestClass]
    public class ResetTests
    {
        [TestMethod]
        public void ReCreateDatabase()
        {
            DALUtils dal = new DALUtils();
            Assert.IsTrue(dal.LoadCollections());
        }
    }
}
