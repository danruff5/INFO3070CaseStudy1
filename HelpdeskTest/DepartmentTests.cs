using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using HelpdeskDAL;
using System.Collections.Generic;
using MongoDB.Bson;

namespace HelpdeskTest
{
    [TestClass]
    public class DepartmentTests
    {
        [TestMethod]
        public void DepartmentDAOUpdateShouldReturnTrue()
        {
            DepartmentDAO dao = new DepartmentDAO();
            Department dep = dao.GetByID("561ede62f748f236d0200403"); // Sales ID
            dep.DepartmentName = "SALES";
            int rowsUpdated = dao.Update(dep);

            Assert.IsTrue(rowsUpdated == 1);
        }

        [TestMethod]
        public void DepartmentDAOUpdateTwiceShouldReturnNegative2 ()
        {
            DepartmentDAO dao = new DepartmentDAO();

            Department dep1 = dao.GetByID("561ede62f748f236d0200403");
            Department dep2 = dao.GetByID("561ede62f748f236d0200403");

            dep1.DepartmentName = "SALES";
            int rowsUp = dao.Update(dep1);

            dep2.DepartmentName = "Sales";

            if (rowsUp == 1)
                rowsUp = dao.Update(dep2);
            Assert.IsTrue(rowsUp == -2);
        }

        [TestMethod]
        public void DepartmentDAOGetAllShouldReturnList()
        {
            DepartmentDAO dao = new DepartmentDAO();
            List<Department> deps = dao.GetAll();
            Assert.IsTrue(deps.Count > 0);
        }

        [TestMethod]
        public void DepartmntDAOCreateAndDeleteShouldReturnTrue()
        {
            bool deleteOK = false;
            Department dep = new Department();
            DepartmentDAO dao = new DepartmentDAO();

            dep.DepartmentName = "Coder";
            string newid = dao.Create(dep);

            if (newid.Length == 24)
                deleteOK = dao.Delete(newid);

            Assert.IsTrue(deleteOK);
        }
    }
}
