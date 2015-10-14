using Microsoft.VisualStudio.TestTools.UnitTesting;
using HelpdeskDAL;
using System.Collections.Generic;

namespace HelpdeskTest
{
    [TestClass]
    public class ProblemTests
    {
        [TestMethod]
        public void ProblemDAOUpdateShouldReturnTrue()
        {
            ProblemDAO dao = new ProblemDAO();
            Problem prb = dao.GetByID("561ede62f748f236d0200411"); // Device not pluged in ID
            prb.Description = "DEVICE NOT PLUGED IN";
            int rowsUpdated = dao.Update(prb);

            Assert.IsTrue(rowsUpdated == 1);
        }

        [TestMethod]
        public void ProblemDAOUpdateTwiceShouldReturnNegative2 ()
        {
            ProblemDAO dao = new ProblemDAO();

            Problem prb1 = dao.GetByID("561ede62f748f236d0200411");
            Problem prb2 = dao.GetByID("561ede62f748f236d0200411");

            prb1.Description = "DEVICE NOT PLUGGED IN";
            int rowsUp = dao.Update(prb1);

            prb2.Description = "Device Not Plugged In";

            if (rowsUp == 1)
                rowsUp = dao.Update(prb2);
            Assert.IsTrue(rowsUp == -2);
        }

        [TestMethod]
        public void ProblemDAOGetAllShouldReturnList()
        {
            ProblemDAO dao = new ProblemDAO();
            List<Problem> prbs = dao.GetAll();
            Assert.IsTrue(prbs.Count > 0);
        }

        [TestMethod]
        public void ProblemDAOCreateAndDeleteShouldReturnTrue()
        {
            bool deleteOK = false;
            Problem prb = new Problem();
            ProblemDAO dao = new ProblemDAO();

            prb.Description = "It Broke";
            string newid = dao.Create(prb);

            if (newid.Length == 24)
                deleteOK = dao.Delete(newid);

            Assert.IsTrue(deleteOK);
        }
    }
}
