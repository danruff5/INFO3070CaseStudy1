using MongoDB.Bson;
using MongoDB.Kennedy;

namespace HelpdeskDAL
{
    public class Department : IMongoEntity
    {
        public ObjectId _id { get; set; }
        public string _accessId { get; set; }
        public string DepartmentName { get; set; }
    }
}

