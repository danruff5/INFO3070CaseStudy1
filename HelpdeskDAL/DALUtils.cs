using MongoDB.Driver;
using System;
using System.Diagnostics;
using System.Linq;

namespace HelpdeskDAL
{
    public class DALUtils
    {
        DbContext ctx;

        /// <summary>
        /// Common DAL Error Method
        /// </summary>
        /// <param name="e">Execption thrown</param>
        /// <param name="obj">Class throwing execption</param>
        /// <param name="method">Method throwing execption</param>
        public static void ErrorRoutine(Exception e, string obj, string method)
        {
            if (e.InnerException != null)
            {
                Trace.WriteLine("Error in DAL, Objects = " 
                    + obj 
                    + ", method = " 
                    + method 
                    + ", inner execption message = " 
                    + e.InnerException.Message
                );
                throw e.InnerException;
            } else
            {
                Trace.WriteLine("Error in DAL, object = "
                    + obj
                    + ", method = "
                    + method
                    + ", message = "
                    + e.Message
                );
                throw e;
            }
        }

        /// <summary>
        /// Main Loading Method
        /// Revisions: Added Problem methods
        /// </summary>
        public bool LoadCollections()
        {
            bool createOk = false;

            try
            {
                DropAndCreateCollections();
                ctx = new DbContext();
                LoadDepartments();
                LoadEmployees();
                LoadProblems();
                createOk = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return createOk;
        }

        private void DropAndCreateCollections()
        {
            MongoClient client = new MongoClient(); // connect to localhost
            MongoServer server = client.GetServer();
            MongoDatabase db = server.GetDatabase("HelpdeskDB");

            using (server.RequestStart(db))
            {

                if (db.CollectionExists("departments"))
                {
                    db.DropCollection("departments");
                }
                if (db.CollectionExists("employees"))
                {
                    db.DropCollection("employees");
                }
                if (db.CollectionExists("problems"))
                {
                    db.DropCollection("problems");
                }

                db.CreateCollection("departments");
                db.CreateCollection("employees");
                db.CreateCollection("problems");
            }
        }

        private void LoadDepartments()
        {
            InsertDepartment("Administration");
            InsertDepartment("Sales");
            InsertDepartment("Food Services");
            InsertDepartment("Lab");
            InsertDepartment("Maintenance");
        }

        private void LoadEmployees()
        {
            InsertEmployee("Mr.", "Bigshot", "Smartypants", "(555) 555-5551", "bs@abc.com", "Administration");
            InsertEmployee("Mrs.", "Penny", "Pincher", "(555) 555-5551", "pp@abc.com", "Administration");
            InsertEmployee("Mr.", "Smoke", "Andmirrors", "(555) 555-5552", "sa@abc.com", "Sales");
            InsertEmployee("Mr.", "Sam", "Slick", "(555) 555-5552", "ss@abc.com", "Sales");
            InsertEmployee("Mr.", "Sloppy", "Joe", "(555) 555-5553", "sj@abc.com", "Food Services");
            InsertEmployee("Mr.", "Franken", "Beans", "(555) 555-5553", "fb@abc.com", "Food Services");
            InsertEmployee("Mr.", "Bunsen", "Burner", "(555) 555-5554", "bb@abc.com", "Lab");
            InsertEmployee("Ms.", "Petrie", "Dish", "(555) 555-5554", "pd@abc.com", "Lab");
            InsertEmployee("Ms.", "Mopn", "Glow", "(555) 555-5555", "mg@abc.com", "Maintenance");
            InsertEmployee("Mr.", "Spickn", "Span", "(555) 555-5555", "sps@abc.com", "Maintenance");
        }

        private void InsertDepartment(string name)
        {
            Department dep = new Department();
            dep.DepartmentName = name;
            ctx.Save<Department>(dep, "departments");
        }



        private void InsertEmployee(string title,
                                   string first,
                                   string last,
                                   string phone,
                                   string email,
                                   string dept)
        {
            Employee emp = new Employee();
            emp.Title = title;
            emp.Firstname = first;
            emp.Lastname = last;
            emp.Phoneno = phone;
            emp.Email = email;
            Department dep = ctx.Departments.AsQueryable<Department>().FirstOrDefault(d => d.DepartmentName == dept);
            emp.DepartmentId = dep._id;
            ctx.Save<Employee>(emp, "employees");
        }

        private void InsertProblem(string description)
        {
            Problem prb = new Problem();
            prb.Description = description;
            ctx.Save<Problem>(prb, "problems");
        }

        private void LoadProblems()
        {
            InsertProblem("Device Not Plugged In");
            InsertProblem("Device Not Turned On");
            InsertProblem("Hard Drive Failure");
            InsertProblem("Memory Failure");
            InsertProblem("Power Supply Failure");
            InsertProblem("Password Fails due to Caps Lock being on");
            InsertProblem("Network Card Faulty");
            InsertProblem("CPU Fan Failure");
            InsertProblem("Memory Upgrade");
            InsertProblem("Graphics Upgrade");
            InsertProblem("Needs Software Upgrade");
        }
    }
}
