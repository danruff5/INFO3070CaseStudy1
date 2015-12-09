using MongoDB.Bson;
using MongoDB.Kennedy;

namespace HelpdeskDAL
{
    // Department object for the employees and thrie jobs.
    [System.Serializable]
    public class Department : IMongoEntity
    {
        public ObjectId _id { get; set; }
        public string _accessId { get; set; }
        public string DepartmentName { get; set; }
        public string Entity64 { get; set; }
    }
}

