using HelpdeskDAL;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace HelpdeskViewModels
{
    // A problem view model for client side interation.
    public class ProblemViewModel : ViewModelUtils
    {
        private ProblemDAO _dao;
        public string Id { get; set; }
        public string Description { get; set; }
        public string Entity64 { get; set; }

        public ProblemViewModel()
        { 
            _dao = new ProblemDAO();
        }

        // Get and populate this based on the given id
        public void GetById(string id)
        {
            try
            {
                Problem prb = _dao.GetByID(id);
                Id = prb._id.ToString();
                Description = prb.Description;
                Entity64 = Convert.ToBase64String(Serializer(prb));
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "ProblemViewModel", "GetById");
            }
        }

        // Update this problem
        public int Update()
        {
            int rowUp = -1;

            try
            {
                byte[] bytEmp = Convert.FromBase64String(Entity64);
                Problem prb = (Problem)Deserializer(bytEmp);
                prb.Description = Description;
                rowUp = _dao.Update(prb);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "ProblemViewModel", "Update");
            }
            return rowUp;
        }

        // Create this problem
        public void Create()
        {
            try
            {
                Problem prb = new Problem();
                prb.Description = Description;
                Id = _dao.Create(prb);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "ProblemViewModel", "Create");
            }
        }


        // Get all the problems
        public List<ProblemViewModel> GetAll()
        {
            List<ProblemViewModel> viewModels = new List<ProblemViewModel>();

            try
            {
                List<Problem> problems = _dao.GetAll();

                foreach (Problem e in problems)
                {
                    // Return only fields for display, subdequent get will other fields
                    ProblemViewModel viewModel = new ProblemViewModel();
                    viewModel.Id = e._id.ToString();
                    viewModel.Description = e.Description;
                    viewModels.Add(viewModel); // Add to list
                }
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "ProblemViewModel", "GetAll");
            }
            return viewModels;
        }

        // Delete this problem
        public bool Delete()
        {
            bool deleteOK = false;

            try
            {
                deleteOK = _dao.Delete(Id);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "ProblemViewModel", "Delete");
            }
            return deleteOK;
        }
    }
}
