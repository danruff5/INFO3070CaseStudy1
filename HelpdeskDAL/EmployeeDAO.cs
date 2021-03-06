﻿using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    public class EmployeeDAO
    {
        public Employee GetBySurname(string name)
        {
            Employee retEmp = null;
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                var employees = _ctx.Employees;
                var employee = employees.AsQueryable<Employee>().Where(emp => emp.Lastname == name).FirstOrDefault();
                retEmp = (Employee)employee;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Problem " + ex.Message);
            }

            return retEmp;
        }

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
                Console.WriteLine("Problem " + ex.Message);
            }

            return retEmp;
        }

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

        public int Update(Employee emp)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Employee>(emp, "employees");
                update = 1;
            }
            catch (MongoConcurrencyException ex)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "EmployeeDAO", "Update:Error");
            }

            return update;
        }

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