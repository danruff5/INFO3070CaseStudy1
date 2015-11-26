using HelpdeskDAL;
using HelpdeskViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Diagnostics;

namespace HelpdeskTest.DAO
{
    [TestClass]
    public class CallTests
    {
        private TestContext testContextInstance;

        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        [TestMethod]
        public void CallDAOComprehensiveTestsReturnTrue()
        {
            CallDAO dao = new CallDAO();
            Call call = new Call();
            call.DateOpened = DateTime.Now;
            call.DateClosed = null;
            call.OpenStatus = true;

            EmployeeDAO empDAO = new EmployeeDAO();
            Employee emp = empDAO.GetBySurname("Smartypants");
            call.EmployeeId = emp._id; // Bigshot

            emp = empDAO.GetBySurname("Burner");
            call.TechId = emp._id; // Burner

            ProblemDAO prbDAO = new ProblemDAO();
            Problem prb = prbDAO.GetByName("Memory Failure");
            call.ProblemId = prb._id; // Memory
            call.Notes = "Bigshot has bad RAM, Burner to fix it";
            string newId = dao.Create(call);
            this.testContextInstance.WriteLine("New Call Id == " + newId);
            call = dao.GetByID(newId);
            this.testContextInstance.WriteLine("Call Retrived");
            call.Notes += "\nOrdered new RAM";

            if (dao.Update(call) == 1)
                this.testContextInstance.WriteLine("Call was Updated " + call.Notes);
            else
                Trace.WriteLine("Call was not updated");

            if (dao.Delete(newId))
                this.testContextInstance.WriteLine("Call was Deleted");
            else
                this.testContextInstance.WriteLine("Call was NOT Deleted");

            call = dao.GetByID(newId);
            Assert.IsNull(call);
        }

        [TestMethod]
        [ExpectedException(typeof(MongoDB.Driver.MongoException), "No Id exists")]
        public void CallViewModelComprehensiveTestsReturnTrue()
        {
            CallViewModel vm = new CallViewModel();
            vm.DateOpened = DateTime.Now;
            vm.OpenStatus = true;
            vm.EmployeeId = "564cf91ff748f159c054a7e8"; // Bigshot
            vm.TechId = "564cf91ff748f159c054a7ee"; // Burner
            vm.ProblemId = "56310886f748f046449d8be9"; // Memory
            vm.Notes = "Bigshot has bad RAM, Burner to fix it";
            vm.Create();
            this.testContextInstance.WriteLine("New Call Id == " + vm.Id);
            vm.GetById(vm.Id);
            this.testContextInstance.WriteLine("Call Retrieved");
            vm.Notes += "\nOrdered new RAM";

            if (vm.Update() == 1)
                this.testContextInstance.WriteLine("Call was Updated " + vm.Notes);
            else
                Trace.WriteLine("Call was NOT Updated");

            if (vm.Delete())
                this.testContextInstance.WriteLine("Call was Deleted");
            else
                this.testContextInstance.WriteLine("Call was NOT Deleted");

            vm.Update(); // Should throw MongoException, See attribute.
        }

        [TestMethod]
        public void InsertSomeCallsForTesting()
        {
            CallDAO dao = new CallDAO();
            Call call = new Call();
            call.DateOpened = DateTime.Now;
            call.DateClosed = null;
            call.OpenStatus = true;

            EmployeeDAO empDAO = new EmployeeDAO();
            Employee emp = empDAO.GetBySurname("Smartypants");
            call.EmployeeId = emp._id; // Bigshot

            emp = empDAO.GetBySurname("Burner");
            call.TechId = emp._id; // Burner

            ProblemDAO prbDAO = new ProblemDAO();
            Problem prb = prbDAO.GetByName("Memory Failure");
            call.ProblemId = prb._id; // Memory
            call.Notes = "Bigshot has bad RAM, Burner to fix it";
            string newId = dao.Create(call);
            this.testContextInstance.WriteLine("New Call Id == " + newId);
            call = dao.GetByID(newId);
            this.testContextInstance.WriteLine("Call Retrived");
            call.Notes += "\nOrdered new RAM";

            if (dao.Update(call) == 1)
                this.testContextInstance.WriteLine("Call was Updated " + call.Notes);
            else
                Trace.WriteLine("Call was not updated");

            Call call1 = new Call();
            call1.DateOpened = DateTime.Now;
            call1.DateClosed = null;
            call1.OpenStatus = true;
            emp = empDAO.GetBySurname("Andmirrors");
            call1.EmployeeId = emp._id; // Andmirrors

            emp = empDAO.GetBySurname("Burner");
            call1.TechId = emp._id; // Burner

            prb = prbDAO.GetByName("Device Not Plugged In");
            call1.ProblemId = prb._id; // Not Plugged in
            call1.Notes = "Smoke did not plug in device";
            newId = dao.Create(call1);
        }
    }
}
