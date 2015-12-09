using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    // A department data access object for interacting with the database using department objects
    public class DepartmentDAO
    {
        // Get the department by the name.
        public Department GetByName(string name)
        {
            Department retDep = null;
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retDep = _ctx.Departments.FirstOrDefault(d => d.DepartmentName == name);
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "GetbyName");
            }

            return retDep;
        }

        // Get the department by the id.
        public Department GetByID(string id)
        {
            Department retDep = null;
            ObjectId ID = new ObjectId(id);
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retDep = _ctx.Departments.FirstOrDefault(d => d._id == ID);
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "GetById");
            }

            return retDep;
        }

        // Get all of the departments.
        public List<Department> GetAll()
        {
            List<Department> allDeps = new List<Department>();

            try
            {
                DbContext ctx = new DbContext();
                allDeps = ctx.Departments.ToList();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "GetAll");
            }

            return allDeps;
        }

        // Update the department based on the given department object
        public int Update(Department dep)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Department>(dep, "departments");
                update = 1;
            }
            catch (MongoConcurrencyException)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "Update:Error");
            }

            return update;
        }

        // Create a new department based on the given department object
        public string Create (Department dep)
        {
            string newid = "";

            try
            {
                DbContext ctx = new DbContext();
                ctx.Save(dep, "departments");
                newid = dep._id.ToString();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "Create");
            }

            return newid;
        }

        // Delete the department with the given id.
        public bool Delete(string id)
        {
            bool deleteOk = false;
            ObjectId depId = new ObjectId(id);

            try
            {
                DbContext ctx = new DbContext();
                Department dep = ctx.Departments.FirstOrDefault(d => d._id == depId);
                ctx.Delete<Department>(dep, "departments");
                deleteOk = true;
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "Delete");
            }

            return deleteOk;
        }
    }
}