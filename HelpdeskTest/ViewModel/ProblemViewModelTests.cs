using HelpdeskViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace HelpdeskTest
{
    [TestClass]
    public class ProblemViewModelTests
    {
       [TestMethod] 
       public void ProblemVMUpdateShouldReturnTrue()
        {
            ProblemViewModel vm = new ProblemViewModel();
            vm.GetById("56201963f748f2338c59a8d1"); // Device not plugged in id
            vm.Description = "DEVICE NOT PLUGGED IN";
            int rowsUpdated = vm.Update();

            Assert.IsTrue(rowsUpdated == 1);
        }

        [TestMethod]
        public void ProblemVMUpdateTwiceShouldReturnNegative2()
        {
            ProblemViewModel vm1 = new ProblemViewModel();
            ProblemViewModel vm2 = new ProblemViewModel();

            vm1.GetById("56201963f748f2338c59a8d1"); // Device not plugged in Id
            vm2.GetById("56201963f748f2338c59a8d1");

            vm1.Description = "DEVICE NOT PLUGGED IN";
            int rowsUpdated = vm1.Update();

            if (rowsUpdated == 1)
                rowsUpdated = vm2.Update();

            Assert.IsTrue(rowsUpdated == -2);
        }

        [TestMethod]
        public void ProblemVMGetAllShouldReturnList()
        {
            ProblemViewModel vm = new ProblemViewModel();
            List<ProblemViewModel> prbs = vm.GetAll();
            Assert.IsTrue(prbs.Count > 0);
        }

        [TestMethod]
        public void ProblemsVMCreateAndDeleteShouldReturnTrue()
        {
            bool deleteOK = false;
            ProblemViewModel vm = new ProblemViewModel();

            vm.Description = "It Broke";
            vm.Create();

            if (vm.Id.Length == 24)
                deleteOK = vm.Delete();
            Assert.IsTrue(deleteOK);
        }
    }
}
