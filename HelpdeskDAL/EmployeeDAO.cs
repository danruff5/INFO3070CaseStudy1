using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    // An employee data access object for interacting with the database using employee objects
    public class EmployeeDAO
    {
        // Get all of the employee information based on the lastname
        public Employee GetBySurname(string name)
        {
            Employee retEmp = null;
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retEmp = _ctx.Employees.FirstOrDefault(e => e.Lastname == name);
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "GetBySurname");
            }

            return retEmp;
        }

        // Get all of the employee information based on the id.
        public Employee GetByID(string id)
        {
            Employee retEmp = null;
            ObjectId ID = new ObjectId(id);
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retEmp = _ctx.Employees.FirstOrDefault(e => e._id == ID);
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "GetById");
            }

            return retEmp;
        }

        // Get all of the employees from the database
        public List<Employee> GetAll()
        {
            List<Employee> allEmps = new List<Employee>();

            try
            {
                DbContext ctx = new DbContext();
                allEmps = ctx.Employees.ToList();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "GetAll");
            }

            return allEmps;
        }

        // Get all of the tech from the database.
        public List<Employee> GetAllTech()
        {
            List<Employee> techEmps = new List<Employee>();

            try
            {
                DbContext ctx = new DbContext();
                techEmps = ctx.Employees.Where(e => e.IsTech).ToList();
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "GetAllTech");
            }

            return techEmps;
        }

        // Update the employee based on the given employee object.
        public int Update(Employee emp)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Employee>(emp, "employees");
                update = 1;
            }
            catch (MongoConcurrencyException)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "Update:Error");
            }

            return update;
        }

        // Create a new employee based on the given object
        public string Create (Employee emp)
        {
            string newid = "";

            try
            {
                DbContext ctx = new DbContext();
                ctx.Save(emp, "employees");
                newid = emp._id.ToString();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "Create");
            }

            return newid;
        }

        // Delete the employee with the given id.
        public bool Delete(string id)
        {
            bool deleteOk = false;
            ObjectId empId = new ObjectId(id);

            try
            {
                DbContext ctx = new DbContext();
                Employee emp = ctx.Employees.FirstOrDefault(e => e._id == empId);
                ctx.Delete<Employee>(emp, "employees");
                deleteOk = true;
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "Delete");
            }

            return deleteOk;
        }
    }
}