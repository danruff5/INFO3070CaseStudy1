using HelpdeskViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace HelpdeskTest
{
    [TestClass]
    public class DepartmentViewModelTests
    {
       [TestMethod] 
       public void DepartmentVMUpdateShouldReturnTrue()
        {
            DepartmentViewModel vm = new DepartmentViewModel();
            vm.GetById("56201963f748f2338c59a8c3"); // Sales id
            vm.DepartmentName = "SALES";
            int rowsUpdated = vm.Update();

            Assert.IsTrue(rowsUpdated == 1);
        }

        [TestMethod]
        public void DepartmentVMUpdateTwiceShouldReturnNegative2()
        {
            DepartmentViewModel vm1 = new DepartmentViewModel();
            DepartmentViewModel vm2 = new DepartmentViewModel();

            vm1.GetById("56201963f748f2338c59a8c3"); // Sales Id
            vm2.GetById("56201963f748f2338c59a8c3");

            vm1.DepartmentName = "SALES";
            int rowsUpdated = vm1.Update();

            if (rowsUpdated == 1)
                rowsUpdated = vm2.Update();

            Assert.IsTrue(rowsUpdated == -2);
        }

        [TestMethod]
        public void DepartmentVMGetAllShouldReturnList()
        {
            DepartmentViewModel vm = new DepartmentViewModel();
            List<DepartmentViewModel> deps = vm.GetAll();
            Assert.IsTrue(deps.Count > 0);
        }

        [TestMethod]
        public void DepartmentVMCreateAndDeleteShouldReturnTrue()
        {
            bool deleteOK = false;
            DepartmentViewModel vm = new DepartmentViewModel();

            vm.DepartmentName = "Coder";
            vm.Create();

            if (vm.Id.Length == 24)
                deleteOK = vm.Delete();
            Assert.IsTrue(deleteOK);
        }
    }
}
