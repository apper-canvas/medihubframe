import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import PatientTable from "@/components/organisms/PatientTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { patientsService } from "@/services/api/patientsService";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientsService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message || "Failed to load patients");
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(term.toLowerCase()) ||
      patient.Id.toString().includes(term) ||
      patient.assignedDoctor.toLowerCase().includes(term.toLowerCase()) ||
      patient.status.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleAddPatient = () => {
    toast.info("Add Patient feature coming soon!");
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  if (patients.length === 0) {
    return (
      <Empty
        title="No Patients Found"
        description="There are no patients in the system yet. Add the first patient to get started."
        icon="Users"
        actionLabel="Add First Patient"
        onAction={handleAddPatient}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-gray-600 mt-1">
            Manage and monitor all patient records and information
          </p>
        </div>
        <Button onClick={handleAddPatient} className="btn-primary">
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search by name, ID, doctor, or status..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="secondary" size="sm">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-500">Total Patients</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-success/10 to-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="h-5 w-5 text-success" />
            </div>
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.status === "Admitted").length}
              </p>
              <p className="text-sm text-gray-500">Admitted</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-error/10 to-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-error" />
            </div>
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.status === "Emergency").length}
              </p>
              <p className="text-sm text-gray-500">Emergency</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserX" className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.status === "Discharged").length}
              </p>
              <p className="text-sm text-gray-500">Discharged</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 && searchTerm ? (
        <Empty
          title="No Search Results"
          description={`No patients found matching "${searchTerm}". Try adjusting your search terms.`}
          icon="Search"
        />
      ) : (
        <PatientTable patients={filteredPatients} loading={false} />
      )}
    </div>
  );
};

export default Patients;