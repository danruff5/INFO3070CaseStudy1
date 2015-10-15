using HelpdeskViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace HelpdeskTest
{
    [TestClass]
    public class EmployeeViewModelTests
    {
       [TestMethod] 
       public void EmployeeVMUpdateShouldReturnTrue()
        {
            EmployeeViewModel vm = new EmployeeViewModel();
            vm.GetById("56201963f748f2338c59a8c7"); // Smartypants id
            vm.Phoneno = "555-555-5551";
            int rowsUpdated = vm.Update();

            Assert.IsTrue(rowsUpdated == 1);
        }

        [TestMethod]
        public void EmployeeVMUpdateTwiceShouldReturnNegative2()
        {
            EmployeeViewModel vm1 = new EmployeeViewModel();
            EmployeeViewModel vm2 = new EmployeeViewModel();

            vm1.GetById("56201963f748f2338c59a8c7"); // Smartypants Id
            vm2.GetById("56201963f748f2338c59a8c7");

            vm1.Phoneno = "555-555-5551";
            int rowsUpdated = vm1.Update();

            if (rowsUpdated == 1)
                rowsUpdated = vm2.Update();

            Assert.IsTrue(rowsUpdated == -2);
        }

        [TestMethod]
        public void EmployeeVMGetAllShouldReturnList()
        {
            EmployeeViewModel vm = new EmployeeViewModel();
            List<EmployeeViewModel> emps = vm.GetAll();
            Assert.IsTrue(emps.Count > 0);
        }

        [TestMethod]
        public void EmployeeVMCreateAndDeleteShouldReturnTrue()
        {
            bool deleteOK = false;
            EmployeeViewModel vm = new EmployeeViewModel();

            vm.DepartmentId = "56201963f748f2338c59a8c3"; // Sales Id
            vm.Email = "zippo@nothing.com";
            vm.Firstname = "Some";
            vm.Lastname = "Employee";
            vm.Phoneno = "(555)555-5555";
            vm.Title = "Mr.";
            vm.Create();

            if (vm.Id.Length == 24)
                deleteOK = vm.Delete();
            Assert.IsTrue(deleteOK);
        }
    }
}
