using Microsoft.VisualStudio.TestTools.UnitTesting;
using HelpdeskDAL;
using System.Collections.Generic;
using MongoDB.Bson;

namespace HelpdeskTest
{
    [TestClass]
    public class EmployeeTests
    {
        [TestMethod]
        public void EmployeeDAOUpdateShouldReturnTrue()
        {
            EmployeeDAO dao = new EmployeeDAO();
            Employee emp = dao.GetByID("56201441f748f20bb0a3614c"); // Smartypants ID
            emp.Phoneno = "555-555-5551";
            int rowsUpdated = dao.Update(emp);

            Assert.IsTrue(rowsUpdated == 1);
        }

        [TestMethod]
        public void EmployeeDAOUpdateTwiceShouldReturnNegative2 ()
        {
            EmployeeDAO dao = new EmployeeDAO();

            Employee emp1 = dao.GetByID("56201441f748f20bb0a3614c"); // Smartypants Id
            Employee emp2 = dao.GetByID("56201441f748f20bb0a3614c");

            emp1.Phoneno = "555-555-5551";
            int rowsUp = dao.Update(emp1);

            emp2.Phoneno = "555-555-5552";

            if (rowsUp == 1)
                rowsUp = dao.Update(emp2);
            Assert.IsTrue(rowsUp == -2);
        }

        [TestMethod]
        public void EmployeeDAOGetAllShouldReturnList()
        {
            EmployeeDAO dao = new EmployeeDAO();
            List<Employee> emps = dao.GetAll();
            Assert.IsTrue(emps.Count > 0);
        }

        [TestMethod]
        public void EmployeeDAOCreateAndDeleteShouldReturnTrue()
        {
            bool deleteOK = false;
            Employee emp = new Employee();
            EmployeeDAO dao = new EmployeeDAO();

            emp.DepartmentId = new ObjectId("56201441f748f20bb0a36148"); // Sales ID
            emp.Email = "zippo@nothing.com";
            emp.Firstname = "Some";
            emp.Lastname = "Employee";
            emp.Phoneno = "(555)555-5555";
            emp.Title = "Mr.";
            string newid = dao.Create(emp);

            if (newid.Length == 24)
                deleteOK = dao.Delete(newid);

            Assert.IsTrue(deleteOK);
        }
    }
}
